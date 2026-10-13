# Clini.OS

Sistema de gestão para organizações sociais que atendem crianças e adolescentes, com cadastro único de beneficiários, responsáveis, registros administrativos, acompanhamento profissional, agenda e documentos privados.

**Primeira implantação:** uma organização social.  
**Arquitetura:** preparada para suportar múltiplas organizações no futuro, com isolamento por tenant.

## Status

**Fundação inicial em desenvolvimento.** A interface inicial e o esquema PostgreSQL proposto estão no branch `feat/foundation`. A interface é um protótipo sem dados reais; autenticação, autorização, isolamento multi-tenant, armazenamento privado e fluxos operacionais ainda precisam ser implementados e testados antes de inserir dados reais.

## Stack

- Next.js App Router + TypeScript
- React + Tailwind CSS
- Neon PostgreSQL
- SQL versionado em `db/migrations`
- GitHub Actions para typecheck, lint e build

## Requisitos

- Node.js 20.9+ (preferencialmente Node 22)
- npm
- Projeto Neon PostgreSQL para ambiente de desenvolvimento

## Desenvolvimento local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Configure `DATABASE_URL` no arquivo `.env.local` usando a connection string do Neon. Nunca publique esse arquivo.

Abra http://localhost:3000.

## Banco de dados

Leia `docs/NEON-SETUP.md` antes de provisionar o banco ou aplicar migrations. A proposta inicial está em:

- `db/migrations/0001_initial_schema.sql`
- `db/migrations/0002_appointment_overlap_guard.sql`

Revise e aplique as migrations primeiro em um banco de desenvolvimento descartável. Elas não configuram autenticação nem autorizam acesso seguro por si só.

## Princípios de produto e design

As decisões de UX seguem os princípios do produto em `docs/PRODUCT-PRINCIPLES.md`. A referência externa é a skill [Revenue-Centric Design](https://github.com/heliocosta-dev/revenue-centric-design), de heliocosta-dev, baseada em princípios de Richard (@richardrx).

Para instalar a skill em um ambiente de agente compatível:

```bash
npx skills add heliocosta-dev/revenue-centric-design
```

As instruções específicas do projeto estão em `AGENTS.md`. Respeite a licença e a atribuição da skill original; ela proíbe o uso em produtos de apostas, cassinos e jogos de azar com dinheiro real.

## Segurança e privacidade

- Não inserir dados reais de beneficiários em previews, fixtures ou commits.
- Não armazenar arquivos privados diretamente no repositório.
- Não expor documentos por URLs públicas permanentes.
- Validar autenticação, organização ativa e permissões no servidor em toda operação sensível.
- Separar registros administrativos de registros profissionais restritos.
- Auditar acessos e alterações relevantes.
- Não conectar dados reais até concluir testes de autorização, isolamento entre organizações, armazenamento privado, backups e revisão de privacidade.

## Estrutura inicial

```
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  lib/
    db.ts
db/
  migrations/
docs/
  NEON-SETUP.md
  PRODUCT-PRINCIPLES.md
AGENTS.md
.env.example
```
