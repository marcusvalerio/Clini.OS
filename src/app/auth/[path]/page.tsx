import { AuthView } from "@neondatabase/auth-ui";
import { authViewPaths } from "@neondatabase/auth-ui/server";
import { HeartHandshake } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;
  if (!Object.values(authViewPaths).includes(path as (typeof authViewPaths)[keyof typeof authViewPaths])) notFound();

  return (
    <main className="auth-shell">
      <section className="auth-brand">
        <Link href="/" className="brand-lockup">
          <span className="brand-mark"><HeartHandshake size={22} /></span>
          <span>Clini<span className="brand-light">.OS</span></span>
        </Link>
        <div className="auth-message">
          <p className="eyebrow">GESTÃO DE CUIDADO</p>
          <h1>Mais clareza para quem cuida.</h1>
          <p>Cadastros, acompanhamento profissional e gestão administrativa em uma rotina mais simples.</p>
        </div>
        <p className="auth-footnote">Um espaço de trabalho pensado para organizações sociais.</p>
      </section>
      <section className="auth-panel">
        <div className="auth-panel-inner">
          <Link href="/" className="mobile-brand brand-lockup">
            <span className="brand-mark"><HeartHandshake size={22} /></span>
            <span>Clini<span className="brand-light">.OS</span></span>
          </Link>
          <AuthView path={path} />
          <p className="auth-privacy">Acesso restrito à equipe autorizada.</p>
        </div>
      </section>
    </main>
  );
}
