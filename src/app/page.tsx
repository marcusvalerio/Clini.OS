import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  LifeBuoy,
  Plus,
  Settings2,
  ShieldCheck,
  Users,
  Wallet,
  type LucideIcon
} from "lucide-react";

type NavigationItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
};

const coreNavigation: NavigationItem[] = [
  { label: "Visão geral", icon: LayoutDashboard, active: true },
  { label: "Beneficiários", icon: Users },
  { label: "Acompanhamentos", icon: HeartHandshake },
  { label: "Agenda", icon: CalendarDays },
  { label: "Documentos", icon: FileText }
];

const adminNavigation: NavigationItem[] = [
  { label: "Projetos e atividades", icon: ClipboardList },
  { label: "Financeiro", icon: Wallet },
  { label: "Equipe e permissões", icon: ShieldCheck },
  { label: "Configurações", icon: Settings2 }
];

const setupSteps = [
  {
    number: "01",
    title: "Configure a organização",
    description: "Identificação, contatos e dados institucionais.",
    status: "Próxima etapa",
    href: "#configuracao"
  },
  {
    number: "02",
    title: "Defina a equipe e os acessos",
    description: "Separe as permissões administrativas das profissionais.",
    status: "Pendente",
    href: "#equipe"
  },
  {
    number: "03",
    title: "Cadastre o primeiro beneficiário",
    description: "Organize os dados básicos e os responsáveis vinculados.",
    status: "Pendente",
    href: "#beneficiarios"
  }
];

const modules = [
  {
    icon: Users,
    title: "Beneficiários e famílias",
    description: "Cadastro único, responsáveis e contatos importantes.",
    href: "#beneficiarios"
  },
  {
    icon: HeartHandshake,
    title: "Acompanhamento profissional",
    description: "Registros de acompanhamento com acesso restrito.",
    href: "#acompanhamentos"
  },
  {
    icon: CalendarDays,
    title: "Agenda e atividades",
    description: "Atendimentos, encontros, projetos e compromissos.",
    href: "#agenda"
  },
  {
    icon: FileText,
    title: "Documentos",
    description: "Documentos institucionais e arquivos privados.",
    href: "#documentos"
  }
];

