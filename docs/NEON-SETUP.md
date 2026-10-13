# Neon PostgreSQL setup

O projeto Neon `clini-os` foi provisionado em `aws-sa-east-1` (São Paulo). A branch `dev` contém o esquema inicial e o Neon Auth; use-a para testes de MVP. A branch principal do banco permanece sem as migrations aplicadas.

## Environment variables
- `DATABASE_URL`: pooled Neon connection string da branch `dev`, guardada como segredo.
- `NEON_AUTH_BASE_URL`: URL do Neon Auth correspondente à branch `dev`.
- `NEXT_PUBLIC_NEON_AUTH_URL`: a mesma URL pública do Neon Auth.
- `NEON_AUTH_COOKIE_SECRET`: segredo aleatório com pelo menos 32 caracteres.
- `APP_URL`: URL da aplicação.

Copie `.env.example` para `.env.local`. Nunca commite a conexão PostgreSQL nem o segredo de cookies. No Vercel, cadastre as mesmas variáveis nos ambientes Preview e Development. Não use a branch `dev` para produção.

## Migrations aplicadas em dev
1. `db/migrations/0001_initial_schema.sql`
2. `db/migrations/0002_appointment_overlap_guard.sql`

A aplicação foi verificada com as tabelas esperadas no schema `public`. Registre futuras migrations em arquivos SQL novos e aplique-as primeiro em uma branch de desenvolvimento.

## Antes de dados reais
Esta versão é um MVP técnico para testes com dados fictícios. Antes de dados pessoais reais, concluir e testar:
- autenticação e sessão no servidor;
- autorização por organização e função em todas as leituras e gravações;
- isolamento de tenant no banco, incluindo RLS ou uma fronteira equivalente revisada;
- permissões por tipo de registro profissional;
- armazenamento privado de documentos e URLs assinadas;
- auditoria de leitura e alteração de registros sensíveis;
- backups e restauração;
- consentimento, retenção, exclusão e revisão LGPD;
- configuração de domínio confiável no Neon Auth para o domínio final do deploy.

Não cadastrar dados pessoais reais até a conclusão dessa revisão.
