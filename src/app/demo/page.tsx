import Link from "next/link";
import {
  Activity, CalendarDays, CheckCircle2, FileText,
  HeartHandshake, LayoutDashboard, ShieldCheck, Users
} from "lucide-react";

export const metadata = { title: "Demonstração — Clini.OS" };

const appointments = [
  { time: "09:00", end: "09:30", title: "Acolhimento inicial", person: "Ana Martins", type: "Atendimento", status: "Confirmado" },
  { time: "10:30", end: "11:00", title: "Acompanhamento familiar", person: "Lucas Ferreira", type: "Serviço social", status: "Confirmado" },
  { time: "14:00", end: "15:00", title: "Oficina de convivência", person: "Grupo de convivência", type: "Atividade em grupo", status: "Planejado" },
  { time: "15:30", end: "16:00", title: "Reunião de equipe", person: "Equipe técnica", type: "Reunião interna", status: "Planejado" }
];

const beneficiaries = [
  { name: "Ana Martins", record: "BEN-0004", status: "Ativo" },
  { name: "Lucas Ferreira", record: "BEN-0003", status: "Ativo" },
  { name: "Sofia Almeida", record: "BEN-0002", status: "Ativo" },
  { name: "Miguel Santos", record: "BEN-0001", status: "Lista de espera" }
];

function SectionTitle({ title, description }: { title: string; description: string }) {
  return <div className="section-heading"><div><h2>{title}</h2><p>{description}</p></div></div>;
}

export default function DemoPage() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <Link href="/demo" className="brand-lockup"><span className="brand-mark"><HeartHandshake size={20} /></span><span>Clini<span className="brand-light">.OS</span></span></Link>
        <div className="org-switcher"><span className="org-avatar"><HeartHandshake size={18} /></span><span><strong>Instituto Caminhos</strong><small>Demonstração</small></span></div>
        <p className="nav-label">MENU</p>
        <nav className="side-nav">
          <a href="#inicio" className="nav-item active"><LayoutDashboard size={17} /> Visão geral</a>
          <a href="#agenda" className="nav-item"><CalendarDays size={17} /> Agenda</a>
          <a href="#beneficiarios" className="nav-item"><Users size={17} /> Beneficiários</a>
          <a href="#acompanhamentos" className="nav-item"><HeartHandshake size={17} /> Acompanhamentos</a>
        </nav>
        <div className="sidebar-bottom"><div className="sidebar-note"><ShieldCheck size={17} /><span><strong>Dados fictícios</strong><small>Prévia somente para navegação.</small></span></div></div>
      </aside>

      <section className="main-panel" id="inicio">
        <header className="topbar"><div className="breadcrumb">Clini.OS <span>/</span> <strong>Visão geral</strong></div><div className="topbar-actions"><span className="status-chip"><span /> Demonstração</span></div></header>
        <div className="content-wrap">
          <div className="notice">Modo de demonstração: todos os registros são fictícios e nada é salvo.</div>
          <div className="welcome-row"><div><p className="eyebrow">INSTITUTO CAMINHOS</p><h1>Visão geral</h1><p className="lead">Acompanhe a rotina e os atendimentos da organização.</p></div><span className="date-label">Terça-feira, 13 de outubro</span></div>

          <section className="metrics-grid demo-metrics" id="indicadores">
            <article className="metric-card"><span className="metric-icon"><Users size={18} /></span><p>Beneficiários ativos</p><strong>24</strong></article>
            <article className="metric-card"><span className="metric-icon"><HeartHandshake size={18} /></span><p>Acompanhamentos no mês</p><strong>18</strong></article>
            <article className="metric-card"><span className="metric-icon"><CalendarDays size={18} /></span><p>Compromissos hoje</p><strong>4</strong></article>
          </section>

          <section className="surface data-panel agenda-panel" id="agenda">
            <div className="agenda-header">
              <div><p className="eyebrow">ROTINA DA ORGANIZAÇÃO</p><h2>Agenda do dia</h2><p>Terça-feira, 13 de outubro · horários ilustrativos</p></div>
              <span className="agenda-count">4 compromissos</span>
            </div>
            <div className="agenda-list">
              {appointments.map((item) => <article className="agenda-item" key={item.time}>
                <div className="agenda-time"><strong>{item.time}</strong><span>{item.end}</span></div>
                <span className="agenda-line-dot" />
                <div className="agenda-content"><div className="agenda-title-row"><strong>{item.title}</strong><span className={item.status === "Confirmado" ? "agenda-status confirmed" : "agenda-status"}>{item.status}</span></div><p>{item.person}</p><span className="agenda-type">{item.type}</span></div>
              </article>)}
            </div>
            <p className="agenda-footnote"><CheckCircle2 size={15} /> A agenda é ilustrativa nesta versão. O cadastro e a edição de compromissos ainda não estão ativos.</p>
          </section>

          <div className="dashboard-grid demo-lower-grid">
            <section className="surface data-panel" id="beneficiarios">
              <SectionTitle title="Beneficiários" description="Cadastros de exemplo." />
              <div className="table-wrap"><table><thead><tr><th>Nome</th><th>Cadastro</th><th>Status</th></tr></thead><tbody>{beneficiaries.map((item) => <tr key={item.record}><td><strong>{item.name}</strong></td><td>{item.record}</td><td><span className="table-status">{item.status}</span></td></tr>)}</tbody></table></div>
            </section>
            <section className="surface data-panel" id="acompanhamentos">
              <SectionTitle title="Acompanhamentos recentes" description="Registros fictícios de exemplo." />
              <div className="timeline">
                <article className="timeline-item"><span className="timeline-dot" /><div><div className="timeline-heading"><strong>Ana Martins</strong><time>12 out.</time></div><p>Camila Moreira · Evolução</p><div className="note-preview">Acompanhamento de rotina e atualização do plano de atividades.</div></div></article>
                <article className="timeline-item"><span className="timeline-dot" /><div><div className="timeline-heading"><strong>Lucas Ferreira</strong><time>10 out.</time></div><p>Equipe de referência · Observação</p><div className="note-preview">Retorno agendado para continuidade do atendimento.</div></div></article>
              </div>
            </section>
          </div>

          <footer className="app-footer"><span>Clini.OS · Gestão para organizações sociais</span><span>Ambiente demonstrativo · sem dados reais</span></footer>
        </div>
      </section>
    </main>
  );
}
