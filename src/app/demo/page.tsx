import Link from "next/link";
import {
  Activity, CalendarDays, CheckCircle2, ClipboardList, FileText,
  HeartHandshake, LayoutDashboard, ShieldCheck, Users, Wallet
} from "lucide-react";

export const metadata = { title: "Demonstração — Clini.OS" };

const beneficiaries = [
  { name: "Ana Martins", record: "BEN-0004", detail: "Cadastro administrativo", status: "Ativo" },
  { name: "Lucas Ferreira", record: "BEN-0003", detail: "Cadastro administrativo", status: "Ativo" },
  { name: "Sofia Almeida", record: "BEN-0002", detail: "Cadastro administrativo", status: "Ativo" },
  { name: "Miguel Santos", record: "BEN-0001", detail: "Cadastro administrativo", status: "Lista de espera" }
];

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>{description}</p></div></div>;
}

export default function DemoPage() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <Link href="/demo" className="brand-lockup"><span className="brand-mark"><HeartHandshake size={21} /></span><span>Clini<span className="brand-light">.OS</span></span></Link>
        <div className="org-switcher"><span className="org-avatar"><HeartHandshake size={18} /></span><span><strong>Instituto Caminhos</strong><small>Organização de demonstração</small></span></div>
        <p className="nav-label">OPERAÇÃO SOCIAL</p>
        <nav className="side-nav">
          <a href="#inicio" className="nav-item active"><LayoutDashboard size={18} /> Visão geral</a>
          <a href="#beneficiarios" className="nav-item"><Users size={18} /> Beneficiários</a>
          <a href="#acompanhamentos" className="nav-item"><HeartHandshake size={18} /> Acompanhamentos</a>
          <a href="#rotina" className="nav-item"><CalendarDays size={18} /> Agenda e atividades</a>
          <a href="#documentos" className="nav-item"><FileText size={18} /> Documentos</a>
        </nav>
        <p className="nav-label">ADMINISTRAÇÃO</p>
        <nav className="side-nav"><a href="#equipe" className="nav-item"><ShieldCheck size={18} /> Equipe e acessos</a><a href="#indicadores" className="nav-item"><Wallet size={18} /> Indicadores</a></nav>
        <div className="sidebar-bottom"><div className="sidebar-note"><ShieldCheck size={18} /><span><strong>Ambiente seguro para explorar</strong><small>Os registros desta tela são fictícios.</small></span></div></div>
      </aside>
      <section className="main-panel" id="inicio">
        <header className="topbar"><div className="breadcrumb">Demonstração <span>/</span> <strong>Visão geral</strong></div><div className="topbar-actions"><span className="status-chip"><span /> Modo demonstração</span><span className="user-pill">Visitante</span></div></header>
        <div className="content-wrap">
          <div className="notice">Você está explorando uma demonstração com dados inventados. Os formulários e registros não são enviados nem salvos.</div>
          <div className="welcome-row"><div><p className="eyebrow">GESTÃO DE CUIDADO</p><h1>Organize o cuidado. <em>Ganhe clareza.</em></h1><p className="lead">Tudo o que sua equipe precisa para acompanhar pessoas, rotinas e atividades em um só lugar.</p></div><span className="date-label">Prévia do produto</span></div>
          <section className="metrics-grid" id="indicadores">
            <article className="metric-card"><span className="metric-icon"><Users size={18} /></span><p>Beneficiários ativos</p><strong>24</strong><small>Exemplo de registros ativos</small></article>
            <article className="metric-card"><span className="metric-icon"><HeartHandshake size={18} /></span><p>Acompanhamentos</p><strong>18</strong><small>Exemplo de registros profissionais</small></article>
            <article className="metric-card"><span className="metric-icon"><ClipboardList size={18} /></span><p>Serviços ativos</p><strong>6</strong><small>Exemplo de serviços cadastrados</small></article>
            <article className="metric-card highlight-metric"><span className="metric-icon"><Activity size={18} /></span><p>Próxima prioridade</p><strong className="metric-word">Acompanhar</strong><small>Exemplo de prioridade da equipe</small></article>
          </section>
          <div className="dashboard-grid">
            <section className="surface data-panel" id="beneficiarios">
              <SectionTitle eyebrow="CADASTRO ÚNICO" title="Beneficiários" description="Exemplos fictícios de pessoas acompanhadas." />
              <div className="table-wrap"><table><thead><tr><th>Nome fictício</th><th>Nº de cadastro</th><th>Status</th></tr></thead><tbody>{beneficiaries.map((item) => <tr key={item.record}><td><strong>{item.name}</strong><small>{item.detail}</small></td><td>{item.record}</td><td><span className="table-status">{item.status}</span></td></tr>)}</tbody></table></div>
              <div className="product-principle"><ShieldCheck size={18} /><div><strong>Dados ilustrativos</strong><p>Nenhum nome ou registro desta tela corresponde a um cadastro real.</p></div></div>
            </section>
            <section className="surface data-panel" id="equipe">
              <SectionTitle eyebrow="EQUIPE E ACESSOS" title="Perfil profissional" description="Área de referência para a equipe da organização." />
              <div className="profile-summary"><span className="profile-avatar">CM</span><div><strong>Camila Moreira</strong><p>Assistência social · perfil fictício</p><span className="table-status">Perfil de exemplo</span></div></div>
              <div className="permission-note"><ShieldCheck size={17} /><p>No produto real, as operações devem ser limitadas por perfil, vínculo com a organização e necessidade de acesso.</p></div>
            </section>
          </div>
          <div className="dashboard-grid lower-grid">
            <section className="surface data-panel" id="acompanhamentos">
              <SectionTitle eyebrow="CONTINUIDADE DO CUIDADO" title="Acompanhamentos recentes" description="Exemplos ilustrativos de registros." />
              <div className="timeline">
                <article className="timeline-item"><span className="timeline-dot" /><div><div className="timeline-heading"><strong>Ana Martins</strong><time>12 out.</time></div><p>Camila Moreira · Evolução</p><div className="note-preview">Exemplo fictício: acompanhamento de rotina e atualização do plano de atividades.</div></div></article>
                <article className="timeline-item"><span className="timeline-dot" /><div><div className="timeline-heading"><strong>Lucas Ferreira</strong><time>10 out.</time></div><p>Equipe de referência · Observação</p><div className="note-preview">Exemplo fictício: retorno agendado para continuidade do atendimento.</div></div></article>
                <article className="timeline-item"><span className="timeline-dot" /><div><div className="timeline-heading"><strong>Sofia Almeida</strong><time>08 out.</time></div><p>Camila Moreira · Encaminhamento</p><div className="note-preview">Exemplo fictício: encaminhamento administrativo registrado pela equipe.</div></div></article>
              </div>
            </section>
            <section className="surface data-panel" id="rotina">
              <SectionTitle eyebrow="ROTINA DA ORGANIZAÇÃO" title="Agenda e atividades" description="Estrutura prevista para as próximas etapas." />
              <div className="feature-list"><div><span className="feature-icon"><CalendarDays size={17} /></span><div><strong>Agenda de compromissos</strong><p>Cadastro e organização de atividades.</p></div><span className="coming-chip">Próxima etapa</span></div><div id="documentos"><span className="feature-icon"><FileText size={17} /></span><div><strong>Documentos institucionais</strong><p>Preparação para armazenamento privado.</p></div><span className="coming-chip">Próxima etapa</span></div><div><span className="feature-icon"><Wallet size={17} /></span><div><strong>Indicadores administrativos</strong><p>Visão resumida da operação.</p></div><span className="coming-chip">Inicial</span></div></div>
              <div className="product-principle"><CheckCircle2 size={18} /><div><strong>Sem gravações reais</strong><p>Esta prévia é somente para conhecer a interface. Nenhum dado é gravado no banco.</p></div></div>
            </section>
          </div>
          <footer className="app-footer"><span>Clini.OS · Gestão para organizações sociais</span><span>Demonstração · todos os dados são fictícios</span></footer>
        </div>
      </section>
    </main>
  );
}
