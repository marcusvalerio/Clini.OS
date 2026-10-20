"use server";

import { auth } from "@/lib/auth/server";
import { getSql } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireUser() {
  if (!auth) redirect("/setup");
  const result = await auth.getSession();
  const user = result.data?.user;
  if (!user?.id || !user.email) redirect("/auth/sign-in");
  return { id: user.id, email: user.email, name: user.name || user.email };
}

async function getMembership(user: { id: string; email: string; name: string }) {
  const sql = getSql();
  const rows = await sql`
    SELECT u.id AS user_id, m.id AS membership_id, m.organization_id, m.role, o.name AS organization_name
    FROM app_users u
    JOIN memberships m ON m.user_id = u.id AND m.is_active = true
    JOIN organizations o ON o.id = m.organization_id AND o.is_active = true
    WHERE u.auth_subject = ${user.id} AND u.is_active = true
    ORDER BY m.created_at ASC
    LIMIT 1
  `;
  return rows[0] as { user_id: string; membership_id: string; organization_id: string; role: string; organization_name: string } | undefined;
}

export async function createOrganization(formData: FormData) {
  const user = await requireUser();
  const name = String(formData.get("name") || "").trim().slice(0, 160);
  if (name.length < 3) redirect("/dashboard?notice=organization-invalid");
  const slug = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) + "-" + crypto.randomUUID().slice(0, 6);
  const sql = getSql();
  const existing = await getMembership(user);
  if (existing) redirect("/dashboard?notice=organization-exists");

  const userRows = await sql`
    INSERT INTO app_users (auth_subject, email, full_name)
    VALUES (${user.id}, ${user.email.toLowerCase()}, ${user.name})
    ON CONFLICT (auth_subject) DO UPDATE SET email = EXCLUDED.email, full_name = EXCLUDED.full_name, updated_at = now()
    RETURNING id
  `;
  const userId = String(userRows[0].id);
  const orgRows = await sql`
    INSERT INTO organizations (name, slug)
    VALUES (${name}, ${slug})
    RETURNING id
  `;
  await sql`
    INSERT INTO memberships (organization_id, user_id, role)
    VALUES (${String(orgRows[0].id)}, ${userId}, 'org_owner')
  `;
  revalidatePath("/dashboard");
  redirect("/dashboard?notice=organization-created");
}

export async function createBeneficiary(formData: FormData) {
  const user = await requireUser();
  const membership = await getMembership(user);
  if (!membership || !["org_owner", "org_admin", "coordinator", "reception"].includes(membership.role)) {
    redirect("/dashboard?notice=access-denied");
  }
  const name = String(formData.get("full_name") || "").trim().slice(0, 160);
  const birthDateRaw = String(formData.get("birth_date") || "").trim();
  const guardianName = String(formData.get("guardian_name") || "").trim().slice(0, 160);
  const guardianPhone = String(formData.get("guardian_phone") || "").trim().slice(0, 40);
  const relationship = String(formData.get("relationship") || "responsável").trim().slice(0, 60);
  if (name.length < 2) redirect("/dashboard?notice=beneficiary-invalid");
  const birthDate = /^\d{4}-\d{2}-\d{2}$/.test(birthDateRaw) ? birthDateRaw : null;
  const recordNumber = "CL-" + crypto.randomUUID().slice(0, 8).toUpperCase();
  const sql = getSql();
  const beneficiaryRows = await sql`
    INSERT INTO beneficiaries (organization_id, record_number, full_name, birth_date, created_by_membership_id)
    VALUES (${membership.organization_id}, ${recordNumber}, ${name}, ${birthDate}, ${membership.membership_id})
    RETURNING id
  `;
  if (guardianName.length > 1) {
    const guardianRows = await sql`
      INSERT INTO guardians (organization_id, full_name, phone)
      VALUES (${membership.organization_id}, ${guardianName}, ${guardianPhone || null})
      RETURNING id
    `;
    await sql`
      INSERT INTO beneficiary_guardians (organization_id, beneficiary_id, guardian_id, relationship, is_primary_contact)
      VALUES (${membership.organization_id}, ${String(beneficiaryRows[0].id)}, ${String(guardianRows[0].id)}, ${relationship || "responsável"}, true)
    `;
  }
  await sql`
    INSERT INTO audit_logs (organization_id, actor_membership_id, action, resource_type, metadata)
    VALUES (${membership.organization_id}, ${membership.membership_id}, 'beneficiary.created', 'beneficiary', jsonb_build_object('record_number', ${recordNumber}))
  `;
  revalidatePath("/dashboard");
  redirect("/dashboard?notice=beneficiary-created");
}

