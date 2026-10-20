import Link from "next/link";
import { HeartHandshake, ShieldCheck } from "lucide-react";

export default function SetupPage() {
  return (
    <main className="setup-page">
      <div className="setup-card">
        <span className="brand-mark"><HeartHandshake size={22} /></span>
        <p className="eyebrow">QUASE LÁ</p>
        <h1>Conecte o ambiente do Clini.OS</h1>
        <p>O aplicativo precisa das variáveis do Neon Auth e do banco de dados para habilitar o acesso seguro.</p>
        <div className="setup-check"><ShieldCheck size={18} /> Nenhum dado real deve ser cadastrado antes de configurar e validar o ambiente.</div>
        <Link className="primary-button" href="/auth/sign-in">Ir para autenticação <span>→</span></Link>
        <p className="setup-caption">Configure DATABASE_URL, NEON_AUTH_BASE_URL, NEXT_PUBLIC_NEON_AUTH_URL e NEON_AUTH_COOKIE_SECRET no ambiente de execução.</p>
      </div>
    </main>
  );
}
