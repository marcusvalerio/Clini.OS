import { auth } from "@/lib/auth/server";
import { getSql } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Activity, ArrowUpRight, CalendarDays, CheckCircle2, ClipboardList, FileText,
  HeartHandshake, LayoutDashboard, LogOut, Plus, ShieldCheck, Users, Wallet
} from "lucide-react";
import { createBeneficiary, createFollowUp, createOrganization, createProfessionalProfile } from "@/app/actions";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ notice?: string }>;

const notices: Record<string, string> = {
  "organization-created": "Organização criada. O espaço de trabalho está pronto.",
  "organization-exists": "Sua conta já possui uma organização vinculada.",
  "organization-invalid": "Informe o nome da organização (mínimo de 3 caracteres).",
  "beneficiary-created": "Cadastro registrado com sucesso.",
  "beneficiary-invalid": "Confira o nome informado.",
  "profile-created": "Perfil profissional atualizado.",
  "profile-invalid": "Informe o nome e a categoria profissional.",
  "followup-created": "Acompanhamento registrado.",
  "followup-invalid": "Selecione um beneficiário e escreva um registro válido.",
  "profile-required": "Antes de registrar um acompanhamento, configure seu perfil profissional.",
  "beneficiary-not-found": "O beneficiário selecionado não está disponível.",
  "access-denied": "Seu perfil não tem permissão para esta ação."
};

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>{description}</p></div></div>;
}

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  if (!auth) redirect("/setup");
  const sessionResult = await auth.getSession();
  const user = sessionResult.data?.user;
  if (!user?.id || !user.email) redirect("/auth/sign-in");

  const sql = getSql();
  const userRows = await sql`
    SELECT id FROM app_users WHERE auth_subject = ${user.id} AND is_active = true LIMIT 1
  `;
  let membership: { organization_id: string; role: string; organization_name: string; membership_id: string } | undefined;
  if (userRows[0]) {
    const memberships = await sql`
      SELECT m.organization_id, m.id AS membership_id, m.role, o.name AS organization_name
      FROM memberships m JOIN organizations o ON o.id = m.organization_id
      WHERE m.user_id = ${String(userRows[0].id)} AND m.is_active = true AND o.is_active = true
      ORDER BY m.created_at ASC LIMIT 1
    `;
    membership = memberships[0] as typeof membership;
  }

  const query = await searchParams;
  const notice = query.notice ? notices[query.notice] : undefined;
  const displayName = user.name || user.email.split("@")[0];
  if (!membership) {
    return (
      <main className="app-shell">
        <aside className="sidebar">
          <Link href="/" className="brand-lockup"><span className="brand-mark"><HeartHandshake size={21} /></span><span>Clini<span className="brand-light">.OS</span></span></Link>
          <div className="sidebar-note"><ShieldCheck size={18} /><span>Privacidade desde o início</span></div>
        </aside>
        <section className="main-panel">
          <header className="topbar"><span>Primeiro acesso</span><span className="user-pill">{displayName}</span></header>
          <div className="content-wrap narrow-content">
            <div className="welcome-block"><span className="icon-tile"><HeartHandshake size={22} /></span><p className="eyebrow">BEM-VINDO AO CLINI.OS</p><h1>Vamos preparar seu espaço de trabalho.</h1><p>Comece pela organização. Depois você poderá cadastrar beneficiários, estruturar a equipe e registrar acompanhamentos.</p></div>
            {notice && <div className="notice">{notice}</div>}
            <section className="surface form-card">
              <h2>Configure a organização</h2><p>Use o nome institucional pelo qual sua equipe reconhece a organização.</p>
              <form action={createOrganization} className="stack-form">
                <label>Nome da organização<input name="name" placeholder="Ex.: Instituto Caminhos" required minLength={3} maxLength={160} /></label>
                <button className="primary-button" type="submit">Criar espaço de trabalho <ArrowUpRight size={16} /></button>
              </form>
            </section>
            <p className="security-note"><ShieldCheck size={16} /> Não use dados reais de beneficiários até concluir a revisão de segurança e permissões.</p>
          </div>
        </section>
      </main>
    );
  }

  const [beneficiaryRows, encounterRows, profileRows, countsRows] = await Promise.all([
    sql`SELECT id, record_number, full_name, birth_date, administrative_status, created_at FROM beneficiaries WHERE organization_id = ${membership.organization_id} AND administrative_status <> 'archived' ORDER BY created_at DESC LIMIT 12`,
    sql`SELECT e.id, e.created_at, b.full_name AS beneficiary_name, p.display_name AS professional_name, n.content, n.note_type FROM encounters e JOIN beneficiaries b ON b.id = e.beneficiary_id AND b.organization_id = e.organization_id JOIN professional_profiles p ON p.id = e.professional_profile_id AND p.organization_id = e.organization_id LEFT JOIN clinical_notes n ON n.encounter_id = e.id AND n.organization_id = e.organization_id WHERE e.organization_id = ${membership.organization_id} ORDER BY e.created_at DESC LIMIT 5`,
    sql`SELECT id, display_name, professional_category FROM professional_profiles WHERE organization_id = ${membership.organization_id} AND membership_id = ${membership.membership_id} AND is_active = true LIMIT 1`,
    sql`SELECT (SELECT count(*)::int FROM beneficiaries WHERE organization_id = ${membership.organization_id} AND administrative_status = 'active') AS beneficiaries, (SELECT count(*)::int FROM encounters WHERE organization_id = ${membership.organization_id}) AS followups, (SELECT count(*)::int FROM services WHERE organization_id = ${membership.organization_id} AND is_active = true) AS services`
  ]);
  const counts = countsRows[0] as { beneficiaries: number; followups: number; services: number };
  const canManage = ["org_owner", "org_admin", "coordinator", "reception"].includes(membership.role);
  const canWriteFollowups = ["org_owner", "org_admin", "coordinator", "professional"].includes(membership.role);
  const profile = profileRows[0] as { id: string; display_name: string; professional_category: string } | undefined;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <Link href="/dashboard" className="brand-lockup"><span className="brand-mark"><HeartHandshake size={21} /></span><span>Clini<span className="brand-light">.OS</span></span></Link>
        <div className="org-switcher"><span className="org-avatar"><HeartHandshake size={18} /></span><span><strong>{membership.organization_name}</strong><small>Espaço de trabalho</small></span></div>
        <p className="nav-label">OPERAÇÃO SOCIAL</p>
        <nav className="side-nav">
          <Link href="/dashboard" className="nav-item active"><LayoutDashboard size={18} /> Visão geral</Link>
          <a href="#beneficiarios" className="nav-item"><Users size={18} /> Beneficiários</a>
          <a href="#acompanhamentos" className="nav-item"><HeartHandshake size={18} /> Acompanhamentos</a>
          <a href="#rotina" className="nav-item"><CalendarDays size={18} /> Agenda e atividades</a>
          <a href="#documentos" className="nav-item"><FileText size={18} /> Documentos</a>
        </nav>
        <p className="nav-label">ADMINISTRAÇÃO</p>
        <nav className="side-nav">
          <a href="#equipe" className="nav-item"><ShieldCheck size={18} /> Equipe e acessos</a>
          <a href="#indicadores" className="nav-item"><Wallet size={18} /> Indicadores</a>
        </nav>
        <div className="sidebar-bottom"><div className="sidebar-note"><ShieldCheck size={18} /><span><strong>Privacidade em primeiro lugar</strong><small>Dados reais só após validação de segurança.</small></span></div><form action={async () => { "use server"; if (auth) await auth.signOut(); redirect("/auth/sign-in"); }}><button className="logout-button"><LogOut size={16} /> Sair da conta</button></form></div>
      </aside>
      <section className="main-panel">
        <header className="topbar"><div className="breadcrumb">Organização <span>/</span> <strong>Visão geral</strong></div><div className="topbar-actions"><span className="status-chip"><span /> Ambiente de desenvolvimento</span><span className="user-pill">{displayName}</span></div></header>
        <div className="content-wrap">
          {notice && <div className="notice">{notice}</div>}
          <div className="welcome-row"><div><p className="eyebrow">GESTÃO DE CUIDADO</p><h1>Organize o cuidado. <em>Ganhe clareza.</em></h1><p className="lead">Tudo o que sua equipe precisa para acompanhar pessoas, rotinas e atividades em um só lugar.</p></div><span className="date-label">{new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "America/Sao_Paulo" })}</span></div>
          <section className="metrics-grid" id="indicadores">
            <article className="metric-card"><span className="metric-icon"><Users size={18} /></span><p>Beneficiários ativos</p><strong>{Number(counts.beneficiaries)}</strong><small>Registros ativos na organização</small></article>
            <article className="metric-card"><span className="metric-icon"><HeartHandshake size={18} /></span><p>Acompanhamentos</p><strong>{Number(counts.followups)}</strong><small>Registros profissionais realizados</small></article>
            <article className="metric-card"><span className="metric-icon"><ClipboardList size={18} /></span><p>Serviços ativos</p><strong>{Number(counts.services)}</strong><small>Serviços configurados</small></article>
            <article className="metric-card highlight-metric"><span className="metric-icon"><Activity size={18} /></span><p>Próxima prioridade</p><strong className="metric-word">{Number(counts.beneficiaries) === 0 ? "Cadastrar" : profile ? "Acompanhar" : "Equipe"}</strong><small>{Number(counts.beneficiaries) === 0 ? "Adicione o primeiro beneficiário" : profile ? "Registre a continuidade do cuidado" : "Configure seu perfil profissional"}</small></article>
          </section>
          <div className="dashboard-grid">
            <section className="surface data-panel" id="beneficiarios">
              <SectionTitle eyebrow="CADASTRO ÚNICO" title="Beneficiários" description="Pessoas acompanhadas pela organização." />
              {canManage && <details className="inline-create"><summary><Plus size={16} /> Novo beneficiário</summary><form action={createBeneficiary} className="stack-form"><label>Nome completo<input name="full_name" placeholder="Nome do beneficiário" required minLength={2} maxLength={160} /></label><label>Data de nascimento <span className="optional-label">opcional</span><input name="birth_date" type="date" /></label><div className="form-divider">Responsável familiar <span>opcional</span></div><label>Nome do responsável<input name="guardian_name" placeholder="Nome do responsável" maxLength={160} /></label><label>Telefone do responsável<input name="guardian_phone" type="tel" placeholder="(21) 99999-9999" maxLength={40} /></label><label>Vínculo com o beneficiário<select name="relationship" defaultValue="responsável"><option value="mãe">Mãe</option><option value="pai">Pai</option><option value="avó/avô">Avó ou avô</option><option value="tutor legal">Tutor legal</option><option value="responsável">Responsável</option><option value="outro">Outro</option></select></label><button className="primary-button" type="submit">Salvar cadastro <ArrowUpRight size={16} /></button></form></details>}
              {beneficiaryRows.length ? <div className="table-wrap"><table><thead><tr><th>Nome</th><th>Nº de cadastro</th><th>Status</th></tr></thead><tbody>{beneficiaryRows.map((item) => <tr key={String(item.id)}><td><strong>{String(item.full_name)}</strong><small>{item.birth_date ? new Date(String(item.birth_date)).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "Nascimento não informado"}</small></td><td>{String(item.record_number)}</td><td><span className="table-status">{String(item.administrative_status) === "active" ? "Ativo" : String(item.administrative_status) === "waiting_list" ? "Lista de espera" : "Inativo"}</span></td></tr>)}</tbody></table></div> : <div className="empty-state"><span className="empty-icon"><Users size={20} /></span><strong>Nenhum beneficiário cadastrado</strong><p>Comece com um cadastro administrativo básico. Não inclua informações sensíveis neste ambiente de MVP.</p></div>}
            </section>
            <section className="surface data-panel" id="equipe">
              <SectionTitle eyebrow="EQUIPE E ACESSOS" title="Perfil profissional" description="Configure seu perfil para registrar acompanhamentos." />
              {profile ? <div className="profile-summary"><span className="profile-avatar">{profile.display_name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()}</span><div><strong>{profile.display_name}</strong><p>{profile.professional_category}</p><span className="table-status">Perfil ativo</span></div></div> : <form action={createProfessionalProfile} className="stack-form"><label>Nome de exibição<input name="display_name" placeholder={displayName} required minLength={2} maxLength={120} /></label><label>Categoria profissional<input name="professional_category" placeholder="Ex.: Psicologia, Serviço social, Coordenação" required minLength={2} maxLength={100} /></label><button className="secondary-button" type="submit">Salvar perfil <ArrowUpRight size={16} /></button></form>}
              <div className="permission-note"><ShieldCheck size={17} /><p>O MVP limita as operações por perfil e organização. Antes de dados reais, ainda é necessária uma revisão independente dos controles de acesso.</p></div>
            </section>
          </div>
          <div className="dashboard-grid lower-grid">
            <section className="surface data-panel" id="acompanhamentos">
              <SectionTitle eyebrow="CONTINUIDADE DO CUIDADO" title="Acompanhamentos recentes" description="Registros profissionais da sua organização." />
              {canWriteFollowups && profile && beneficiaryRows.length > 0 && <details className="inline-create"><summary><Plus size={16} /> Registrar acompanhamento</summary><form action={createFollowUp} className="stack-form"><label>Beneficiário<select name="beneficiary_id" required defaultValue=""><option value="" disabled>Selecione uma pessoa</option>{beneficiaryRows.map((item) => <option key={String(item.id)} value={String(item.id)}>{String(item.full_name)}</option>)}</select></label><label>Tipo de registro<select name="note_type" defaultValue="progress"><option value="progress">Evolução</option><option value="observation">Observação</option><option value="referral">Encaminhamento</option><option value="plan">Plano de acompanhamento</option><option value="other">Outro</option></select></label><label>Registro<textarea name="summary" rows={4} required minLength={3} maxLength={5000} placeholder="Registre um resumo objetivo do acompanhamento." /></label><button className="primary-button" type="submit">Salvar registro <ArrowUpRight size={16} /></button></form></details>}
              {encounterRows.length ? <div className="timeline">{encounterRows.map((item) => <article className="timeline-item" key={String(item.id)}><span className="timeline-dot" /><div><div className="timeline-heading"><strong>{String(item.beneficiary_name)}</strong><time>{new Date(String(item.created_at)).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })}</time></div><p>{String(item.professional_name)} · {String(item.note_type || "registro")}</p><div className="note-preview">{String(item.content || "Acompanhamento registrado.")}</div></div></article>)}</div> : <div className="empty-state compact-empty"><span className="empty-icon"><HeartHandshake size={20} /></span><strong>O histórico começa aqui</strong><p>Depois de configurar seu perfil profissional e cadastrar uma pessoa, você poderá registrar um acompanhamento.</p></div>}
            </section>
            <section className="surface data-panel" id="rotina">
              <SectionTitle eyebrow="ROTINA DA ORGANIZAÇÃO" title="Agenda e atividades" description="Estrutura preparada para as próximas etapas." />
              <div className="feature-list"><div><span className="feature-icon"><CalendarDays size={17} /></span><div><strong>Agenda de compromissos</strong><p>Cadastro e organização de atividades.</p></div><span className="coming-chip">Próxima etapa</span></div><div id="documentos"><span className="feature-icon"><FileText size={17} /></span><div><strong>Documentos institucionais</strong><p>Preparação para armazenamento privado.</p></div><span className="coming-chip">Próxima etapa</span></div><div><span className="feature-icon"><Wallet size={17} /></span><div><strong>Indicadores administrativos</strong><p>Contagens reais a partir do banco conectado.</p></div><span className="coming-chip">Inicial</span></div></div>
              <div className="product-principle"><CheckCircle2 size={18} /><div><strong>Sem métricas inventadas</strong><p>Os indicadores desta tela vêm do banco de dados. Áreas ainda não implementadas aparecem como próximas etapas.</p></div></div>
            </section>
          </div>
          <footer className="app-footer"><span>Clini.OS · Gestão para organizações sociais</span><span>Ambiente MVP · não utilizar dados reais sensíveis</span></footer>
        </div>
      </section>
    </main>
  );
}
