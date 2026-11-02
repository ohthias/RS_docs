# Instalação e configuração

Este guia leva você de um clone vazio até o RoboStage rodando em `http://localhost:3000`, com banco de dados, autenticação e armazenamento configurados.

## Pré-requisitos

| Ferramenta | Observação |
| --- | --- |
| Node.js | Use uma versão LTS recente, compatível com Next.js 16. |
| npm | Vem com o Node.js. O projeto usa `package-lock.json`. |
| Git | Para clonar o repositório e abrir pull requests. |
| PostgreSQL | Recomendado: um projeto no [Neon](https://neon.tech). O cliente usa o driver serverless `@neondatabase/serverless`. |
| Conta no Clerk | Autenticação, organizações (equipes) e webhooks. |

## 1. Clonar e instalar

```bash
git clone https://github.com/ohthias/roboStage.git
cd roboStage
npm install
```

## 2. Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto. Ele já está no `.gitignore`.

> [!CAUTION]
> Nunca envie `.env.local`, chaves ou secrets para o Git — nem em issues e pull requests.

```bash
# Banco de dados (obrigatória)
DATABASE_URL="postgresql://usuario:senha@host/banco?sslmode=require"

# Clerk (obrigatórias)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# Cloudflare R2 — arquivos do QuickBrick Studio (opcional em dev)
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET="quickbrick-projects"

# NECTA — publicações lidas do Supabase (opcional)
NEWS_SUPABASE_URL=""
NEWS_SUPABASE_ANON_KEY=""
NEWS_REVALIDATE_SECRET=""
```

| Variável | Obrigatória | Usada em | Para quê |
| --- | --- | --- | --- |
| `DATABASE_URL` | Sim | `db/client.ts`, `drizzle.config.ts` | Conexão com o PostgreSQL. Sem ela a aplicação e o Drizzle Kit não iniciam. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Sim | `@clerk/nextjs` | Chave pública do Clerk. |
| `CLERK_SECRET_KEY` | Sim | `@clerk/nextjs` | Chave secreta do Clerk (servidor). |
| `CLERK_WEBHOOK_SECRET` | Para o webhook | `db/clerk-sync.ts` | Valida a assinatura Svix dos eventos do Clerk. |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` | Para uploads | `utils/quickbrick/r2.ts` | Fotos do robô e projetos `.io` do Studio 2.0. |
| `R2_BUCKET` | Não | `utils/quickbrick/r2.ts` | Padrão: `quickbrick-projects`. |
| `NEWS_SUPABASE_URL`, `NEWS_SUPABASE_ANON_KEY` | Não | `utils/institutional/news.ts` | Leitura das publicações do NECTA. Sem elas, o site funciona sem notícias. |
| `NEWS_REVALIDATE_SECRET` | Não | `app/api/revalidate/news` | Autoriza o editor do NECTA a atualizar o cache das notícias. |

> [!NOTE]
> Sem as variáveis do R2, só o upload de arquivos do QuickBrick Studio falha — com a mensagem "Armazenamento R2 não configurado". O restante da plataforma funciona normalmente.

## 3. Banco de dados

O schema é definido com Drizzle em `db/schema/` e as migrações ficam em `drizzle/`. Com o `DATABASE_URL` configurado, aplique as migrações:

```bash
npm run db:migrate
```

Para inspecionar os dados, abra o Drizzle Studio:

```bash
npm run db:studio
```

Os detalhes de modelagem e o fluxo para criar novas migrações estão em [Banco de dados](../banco-de-dados.md).

> [!WARNING]
> Confirme para qual banco o `DATABASE_URL` aponta antes de rodar `db:migrate` ou `db:push`. Nunca aplique alterações destrutivas em produção sem autorização.

## 4. Clerk

1. Crie uma aplicação no painel do Clerk e copie as chaves para o `.env.local`.
2. Ative **Organizations** — cada equipe do RoboStage é uma organização do Clerk.
3. Em **Webhooks**, crie um endpoint apontando para `/api/webhooks/clerk` com os eventos `user.*`, `organization.updated`, `organization.deleted` e `organizationMembership.*`. Copie o *signing secret* para `CLERK_WEBHOOK_SECRET`.

> [!TIP]
> Em desenvolvimento local o webhook não alcança sua máquina sem um túnel público. Não tem problema: na primeira ação autenticada, `requireAuthenticatedUser()` cria a linha do usuário no banco se ela ainda não existir.

Veja [Autenticação e permissões](../autenticacao.md) para o fluxo completo.

## 5. Rodar

```bash
npm run dev
```

O servidor sobe com Turbopack em `http://localhost:3000`.

## Scripts disponíveis

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Ambiente de desenvolvimento (Next.js + Turbopack). |
| `npm run build` | Build de produção. Rode antes de abrir um pull request. |
| `npm run start` | Serve a build de produção. |
| `npm test` | Suíte de testes (Vitest + PGlite, sem banco externo). |
| `npm run db:generate` | Gera uma migração a partir das mudanças no schema. |
| `npm run db:migrate` | Aplica as migrações pendentes. |
| `npm run db:push` | Sincroniza o schema direto no banco (sem migração). |
| `npm run db:studio` | Abre o Drizzle Studio. |
| `npm run data:mission-images` | Regenera as imagens das missões após editar `missions.json`. |
| `npm run perf:first-load` | Mede o JavaScript de primeira carga das páginas (build local). |
| `npm run perf:lighthouse` | Roda o Lighthouse e mostra a mediana das métricas. |

## Testes

```bash
npm test
```

Os testes ficam em `tests/` e rodam contra um **Postgres em memória** (PGlite) com o schema real do projeto. O Clerk é simulado em `tests/setup.ts`, então nenhuma chave ou banco externo é necessário.

## Problemas comuns

**`DATABASE_URL não foi encontrada`** — o Drizzle Kit lê `.env.local`. Confira se o arquivo está na raiz e se a variável está escrita exatamente assim.

**`violates foreign key constraint ... users`** — o usuário do Clerk ainda não existe na tabela `users`. Isso é resolvido automaticamente na primeira ação autenticada; se persistir, verifique o webhook do Clerk.

**`401 Não autenticado` em chamadas `fetch`** — rotas protegidas de API e Server Actions respondem `401` em JSON (em vez de redirecionar) quando não há sessão. Faça login antes de testar.
