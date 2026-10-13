# Clini.OS

Sistema de gestão para organizações sociais que atendem crianças e adolescentes, com cadastro único de beneficiários, responsáveis, documentos privados, acompanhamento profissional, agenda e financeiro.

## Status

**Fundação inicial em desenvolvimento.** Esta versão contém a estrutura visual inicial, configuração de aplicação e a primeira proposta de esquema PostgreSQL. Autenticação, autorização, armazenamento privado e fluxos operacionais ainda precisam ser implementados e testados antes de inserir dados reais.

## Stack

- Next.js App Router + TypeScript
- React
- Tailwind CSS
- Neon PostgreSQL
- SQL versionado em `db/migrations`

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

A migration inicial está em `db/migrations/0001_initial_schema.sql`. Revise-a antes de executar e aplique-a no ambiente de desenvolvimento pelo Neon SQL Editor ou por um runner de migrations devidamente configurado.

## Princípios de segurança

- Não inserir dados reais de beneficiários em previews, fixtures ou commits.
- Não armazenar arquivos privados diretamente no repositório.
- Não expor documentos por URLs públicas permanentes.
- Validar autorização no servidor em toda operação sensível.
- Restringir o acesso por organização e por função profissional.
- Registrar acessos e alterações relevantes.
- O sistema não está pronto para produção nem para dados reais até que autenticação, autorização, armazenamento privado, auditoria, backups e revisão de privacidade sejam concluídos.

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
    0001_initial_schema.sql
.env.example
```