export async function createProfessionalProfile(formData: FormData) {
  const user = await requireUser();
  const membership = await getMembership(user);
  if (!membership || !["org_owner", "org_admin", "coordinator", "professional"].includes(membership.role)) redirect("/dashboard?notice=access-denied");
  const displayName = String(formData.get("display_name") || "").trim().slice(0, 120);
  const category = String(formData.get("professional_category") || "").trim().slice(0, 100);
  if (displayName.length < 2 || category.length < 2) redirect("/dashboard?notice=profile-invalid");
  const sql = getSql();
  await sql`
    INSERT INTO professional_profiles (organization_id, membership_id, display_name, professional_category)
    VALUES (${membership.organization_id}, ${membership.membership_id}, ${displayName}, ${category})
    ON CONFLICT (organization_id, membership_id)
    DO UPDATE SET display_name = EXCLUDED.display_name, professional_category = EXCLUDED.professional_category, is_active = true
  `;
  revalidatePath("/dashboard");
  redirect("/dashboard?notice=profile-created");
}

export async function createFollowUp(formData: FormData) {
  const user = await requireUser();
  const membership = await getMembership(user);
  if (!membership || !["org_owner", "org_admin", "coordinator", "professional"].includes(membership.role)) redirect("/dashboard?notice=access-denied");
  const beneficiaryId = String(formData.get("beneficiary_id") || "");
  const summary = String(formData.get("summary") || "").trim().slice(0, 5000);
  const noteType = String(formData.get("note_type") || "progress");
  if (!/^[0-9a-f-]{36}$/i.test(beneficiaryId) || summary.length < 3) redirect("/dashboard?notice=followup-invalid");
  const sql = getSql();
  const profiles = await sql`
    SELECT id FROM professional_profiles
    WHERE organization_id = ${membership.organization_id} AND membership_id = ${membership.membership_id} AND is_active = true
    LIMIT 1
  `;
  if (!profiles[0]) redirect("/dashboard?notice=profile-required");
  const beneficiaries = await sql`
    SELECT id FROM beneficiaries WHERE id = ${beneficiaryId} AND organization_id = ${membership.organization_id} AND administrative_status = 'active'
    LIMIT 1
  `;
  if (!beneficiaries[0]) redirect("/dashboard?notice=beneficiary-not-found");
  const encounterRows = await sql`
    INSERT INTO encounters (organization_id, beneficiary_id, professional_profile_id, status, started_at, created_by_membership_id)
    VALUES (${membership.organization_id}, ${beneficiaryId}, ${String(profiles[0].id)}, 'completed', now(), ${membership.membership_id})
    RETURNING id
  `;
  const allowedTypes = ["progress", "observation", "referral", "plan", "other"];
  const safeType = allowedTypes.includes(noteType) ? noteType : "progress";
  await sql`
    INSERT INTO clinical_notes (organization_id, encounter_id, author_membership_id, note_type, content)
    VALUES (${membership.organization_id}, ${String(encounterRows[0].id)}, ${membership.membership_id}, ${safeType}, ${summary})
  `;
  await sql`
    INSERT INTO audit_logs (organization_id, actor_membership_id, action, resource_type, resource_id)
    VALUES (${membership.organization_id}, ${membership.membership_id}, 'followup.created', 'encounter', ${String(encounterRows[0].id)})
  `;
  revalidatePath("/dashboard");
  redirect("/dashboard?notice=followup-created");
}


export async function createService(formData: FormData) {
  const user = await requireUser();
  const membership = await getMembership(user);
  if (!membership || !["org_owner", "org_admin", "coordinator"].includes(membership.role)) {
    redirect("/dashboard?notice=access-denied");
  }

  const name = String(formData.get("name") || "").trim().slice(0, 120);
  const description = String(formData.get("description") || "").trim().slice(0, 500);
  const duration = Number(formData.get("duration_minutes") || 30);
  if (name.length < 2 || !Number.isInteger(duration) || duration < 5 || duration > 480) {
    redirect("/dashboard?notice=service-invalid");
  }

  const sql = getSql();
  const existing = await sql`
    SELECT id FROM services
    WHERE organization_id = ${membership.organization_id} AND lower(name) = lower(${name}) AND is_active = true
    LIMIT 1
  `;
  if (existing[0]) redirect("/dashboard?notice=service-exists");

  const rows = await sql`
    INSERT INTO services (organization_id, name, description, duration_minutes)
    VALUES (${membership.organization_id}, ${name}, ${description || null}, ${duration})
    RETURNING id
  `;
  await sql`
    INSERT INTO audit_logs (organization_id, actor_membership_id, action, resource_type, resource_id)
    VALUES (${membership.organization_id}, ${membership.membership_id}, 'service.created', 'service', ${String(rows[0].id)})
  `;
  revalidatePath("/dashboard");
  redirect("/dashboard?notice=service-created");
}

