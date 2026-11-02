# Estrutura do projeto

O RoboStage é uma única aplicação Next.js (App Router). O código é separado por responsabilidade: rotas em `app/`, interface em `components/`, persistência em `db/` e regras de negócio em `utils/`.

## Visão geral

```text
roboStage/
├── app/                 Rotas, layouts, Server Actions e rotas de API
├── components/          Componentes React, agrupados por ferramenta
├── db/                  Cliente do banco, schema Drizzle e sincronização com o Clerk
├── drizzle/             Migrações SQL geradas (e scripts manuais equivalentes)
├── hooks/               Hooks React reutilizáveis
├── utils/               Regras de negócio e funções compartilhadas, por domínio
├── types/               Tipos TypeScript compartilhados
├── content/             Conteúdo em Markdown (documentos legais)
├── public/              Arquivos estáticos e dados das temporadas (JSON)
├── scripts/             Scripts de manutenção e medição de desempenho
├── tests/               Testes automatizados (Vitest + PGlite)
├── docs/                Esta documentação
├── proxy.ts             Middleware: autenticação e onboarding (Clerk)
└── drizzle.config.ts    Configuração do Drizzle Kit
```

## `app/` — rotas

O App Router usa **grupos de rotas** (pastas entre parênteses) para organizar arquivos sem alterar a URL.

| Pasta | Conteúdo |
| --- | --- |
| `app/(public)/` | Páginas abertas: home, competições (`[competicao]`), Stagebook, LabTest, Anatix, ShowLive, notícias, ajuda, legal etc. |
| `app/(auth)/` | Entrada e cadastro (`/sign-in`, `/sign-up`). |
| `app/(protected)/dashboard/` | Área logada: documentos, pastas, Kanban, calendário, LabTest, QuickBrick, ThinkLab, equipe, ligas e configurações. |
| `app/(protected)/(thinklab)/` | Editor de quadros do ThinkLab, com layout próprio. |
| `app/onboarding/` | Escolha de perfil e ligas no primeiro acesso. |
| `app/api/` | Rotas HTTP — veja [APIs](../referencia/apis.md). |
| `app/context/` | Contextos React globais (ex.: `ToastContext`). |

Cada ferramenta do Dashboard tem seu `actions.ts` com as **Server Actions** que leem e gravam no banco — por exemplo `app/(protected)/dashboard/kanban/actions.ts` e `app/(protected)/dashboard/labtest/actions.ts`.

O catálogo completo de URLs está em [Páginas e rotas](../referencia/paginas.md), e a organização das rotas é explicada em [Arquitetura das rotas](../rotas.md).

## `components/` — interface

Componentes agrupados pela ferramenta a que pertencem:

| Pasta | Conteúdo |
| --- | --- |
| `components/UI/` | Peças compartilhadas: `Navbar`, `Footer`, `HeroSection`, `Logo`, `Modal`, `Accordion`, `RevealOnScroll`. |
| `components/home/` | Seções da página inicial. |
| `components/dashboard/` | Barra lateral, banner e atalhos do Dashboard. |
| `components/stagebook/` | Seletor de escopo (pessoal/equipe), notificações, etiquetas, atualização ao vivo. |
| `components/labtest/` | Formulários de execução, editor de campos, gráficos, modos FLL/OBR e Anatix. |
| `components/QuickBrick/` | Ferramentas de estratégia e o caderno do robô. |
| `components/thinklab/` | Editor de quadros. |
| `components/editor/` | Editor de documentos baseado em Lexical. |
| `components/competicoes/` | Páginas de cada competição (FLL, OBR). |
| `components/Timers/`, `FlashQA/`, `Rubric/`, `EmpathyMap/` | Ferramentas avulsas. |

## `db/` — banco de dados

| Arquivo | Responsabilidade |
| --- | --- |
| `db/client.ts` | Cria o cliente Drizzle sobre o driver HTTP do Neon. Exporta `db`. |
| `db/schema/` | Um arquivo por domínio (`users.ts`, `teams.ts`, `boards.ts`, `labtest.ts`…), reexportados por `index.ts`. |
| `db/schema/relations.ts` | Relações usadas por `db.query.<tabela>.findMany({ with })`. |
| `db/clerk-sync.ts` | Handler do webhook do Clerk: espelha usuários, equipes e membros no banco. |

Detalhes em [Banco de dados](../banco-de-dados.md).

## `utils/` — regras de negócio

Funções puras e regras de domínio, separadas da interface para serem reutilizadas por páginas, Server Actions e testes. Destaques:

| Pasta | Conteúdo |
| --- | --- |
| `utils/stagebook/` | Escopo (pessoal/equipe), matriz de permissões de equipe, validação. |
| `utils/labtest/` | Catálogo de testes, modos e estatísticas. |
| `utils/quickbrick/` | Pontuação, normalização de missões e cliente do Cloudflare R2. |
| `utils/competitions/` | Catálogo e navegação das competições. |
| `utils/institutional/` | Notícias (NECTA), documentos legais, releases. |

Referência completa em [Utilitários](../referencia/utilitarios.md).

## Dados estáticos

`public/data/` guarda os dados das temporadas que não mudam por usuário: `missions.json`, `fllDocs.json`, `obrDocs.json`, `toolsAbout.json` e as pastas `fll/` e `obr/`. Eles são servidos pelas rotas `/api/data/*`.

> [!TIP]
> Depois de editar `missions.json`, rode `npm run data:mission-images` para regenerar as imagens das missões.

## Convenções

- **Importações** usam o alias `@/` para a raiz do projeto (`@/db/client`, `@/utils/stagebook/scope`).
- **Código só de servidor** importa `server-only` para falhar no build se for parar no navegador.
- **Nomes de tabelas** ficam em `snake_case` no banco e `camelCase` no TypeScript.
- **Textos de interface e mensagens de erro** são escritos em português.
- **Commits** seguem o padrão `tipo: descrição` (`feat`, `fix`, `docs`…) — veja [Contribuir](../contribuir.md).
