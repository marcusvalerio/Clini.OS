# Clini.OS

MVP de gestão para organizações sociais: cadastro administrativo de beneficiários, configuração de perfil profissional e registros iniciais de acompanhamento.

## Stack

- Next.js App Router + TypeScript + Tailwind CSS
- Neon PostgreSQL
- Neon Auth (Managed Better Auth)
- GitHub Actions para typecheck, lint e build

## Ambiente local

1. Copie `.env.example` para `.env.local`.
2. Configure `DATABASE_URL` com a branch de desenvolvimento do Neon.
3. Configure `NEON_AUTH_BASE_URL` e `NEXT_PUBLIC_NEON_AUTH_URL` com a URL do Neon Auth da mesma branch.
4. Gere `NEON_AUTH_COOKIE_SECRET` com pelo menos 32 caracteres aleatórios.
5. Instale dependências com `npm install` e inicie com `npm run dev`.

## MVP atual

- Login e cadastro gerenciados pelo Neon Auth.
- Onboarding para criar a organização.
- Cadastro de beneficiários com número de registro automático.
- Configuração de perfil profissional.
- Registro de acompanhamentos com validação de organização e perfil no servidor.
- Contagens reais no dashboard e estados vazios honestos.
- Registro básico de auditoria para novos cadastros e acompanhamentos.

## Segurança — importante

Esta versão é para desenvolvimento e testes com dados fictícios. Não inserir dados reais sensíveis até concluir uma revisão de segurança independente. Antes de produção, revisar RLS/isolamento no banco, autorização por tipo de registro, fluxos de convite, consentimento, retenção e exclusão, armazenamento privado de documentos, backups, logging e política LGPD.

A interface não implementa ainda agenda operacional, documentos privados, gestão completa de equipe ou financeiro. Esses módulos não devem ser interpretados como funcionais só porque aparecem no menu.

## Princípios de produto

As decisões de UX seguem `docs/PRODUCT-PRINCIPLES.md` e a referência [Revenue-Centric Design](https://github.com/heliocosta-dev/revenue-centric-design), respeitando sua licença e atribuição.