function SidebarLink({ item }: { item: NavigationItem }) {
  const Icon = item.icon;

  return (
    <a
      href={item.active ? "#inicio" : "#modulos"}
      aria-current={item.active ? "page" : undefined}
      className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm transition-colors ${
        item.active
          ? "bg-[#e8f1e9] font-semibold text-[#315741]"
          : "text-[#68716a] hover:bg-[#f3f5f1] hover:text-[#202522]"
      }`}
    >
      <Icon size={18} strokeWidth={1.8} />
      <span className="flex-1">{item.label}</span>
      {item.active ? <span className="h-1.5 w-1.5 rounded-full bg-[#507a63]" /> : null}
    </a>
  );
}

function ModuleCard({
  icon: Icon,
  title,
  description,
  href
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group rounded-2xl border border-[#e6eae5] bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[#cbd9cb] hover:shadow-[0_12px_35px_rgba(29,45,34,0.06)] sm:p-5"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3ed] text-[#507a63] transition group-hover:bg-[#e3eee3]">
        <Icon size={19} strokeWidth={1.8} />
      </span>
      <h3 className="mt-4 text-sm font-semibold text-[#303831]">{title}</h3>
      <p className="mt-1.5 min-h-10 text-xs leading-5 text-[#7c857d]">{description}</p>
      <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#507a63]">
        Explorar módulo <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}

export default function HomePage() {
  return (
    <main id="inicio" className="min-h-screen bg-[#f7f8f5]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[252px] shrink-0 border-r border-[#e6eae5] bg-white px-4 py-6 lg:flex lg:flex-col">
          <a href="#inicio" className="flex items-center gap-3 px-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#315741] text-white">
              <HeartHandshake size={21} strokeWidth={1.8} />
            </span>
            <span>
              <span className="block text-[17px] font-bold tracking-[-0.055em] text-[#202522]">Clini<span className="font-normal text-[#507a63]">.OS</span></span>
              <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.16em] text-[#8a928b]">Gestão de cuidado</span>
            </span>
          </a>

          <button className="mt-9 flex items-center gap-2.5 rounded-2xl border border-[#e8ece7] bg-[#fafbf9] p-3 text-left transition hover:bg-[#f4f7f2]" aria-label="Selecionar organização">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f1e9] text-[#507a63]">
              <HeartHandshake size={17} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-[#29322b]">Sua organização</span>
              <span className="mt-0.5 block text-xs text-[#818a82]">Ambiente inicial</span>
            </span>
            <ChevronDown size={15} className="text-[#8c948d]" />
          </button>

          <nav aria-label="Navegação principal" className="mt-8">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#a0a79f]">Operação social</p>
            <div className="space-y-1">
              {coreNavigation.map((item) => <SidebarLink key={item.label} item={item} />)}
            </div>
            <p className="mb-2 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#a0a79f]">Administração</p>
            <div className="space-y-1">
              {adminNavigation.map((item) => <SidebarLink key={item.label} item={item} />)}
            </div>
          </nav>

          <div className="mt-auto space-y-1 pt-8">
            <a href="#seguranca" className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm text-[#68716a] transition hover:bg-[#f3f5f1]">
              <LifeBuoy size={18} strokeWidth={1.8} /> Ajuda e segurança
            </a>
            <div className="mt-3 rounded-2xl bg-[#f5f7f3] p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#4d6e55]">
                <ShieldCheck size={15} /> Privacidade desde o início
              </div>
              <p className="mt-2 text-xs leading-5 text-[#778178]">Registros profissionais devem ficar disponíveis somente a pessoas autorizadas.</p>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 border-b border-[#e6eae5] bg-[#f7f8f5]/95 px-4 py-3 backdrop-blur-xl sm:px-7 lg:px-10">
            <div className="mx-auto flex max-w-[1220px] items-center justify-between gap-3">
              <div className="flex items-center gap-3 lg:hidden">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#315741] text-white"><HeartHandshake size={19} /></span>
                <span className="text-base font-bold tracking-[-0.05em]">Clini<span className="font-normal text-[#507a63]">.OS</span></span>
              </div>
              <div className="hidden text-sm text-[#858d86] sm:block">Organização <span className="mx-2 text-[#c4cbc4]">/</span> <span className="font-medium text-[#353c36]">Visão geral</span></div>
              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eadfca] bg-[#fbf6ec] px-2.5 py-1.5 text-[11px] font-semibold text-[#8b7047]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c69c66]" /> Configuração inicial
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e7e9dc] text-xs font-bold text-[#4b604b]">CL</span>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1220px] px-4 pb-10 pt-7 sm:px-7 sm:pt-9 lg:px-10">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#dce8dc] bg-[#edf4ed] px-2.5 py-1 text-[11px] font-semibold text-[#4f7657]">
                  <Activity size={13} /> Gestão social em um só lugar
                </div>
                <h1 className="text-[28px] font-semibold tracking-[-0.055em] text-[#202522] sm:text-[36px]">Organize o cuidado. <span className="text-[#507a63]">Ganhe clareza.</span></h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737c74] sm:text-[15px]">Cadastros, acompanhamento profissional e gestão administrativa, conectados em uma rotina mais simples para sua equipe.</p>
              </div>
              <a href="#primeiros-passos" className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#315741] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#264a34] sm:self-auto">
                <Plus size={17} /> Começar configuração
              </a>
            </div>

            <section className="mt-7 overflow-hidden rounded-[20px] border border-[#dce8dc] bg-white">
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e8f1e9] text-[#507a63]"><CheckCircle2 size={21} /></span>
                  <div>
                    <p className="text-sm font-semibold text-[#29352c]">Vamos preparar seu espaço de trabalho</p>
                    <p className="mt-1 max-w-xl text-sm leading-6 text-[#737c74]">Complete os primeiros passos para que a organização comece a registrar sua operação com estrutura e segurança.</p>
                  </div>
                </div>
                <span className="w-fit rounded-lg bg-[#f5f7f3] px-3 py-1.5 text-xs font-semibold text-[#647166]">0 de 3 etapas</span>
              </div>
              <div className="h-1.5 bg-[#f0f3ee]"><div className="h-full w-0 bg-[#507a63]" /></div>
            </section>

            <div id="primeiros-passos" className="mt-8">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold tracking-[-0.02em] text-[#252b26]">Primeiros passos</h2>
                  <p className="mt-1 text-sm text-[#7c857d]">Uma configuração guiada, sem complicar a rotina.</p>
                </div>
                <span className="text-xs font-medium text-[#8b938c]">Tempo estimado: 5–10 min</span>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
                {setupSteps.map((step) => (
                  <a key={step.number} href={step.href} className="group rounded-2xl border border-[#e6eae5] bg-white p-4 transition hover:border-[#cbd9cb] hover:shadow-[0_12px_35px_rgba(29,45,34,0.05)] sm:p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold tracking-[0.12em] text-[#8a968b]">{step.number}</span>
                      <ArrowRight size={16} className="text-[#9ba49b] transition group-hover:translate-x-0.5 group-hover:text-[#507a63]" />
                    </div>
                    <h3 className="mt-5 text-sm font-semibold text-[#303831]">{step.title}</h3>
                    <p className="mt-1.5 min-h-10 text-xs leading-5 text-[#7c857d]">{step.description}</p>
                    <span className="mt-4 inline-flex rounded-md bg-[#f3f6f1] px-2 py-1 text-[10px] font-semibold text-[#607564]">{step.status}</span>
                  </a>
                ))}
              </div>
            </div>

            <section className="mt-9">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold tracking-[-0.02em] text-[#252b26]">Seu trabalho, organizado por áreas</h2>
                  <p className="mt-1 text-sm text-[#7c857d]">Encontre o próximo passo sem procurar em várias planilhas.</p>
                </div>
                <span className="text-xs font-medium text-[#8b938c]">Módulos planejados</span>
              </div>
              <div id="modulos" className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {modules.map((module) => <ModuleCard key={module.title} {...module} />)}
              </div>
            </section>

            <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]">
              <section id="configuracao" className="rounded-[20px] border border-[#e6eae5] bg-white p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f1f3e9] text-[#788051]"><ClipboardList size={19} /></span>
                  <div>
                    <h2 className="text-sm font-semibold text-[#303831]">Visão administrativa</h2>
                    <p className="mt-1 text-xs leading-5 text-[#7c857d]">Indicadores aparecerão aqui depois que o banco e os módulos forem conectados.</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    ["Beneficiários", "—"],
                    ["Acompanhamentos", "—"],
                    ["Atividades no mês", "—"],
                    ["Pendências", "—"]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-[#f8f9f6] p-3">
                      <p className="text-[11px] font-medium text-[#7c857d]">{label}</p>
                      <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#303831]">{value}</p>
                      <p className="mt-1 text-[10px] text-[#a0a79f]">Sem dados ainda</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="seguranca" className="overflow-hidden rounded-[20px] bg-[#315741] p-5 text-white sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/60">Princípio do produto</p>
                    <h2 className="mt-3 text-xl font-semibold leading-7 tracking-[-0.035em]">Informação certa.<br />Acesso responsável.</h2>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10"><ShieldCheck size={20} /></span>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/70">Dados administrativos e registros profissionais terão permissões distintas, com histórico de alterações e proteção por organização.</p>
                <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-white/85"><ShieldCheck size={15} /> Segurança em desenvolvimento</div>
              </section>
            </div>

            <footer className="mt-10 flex flex-col gap-2 border-t border-[#e5e9e3] pt-5 text-xs text-[#929a92] sm:flex-row sm:items-center sm:justify-between">
              <span>Clini.OS · Gestão para organizações sociais</span>
              <span>Prévia de interface · sem dados reais</span>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
