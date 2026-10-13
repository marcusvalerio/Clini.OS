import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  LifeBuoy,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  type LucideIcon
} from "lucide-react";

type NavItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  badge?: string;
};

const mainNavigation: NavItem[] = [
  { label: "Visão geral", icon: LayoutDashboard, active: true },
  { label: "Beneficiários", icon: Users, badge: "CRM" },
  { label: "Agenda", icon: CalendarDays },
  { label: "Atendimentos", icon: HeartHandshake },
  { label: "Documentos", icon: FileText }
];

const managementNavigation: NavItem[] = [
  { label: "Financeiro", icon: Wallet },
  { label: "Equipe e acessos", icon: ShieldCheck },
  { label: "Configurações", icon: Settings2 }
];

const appointments = [
  { time: "09:00", initials: "AM", name: "Atendimento agendado", service: "Acompanhamento · Sala 02", tone: "sage", status: "Confirmado" },
  { time: "09:30", initials: "RL", name: "Atendimento agendado", service: "Terapia ocupacional · Sala 01", tone: "lavender", status: "Confirmado" },
  { time: "10:15", initials: "JC", name: "Atendimento agendado", service: "Fonoaudiologia · Sala 03", tone: "sand", status: "Aguardando" },
  { time: "11:00", initials: "MP", name: "Atendimento agendado", service: "Acompanhamento · Sala 02", tone: "blue", status: "Confirmado" }
];

