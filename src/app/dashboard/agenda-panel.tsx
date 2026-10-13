import { getSql } from "@/lib/db";
import { createAppointment, createService, updateAppointmentStatus } from "@/app/actions";
import { ArrowUpRight, CalendarDays, ClipboardList, Plus, ShieldCheck } from "lucide-react";

type Props = { organizationId: string; membershipId: string; role: string };

export default async function AgendaPanel({ organizationId, membershipId, role }: Props) {
  if (!["org_owner", "org_admin", "coordinator", "reception", "professional"].includes(role)) {
    return <section className="surface data-panel" id="rotina"><div className="section-heading"><div><p className="eyebrow">ROTINA DA ORGANIZAÇÃO</p><h2>Agenda de compromissos</h2><p>Seu perfil não tem permissão para visualizar a agenda.</p></div></div></section>;
  }

  const sql = getSql();
  const [beneficiaries, services, profiles, appointments] = await Promise.all([
    sql`SELECT id, record_number, full_name FROM beneficiaries WHERE organization_id = ${organizationId} AND administrative_status = 'active' ORDER BY full_name ASC LIMIT 200`,
    sql`SELECT id, name, description, duration_minutes FROM services WHERE organization_id = ${organizationId} AND is_active = true ORDER BY name ASC`,
    sql`SELECT id, display_name, professional_category FROM professional_profiles WHERE organization_id = ${organizationId} AND is_active = true AND (${role} <> 'professional' OR membership_id = ${membershipId}) ORDER BY display_name ASC`,
    sql`SELECT a.id, a.starts_at, a.ends_at, a.status, a.client_note, b.full_name AS beneficiary_name, s.name AS service_name, p.display_name AS professional_name
        FROM appointments a
        JOIN beneficiaries b ON b.id = a.beneficiary_id AND b.organization_id = a.organization_id
        JOIN services s ON s.id = a.service_id AND s.organization_id = a.organization_id
        JOIN professional_profiles p ON p.id = a.professional_profile_id AND p.organization_id = a.organization_id
        WHERE a.organization_id = ${organizationId}
          AND a.starts_at >= ((date_trunc('day', now() AT TIME ZONE 'America/Sao_Paulo')) AT TIME ZONE 'America/Sao_Paulo')
          AND a.starts_at < (((date_trunc('day', now() AT TIME ZONE 'America/Sao_Paulo') + interval '14 days')) AT TIME ZONE 'America/Sao_Paulo')
          AND a.status <> 'cancelled'
          AND (${role} <> 'professional' OR a.professional_profile_id IN (
            SELECT p2.id FROM professional_profiles p2
            WHERE p2.organization_id = ${organizationId} AND p2.membership_id = ${membershipId} AND p2.is_active = true
          ))
        ORDER BY a.starts_at ASC LIMIT 30`
  ]);

  const canManageServices = ["org_owner", "org_admin", "coordinator"].includes(role);
  const canCreateAppointments = ["org_owner", "org_admin", "coordinator", "reception", "professional"].includes(role);

  const statusLabels: Record<string, string> = {
    requested: "Solicitado", confirmed: "Confirmado", checked_in: "Em atendimento",
    completed: "Concluído", no_show: "Não compareceu", cancelled: "Cancelado"
  };

  return (
    <section className="surface data-panel" id="rotina">
      <div className="section-heading"><div><p className="eyebrow">ROTINA DA ORGANIZAÇÃO</p><h2>Agenda de compromissos</h2><p>Cadastre e acompanhe os compromissos da equipe.</p></div></div>

      {canManageServices && <details className="inline-create"><summary><Plus size={16} /> Cadastrar serviço</summary><form action={createService} className="stack-form">
        <label>Nome do serviço<input name="name" placeholder="Ex.: Atendimento social" required minLength={2} maxLength={120} /></label>
        <label>Duração padrão<select name="duration_minutes" defaultValue="30"><option value="15">15 minutos</option><option value="30">30 minutos</option><option value="45">45 minutos</option><option value="60">1 hora</option><option value="90">1 hora e 30 minutos</option><option value="120">2 horas</option></select></label>
        <label>Descrição <span className="optional-label">opcional</span><textarea name="description" rows={2} maxLength={500} placeholder="Descrição breve do serviço" /></label>
        <button className="primary-button" type="submit">Salvar serviço <ArrowUpRight size={16} /></button>
      </form></details>}

      {canCreateAppointments && beneficiaries.length > 0 && services.length > 0 && profiles.length > 0 && <details className="inline-create"><summary><Plus size={16} /> Novo compromisso</summary><form action={createAppointment} className="stack-form">
        <label>Beneficiário<select name="beneficiary_id" required defaultValue=""><option value="" disabled>Selecione uma pessoa</option>{beneficiaries.map((item) => <option key={String(item.id)} value={String(item.id)}>{String(item.full_name)} · {String(item.record_number)}</option>)}</select></label>
        <label>Serviço<select name="service_id" required defaultValue=""><option value="" disabled>Selecione um serviço</option>{services.map((item) => <option key={String(item.id)} value={String(item.id)}>{String(item.name)} · {Number(item.duration_minutes)} min</option>)}</select></label>
        <label>Profissional<select name="professional_profile_id" required defaultValue=""><option value="" disabled>Selecione um profissional</option>{profiles.map((item) => <option key={String(item.id)} value={String(item.id)}>{String(item.display_name)} · {String(item.professional_category)}</option>)}</select></label>
        <label>Data<input name="appointment_date" type="date" required /></label>
        <div className="form-two-columns"><label>Início<input name="starts_at" type="time" required /></label><label>Término<input name="ends_at" type="time" required /></label></div>
        <label>Observação administrativa <span className="optional-label">opcional</span><textarea name="client_note" rows={2} maxLength={500} placeholder="Observação breve para a equipe" /></label>
        <button className="primary-button" type="submit">Salvar compromisso <CalendarDays size={16} /></button>
      </form></details>}

      {services.length === 0 && <div className="empty-state compact-empty"><span className="empty-icon"><ClipboardList size={20} /></span><strong>Nenhum serviço cadastrado</strong><p>Cadastre um serviço para habilitar a criação de compromissos.</p></div>}
      {services.length > 0 && beneficiaries.length === 0 && <div className="empty-state compact-empty"><span className="empty-icon"><CalendarDays size={20} /></span><strong>Cadastre um beneficiário primeiro</strong><p>Os compromissos precisam estar vinculados a um cadastro da organização.</p></div>}
      {services.length > 0 && profiles.length === 0 && <div className="empty-state compact-empty"><span className="empty-icon"><ShieldCheck size={20} /></span><strong>Falta configurar a equipe</strong><p>Crie ao menos um perfil profissional antes de agendar.</p></div>}

      {appointments.length > 0 ? <div className="agenda-real-list">{appointments.map((item) => {
        const status = String(item.status);
        return <article className="agenda-real-item" key={String(item.id)}>
          <div className="agenda-real-time"><strong>{new Date(String(item.starts_at)).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" })}</strong><span>{new Date(String(item.ends_at)).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" })}</span><small>{new Date(String(item.starts_at)).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", timeZone: "America/Sao_Paulo" })}</small></div>
          <div className="agenda-real-main"><strong>{String(item.service_name)}</strong><p>{String(item.beneficiary_name)} · {String(item.professional_name)}</p>{item.client_note && <small>{String(item.client_note)}</small>}
            <div className="agenda-real-actions"><span className={"table-status " + (status === "completed" ? "agenda-done" : status === "confirmed" ? "agenda-confirmed" : "")}>{statusLabels[status] || status}</span>
              <form action={updateAppointmentStatus} className="agenda-status-form"><input type="hidden" name="appointment_id" value={String(item.id)} /><select name="status" aria-label={"Status de " + String(item.service_name)} defaultValue={status}><option value="requested">Solicitado</option><option value="confirmed">Confirmado</option><option value="checked_in">Em atendimento</option><option value="completed">Concluído</option><option value="no_show">Não compareceu</option><option value="cancelled">Cancelar</option></select><button className="secondary-button" type="submit">Atualizar</button></form>
            </div>
          </div>
        </article>;
      })}</div> : <div className="empty-state compact-empty"><span className="empty-icon"><CalendarDays size={20} /></span><strong>Nenhum compromisso nos próximos 14 dias</strong><p>Os compromissos cadastrados aparecerão aqui, organizados por data e horário.</p></div>}

      <div className="product-principle"><ShieldCheck size={18} /><div><strong>Histórico e organização</strong><p>Os compromissos são consultados dentro da organização vinculada à sua conta, e as alterações de status são registradas na auditoria.</p></div></div>
    </section>
  );
}
