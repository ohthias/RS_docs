# Arquitetura

O RoboStage é um **monólito Next.js** (App Router) implantado na Vercel. A mesma aplicação serve as páginas públicas, o Dashboard logado e as rotas de API. Os serviços externos são poucos e bem delimitados: Clerk (identidade), PostgreSQL no Neon (dados), Cloudflare R2 (arquivos grandes) e Supabase (conteúdo do NECTA).

## Visão de camadas

```text
                    Navegador
                        │
              ┌─────────▼──────────┐
              │      proxy.ts      │   Clerk: sessão, rotas
              └─────────┬──────────┘   públicas, onboarding
                        │
  ┌─────────────────────▼──────────────────────┐
  │ app/                                       │
  │   Server Components   → leem dados         │
  │   Server Actions      → gravam             │
  │   Route Handlers      → /api               │
  └─────────────────────┬──────────────────────┘
                        │
  ┌─────────────────────▼──────────────────────┐
  │ utils/   regras, escopo e permissões       │
  └─────────────────────┬──────────────────────┘
                        │
  ┌─────────────────────▼──────────────────────┐
  │ db/      Drizzle ORM  →  PostgreSQL (Neon) │
  └────────────────────────────────────────────┘
```

| Camada | Onde fica | Responsabilidade |
| --- | --- | --- |
| Middleware | `proxy.ts` | Exige sessão nas rotas protegidas e envia para o onboarding quando preciso. |
| Interface | `app/**/page.tsx`, `components/` | Server Components renderizam no servidor; componentes `"use client"` cuidam da interação. |
| Mutação | `app/**/actions.ts` | Server Actions: validam a entrada, conferem escopo e permissão e gravam no banco. |
| API | `app/api/**/route.ts` | Dados das temporadas, competições do usuário, LabTest, documentos legais e webhooks. |
| Domínio | `utils/` | Regras puras e reutilizáveis: pontuação, escopo, permissões, estatísticas. |
| Persistência | `db/` | Schema Drizzle e cliente do banco. |

## Fluxo de uma ação

Exemplo: criar um marco (milestone) no espaço de uma equipe.

1. O componente cliente chama uma Server Action. As de marcos ficam em `utils/stagebook/actions/milestones.ts`.
2. A action resolve o **escopo** com `resolveStagebookScope()` (`utils/stagebook/scope.ts`). O escopo diz se o usuário está no espaço pessoal ou de uma equipe, e com qual cargo.
3. A permissão é exigida com `requireCapability(scope, "milestone.manage")` (`utils/stagebook/permissions.ts`), que consulta a matriz de `team-permissions.ts`. No espaço pessoal o dono pode tudo.
4. A gravação usa `scopeOwnership(scope)` para preencher **exatamente um** entre `user_id` e `team_id`. Um `CHECK` no banco garante isso.
5. A action chama `revalidatePath(...)`, e os Server Components relêem os dados atualizados.

> [!IMPORTANT]
> As Server Actions são a barreira de segurança real. A interface consulta a mesma matriz de permissões apenas para esconder ou desabilitar controles.

## Escopos: pessoal e equipe

Quase tudo no Dashboard (páginas, pastas, Kanban, calendário, LabTest, ThinkLab, etiquetas e marcos) pertence a um **escopo**:

- **Pessoal**: `user_id` preenchido e `team_id` nulo.
- **Equipe**: `team_id` preenchido e `user_id` nulo.

A equipe ativa fica no cookie `stagebook_team_id`. Se o cookie apontar para uma equipe da qual a pessoa não faz mais parte, o escopo volta silenciosamente para o pessoal, sem nunca conceder acesso indevido. Os detalhes estão em [Autenticação e permissões](autenticacao.md).

## Integrações

| Serviço | Uso | Onde |
| --- | --- | --- |
| **Clerk** | Login, sessões, organizações (equipes) e convites. Um webhook espelha usuários e membros no banco. | `proxy.ts`, `db/clerk-sync.ts`, `app/api/webhooks/clerk` |
| **Neon (PostgreSQL)** | Todos os dados da plataforma, via Drizzle sobre HTTP. | `db/client.ts` |
| **Cloudflare R2** | Fotos do robô e projetos `.io` do Studio 2.0 no QuickBrick. | `utils/quickbrick/r2.ts` |
| **Supabase** | Publicações do NECTA, lidas pela API REST com a chave pública. | `utils/institutional/news.ts` |
| **Vercel** | Hospedagem, Analytics e Speed Insights. | `app/layout.tsx` |

### Uploads diretos para o R2

Arquivos grandes não passam pelas funções serverless, que têm limite de corpo. O fluxo é este:

1. O servidor gera uma **URL pré-assinada** para o objeto.
2. O navegador envia o arquivo direto para o R2.
3. O servidor confere o objeto com `HEAD` e grava apenas a **chave** no banco.

### Cache das notícias (NECTA)

As publicações são buscadas com a tag de cache `news` e revalidadas a cada 5 minutos. Quando algo é publicado, o editor do NECTA chama `POST /api/revalidate/news` com o segredo `NEWS_REVALIDATE_SECRET`, e o site atualiza na hora.

## "Tempo real"

O RoboStage não usa WebSockets. O componente `LiveRefresh` (`components/stagebook/live-refresh.tsx`) chama `router.refresh()` a cada 30 segundos, e só enquanto a aba está visível. Ele nunca empilha atualizações e faz uma atualização imediata quando a pessoa volta para a aba. O intervalo é conservador de propósito: um `refresh` re-renderiza a rota inteira, e intervalos curtos geram erros 429 no Clerk e no Neon.

## Dados das temporadas

Missões, documentos oficiais e catálogos que não variam por usuário ficam em JSON dentro de `public/data/`. Eles são servidos pelas rotas `/api/data/*`, o que permite atualizar uma temporada sem migração de banco.

## Testes

A suíte em `tests/` roda as Server Actions contra um **Postgres em memória** (PGlite) com o schema real e com o Clerk simulado. Assim é possível testar regras de escopo, permissão e integridade sem nenhum serviço externo.

## Leia também

- [Arquitetura das rotas](rotas.md): grupos de rotas, segmentos dinâmicos e acesso.
- [Tipagem](tipagem.md): tipos do banco, `types/` e validação de entrada.
- [Competições](competicoes.md): o que cada competição oferece.