function SidebarLink({ item }: { item: NavItem }) {
  const Icon = item.icon;

  return (
    <a
      href={item.active ? "#inicio" : "#modulos"}
      aria-current={item.active ? "page" : undefined}
      className={`group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm transition-colors ${
        item.active
          ? "bg-[#e8f1e9] font-semibold text-[#315741]"
          : "text-[#68716a] hover:bg-[#f3f5f1] hover:text-[#202522]"
      }`}
    >
      <Icon size={18} strokeWidth={1.8} />
      <span className="flex-1">{item.label}</span>
      {item.badge ? <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#778178]">{item.badge}</span> : null}
    </a>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  trend,
  trendUp = true
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  trend: string;
  trendUp?: boolean;
}) {
  return (
    <article className="surface p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#737c74]">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#202522]">{value}</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f4ef] text-[#507a63]">
          <Icon size={19} strokeWidth={1.8} />
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-1 font-semibold ${trendUp ? "bg-[#edf5ed] text-[#477a52]" : "bg-[#fbf0e7] text-[#9a693e]"}`}>
          {trendUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {trend}
        </span>
        <span className="text-[#89918a]">{detail}</span>
      </div>
    </article>
  );
}

function SectionHeading({ title, subtitle, action }: { title: string; subtitle: string; action?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold tracking-[-0.02em] text-[#252b26]">{title}</h2>
        <p className="mt-1 text-sm text-[#7c857d]">{subtitle}</p>
      </div>
      {action ? (
        <a href="#modulos" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#507a63] transition hover:text-[#315741]">
          {action} <ArrowRight size={15} />
        </a>
      ) : null}
    </div>
  );
}

export default function HomePage() {
  return (
    <main id="inicio" className="min-h-screen bg-[#f7f8f5]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[252px] shrink-0 border-r border-[#e6eae5] bg-white px-4 py-6 lg:flex lg:flex-col">
          <a href="#inicio" className="flex items-center gap-3 px-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#315741] text-white shadow-sm">
              <HeartHandshake size={21} strokeWidth={1.8} />
            </span>
            <span>
              <span className="block text-[17px] font-bold tracking-[-0.055em] text-[#202522]">Clini<span className="font-normal text-[#507a63]">.OS</span></span>
              <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.16em] text-[#8a928b]">Gestão de cuidado</span>
            </span>
          </a>

          <div className="mt-9 rounded-2xl border border-[#e8ece7] bg-[#fafbf9] p-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f1e9] text-[#507a63]">
                <HeartHandshake size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-[#29322b]">Minha organização</span>
                <span className="mt-0.5 block text-xs text-[#818a82]">Ambiente de demonstração</span>
              </span>
              <ChevronDown size={15} className="text-[#8c948d]" />
            </div>
          </div>

          <nav aria-label="Navegação principal" className="mt-8">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#a0a79f]">Principal</p>
            <div className="space-y-1">
              {mainNavigation.map((item) => <SidebarLink key={item.label} item={item} />)}
            </div>
            <p className="mb-2 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#a0a79f]">Gestão</p>
            <div className="space-y-1">
              {managementNavigation.map((item) => <SidebarLink key={item.label} item={item} />)}
            </div>
          </nav>

          <div className="mt-auto space-y-1 pt-8">
            <a href="#seguranca" className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm text-[#68716a] transition hover:bg-[#f3f5f1]">
              <LifeBuoy size={18} strokeWidth={1.8} /> Central de ajuda
            </a>
            <div className="mt-3 rounded-2xl bg-[#f5f7f3] p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#4d6e55]">
                <ShieldCheck size={15} /> Segurança em primeiro lugar
              </div>
              <p className="mt-2 text-xs leading-5 text-[#778178]">Acesso a documentos e registros deverá ser controlado por função.</p>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 border-b border-[#e6eae5] bg-[#f7f8f5]/95 px-4 py-3 backdrop-blur-xl sm:px-7 lg:px-10">
            <div className="mx-auto flex max-w-[1220px] items-center justify-between gap-3">
              <div className="flex items-center gap-3 lg:hidden">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#315741] text-white">
                  <HeartHandshake size={19} />
                </span>
                <span className="text-base font-bold tracking-[-0.05em]">Clini<span className="font-normal text-[#507a63]">.OS</span></span>
              </div>
              <div className="hidden text-sm text-[#858d86] sm:block">Organização <span className="mx-2 text-[#c4cbc4]">/</span> <span className="font-medium text-[#353c36]">Visão geral</span></div>
              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <span className="hidden items-center gap-1.5 rounded-full border border-[#e5e9e3] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#8b7660] sm:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c69c66]" /> Protótipo
                </span>
                <button aria-label="Pesquisar" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e4e9e3] bg-white text-[#6d776e] transition hover:bg-[#f2f5f0]">
                  <Search size={18} />
                </button>
                <button aria-label="Notificações" className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#e4e9e3] bg-white text-[#6d776e] transition hover:bg-[#f2f5f0]">
                  <Bell size={18} />
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#c78b55]" />
                </button>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e7e9dc] text-xs font-bold text-[#4b604b]">CL</span>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1220px] px-4 pb-10 pt-7 sm:px-7 sm:pt-9 lg:px-10">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#dce8dc] bg-[#edf4ed] px-2.5 py-1 text-[11px] font-semibold text-[#4f7657]">
                  <Sparkles size={13} /> Cuidado conectado à gestão
                </div>
                <h1 className="text-[28px] font-semibold tracking-[-0.055em] text-[#202522] sm:text-[34px]">Bom dia, equipe <span aria-hidden="true">🌿</span></h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737c74] sm:text-[15px]">Uma visão clara da rotina, dos atendimentos e das prioridades da organização.</p>
              </div>
              <a href="#agenda" className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#315741] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#264a34] sm:self-auto">
                <Plus size={17} /> Novo agendamento
              </a>
            </div>

            <div className="mt-7 flex items-start gap-3 rounded-2xl border border-[#eadfca] bg-[#fbf6ec] p-4">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f3e8d3] text-[#9a7747]"><ShieldCheck size={17} /></span>
              <div>
                <p className="text-sm font-semibold text-[#6f5738]">Ambiente de protótipo</p>
                <p className="mt-1 text-xs leading-5 text-[#8a7558]">Os números e horários desta tela são ilustrativos. Autenticação, permissões e dados reais ainda não estão conectados.</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Beneficiários ativos" value="—" detail="Aguardando conexão" icon={Users} trend="Sem dados" trendUp={false} />
              <MetricCard label="Atendimentos hoje" value="—" detail="Agenda ainda não conectada" icon={CalendarDays} trend="Sem dados" trendUp={false} />
              <MetricCard label="Documentos pendentes" value="—" detail="Nenhum arquivo consultado" icon={FileText} trend="Sem dados" trendUp={false} />
              <MetricCard label="Despesas no mês" value="—" detail="Financeiro ainda não conectado" icon={Wallet} trend="Sem dados" trendUp={false} />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)]">
              <section id="agenda" className="surface p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold tracking-[-0.025em]">Agenda de hoje</h2>
                    <p className="mt-1 text-sm text-[#7c857d]">Prévia de layout · sem dados conectados</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#e5e9e3] px-2.5 py-1.5 text-xs font-medium text-[#69736b]">
                    <CalendarDays size={14} /> Hoje
                  </span>
                </div>
                <div className="mt-6 space-y-0">
                  {appointments.map((appointment, index) => (
                    <div key={appointment.time} className="grid grid-cols-[48px_minmax(0,1fr)] gap-3 sm:grid-cols-[56px_minmax(0,1fr)] sm:gap-4">
                      <div className="relative pt-3 text-xs font-semibold tabular-nums text-[#7d867e]">
                        {appointment.time}
                        {index < appointments.length - 1 ? <span className="absolute bottom-0 left-[4px] top-9 w-px bg-[#e8ece7]" /> : null}
                      </div>
                      <div className={`mb-3 flex min-w-0 items-center gap-3 rounded-xl border p-3 sm:p-3.5 ${index === 2 ? "border-[#eee3d0] bg-[#fdfaf4]" : "border-[#e8ece7] bg-white"}`}>
                        <span className={`hidden h-10 w-1 shrink-0 rounded-full sm:block ${appointment.tone === "sage" ? "bg-[#83a58a]" : appointment.tone === "lavender" ? "bg-[#a69cc7]" : appointment.tone === "sand" ? "bg-[#d2b17e]" : "bg-[#8ba9c6]"}`} />
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold ${appointment.tone === "sage" ? "bg-[#e8f1e9] text-[#4f7657]" : appointment.tone === "lavender" ? "bg-[#efedf8] text-[#7769a0]" : appointment.tone === "sand" ? "bg-[#f6eddf] text-[#997747]" : "bg-[#e9f0f7] text-[#547b9f]"}`}>
                          {appointment.initials}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[#303831]">{appointment.name}</p>
                          <p className="mt-1 truncate text-xs text-[#858d86]">{appointment.service}</p>
                        </div>
                        <span className={`hidden shrink-0 items-center gap-1 text-[10px] font-semibold sm:inline-flex ${appointment.status === "Confirmado" ? "text-[#54805d]" : "text-[#a17b48]"}`}>
                          {appointment.status === "Confirmado" ? <Check size={12} /> : <Clock3 size={12} />}
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <a href="#modulos" className="mt-2 flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#e6eae5] text-sm font-semibold text-[#5b7660] transition hover:bg-[#f6f8f4]">
                  Ver agenda completa <ArrowRight size={15} />
                </a>
              </section>

              <div className="space-y-6">
                <section className="surface p-5 sm:p-6">
                  <SectionHeading title="Pendências prioritárias" subtitle="Estrutura prevista para a rotina da equipe" />
                  <div className="mt-5 space-y-3">
                    <div className="flex gap-3 rounded-xl bg-[#faf7ef] p-3.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f2e8d4] text-[#9a7747]"><FileText size={17} /></span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#4b453a]">Documentos para revisar</p>
                        <p className="mt-1 text-xs leading-5 text-[#8b7d67]">A fila será exibida quando o módulo documental estiver conectado.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 rounded-xl bg-[#f2f6f1] p-3.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e2ede1] text-[#507a63]"><CalendarDays size={17} /></span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#354a39]">Confirmações de agenda</p>
                        <p className="mt-1 text-xs leading-5 text-[#78877a]">Lembretes e confirmações serão definidos na etapa da agenda.</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="overflow-hidden rounded-[18px] bg-[#315741] p-5 text-white shadow-soft sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.13em] text-white/65">Princípio do Clini.OS</p>
                      <h2 className="mt-3 text-xl font-semibold leading-7 tracking-[-0.035em]">Cuidado organizado.<br />Informação protegida.</h2>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10"><ShieldCheck size={20} /></span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/70">Acesso por função, histórico rastreável e uma ficha única para cada beneficiário.</p>
                  <a id="seguranca" href="#modulos" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-white px-3.5 text-sm font-semibold text-[#315741] transition hover:bg-[#eef3ed]">
                    Conhecer os módulos <ArrowRight size={15} />
                  </a>
                </section>
              </div>
            </div>

            <section id="modulos" className="mt-8">
              <SectionHeading title="Uma base para toda a operação" subtitle="Módulos planejados para evoluir de forma integrada." />
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { icon: Users, title: "Beneficiários", desc: "Cadastro único e responsáveis vinculados." },
                  { icon: FileText, title: "Documentos", desc: "Arquivos privados, categorias e versões." },
                  { icon: Activity, title: "Acompanhamento", desc: "Registros profissionais com rastreabilidade." },
                  { icon: Wallet, title: "Financeiro", desc: "Receitas, despesas e visão administrativa." }
                ].map((module) => {
                  const Icon = module.icon;
                  return (
                    <article key={module.title} className="surface p-4 transition hover:-translate-y-0.5 hover:shadow-soft">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3ed] text-[#507a63]"><Icon size={19} /></span>
                      <h3 className="mt-4 text-sm font-semibold text-[#303831]">{module.title}</h3>
                      <p className="mt-1.5 text-xs leading-5 text-[#7c857d]">{module.desc}</p>
                    </article>
                  );
                })}
              </div>
            </section>

            <footer className="mt-10 flex flex-col gap-2 border-t border-[#e5e9e3] pt-5 text-xs text-[#929a92] sm:flex-row sm:items-center sm:justify-between">
              <span>Clini.OS · Gestão de cuidado</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck size={13} /> Protótipo sem dados reais</span>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