export async function createAppointment(formData: FormData) {
  const user = await requireUser();
  const membership = await getMembership(user);
  if (!membership || !["org_owner", "org_admin", "coordinator", "reception", "professional"].includes(membership.role)) {
    redirect("/dashboard?notice=access-denied");
  }

  const beneficiaryId = String(formData.get("beneficiary_id") || "");
  const serviceId = String(formData.get("service_id") || "");
  const profileId = String(formData.get("professional_profile_id") || "");
  const date = String(formData.get("appointment_date") || "");
  const start = String(formData.get("starts_at") || "");
  const end = String(formData.get("ends_at") || "");
  const note = String(formData.get("client_note") || "").trim().slice(0, 500);

  if (![beneficiaryId, serviceId, profileId].every((id) => /^[0-9a-f-]{36}$/i.test(id)) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(start) ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(end) || end <= start) {
    redirect("/dashboard?notice=appointment-invalid");
  }

  const sql = getSql();
  const [beneficiaries, services, profiles] = await Promise.all([
    sql`SELECT id FROM beneficiaries WHERE id = ${beneficiaryId} AND organization_id = ${membership.organization_id} AND administrative_status = 'active' LIMIT 1`,
    sql`SELECT id FROM services WHERE id = ${serviceId} AND organization_id = ${membership.organization_id} AND is_active = true LIMIT 1`,
    sql`SELECT id FROM professional_profiles WHERE id = ${profileId} AND organization_id = ${membership.organization_id} AND is_active = true AND (${membership.role} <> 'professional' OR membership_id = ${membership.membership_id}) LIMIT 1`
  ]);
  if (!beneficiaries[0]) redirect("/dashboard?notice=beneficiary-not-found");
  if (!services[0] || !profiles[0]) redirect("/dashboard?notice=appointment-invalid");

  const overlaps = await sql`
    SELECT id FROM appointments
    WHERE organization_id = ${membership.organization_id}
      AND professional_profile_id = ${profileId}
      AND status IN ('requested', 'confirmed', 'checked_in')
      AND starts_at < ((${date}::date + ${end}::time) AT TIME ZONE 'America/Sao_Paulo')
      AND ends_at > ((${date}::date + ${start}::time) AT TIME ZONE 'America/Sao_Paulo')
    LIMIT 1
  `;
  if (overlaps[0]) redirect("/dashboard?notice=appointment-overlap");

  const rows = await sql`
    INSERT INTO appointments (
      organization_id, beneficiary_id, service_id, professional_profile_id,
      starts_at, ends_at, status, client_note, created_by_membership_id
    )
    VALUES (
      ${membership.organization_id}, ${beneficiaryId}, ${serviceId}, ${profileId},
      ((${date}::date + ${start}::time) AT TIME ZONE 'America/Sao_Paulo'),
      ((${date}::date + ${end}::time) AT TIME ZONE 'America/Sao_Paulo'),
      'requested', ${note || null}, ${membership.membership_id}
    )
    RETURNING id
  `;
  await sql`
    INSERT INTO audit_logs (organization_id, actor_membership_id, action, resource_type, resource_id)
    VALUES (${membership.organization_id}, ${membership.membership_id}, 'appointment.created', 'appointment', ${String(rows[0].id)})
  `;
  revalidatePath("/dashboard");
  redirect("/dashboard?notice=appointment-created");
}

export async function updateAppointmentStatus(formData: FormData) {
  const user = await requireUser();
  const membership = await getMembership(user);
  if (!membership || !["org_owner", "org_admin", "coordinator", "reception", "professional"].includes(membership.role)) {
    redirect("/dashboard?notice=access-denied");
  }

  const appointmentId = String(formData.get("appointment_id") || "");
  const status = String(formData.get("status") || "");
  const allowedStatuses = ["requested", "confirmed", "checked_in", "completed", "cancelled", "no_show"];
  if (!/^[0-9a-f-]{36}$/i.test(appointmentId) || !allowedStatuses.includes(status)) {
    redirect("/dashboard?notice=appointment-invalid");
  }

  const sql = getSql();
  const rows = await sql`
    UPDATE appointments
    SET status = ${status}::appointment_status,
        cancelled_at = CASE WHEN ${status} = 'cancelled' THEN now() ELSE NULL END,
        updated_at = now()
    WHERE id = ${appointmentId} AND organization_id = ${membership.organization_id}
      AND (${membership.role} <> 'professional' OR EXISTS (
        SELECT 1 FROM professional_profiles p
        WHERE p.id = appointments.professional_profile_id
          AND p.organization_id = appointments.organization_id
          AND p.membership_id = ${membership.membership_id}
          AND p.is_active = true
      ))
    RETURNING id
  `;
  if (!rows[0]) redirect("/dashboard?notice=appointment-not-found");

  await sql`
    INSERT INTO audit_logs (organization_id, actor_membership_id, action, resource_type, resource_id, metadata)
    VALUES (${membership.organization_id}, ${membership.membership_id}, 'appointment.status_updated', 'appointment', ${appointmentId}, jsonb_build_object('status', ${status}))
  `;
  revalidatePath("/dashboard");
  redirect("/dashboard?notice=appointment-updated");
}
