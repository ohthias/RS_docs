# Arquitetura das rotas

O RoboStage usa o **App Router** do Next.js. Cada pasta dentro de `app/` vira um segmento da URL, e arquivos com nomes reservados (`page.tsx`, `layout.tsx`, `route.ts`…) dizem o que aquele segmento faz. Esta página explica como as rotas estão organizadas, quem decide o acesso a cada uma e como uma rota nova deve ser criada.

Para a lista completa de URLs, veja [Páginas e rotas](referencia/paginas.md).

## Arquivos especiais

| Arquivo | Papel | Exemplos no projeto |
| --- | --- | --- |
| `page.tsx` | Torna o segmento acessível como página. | 77 páginas em `app/` |
| `layout.tsx` | Envolve as páginas filhas e persiste entre navegações. | `app/layout.tsx`, `dashboard/layout.tsx`, `[competicao]/layout.tsx` |
| `loading.tsx` | Esqueleto exibido enquanto o Server Component carrega (Suspense). | `documents/[documentId]/loading.tsx`, `quickbrick/[id]/loading.tsx` |
| `not-found.tsx` | Resposta para `notFound()`. | `app/not-found.tsx`, `[competicao]/not-found.tsx` |
| `error.tsx` | Fronteira de erro do cliente. | `app/error.tsx` |
| `route.ts` | Route Handler HTTP (API). | `app/api/**/route.ts` |
| `actions.ts` | Server Actions da área (convenção do projeto, não do Next). | `dashboard/kanban/actions.ts` |
| `sitemap.ts`, `robots.ts` | Arquivos gerados para buscadores. | `app/sitemap.ts`, `app/robots.ts` |

## Grupos de rotas

Pastas entre parênteses agrupam arquivos **sem aparecer na URL**. O projeto usa grupos para separar áreas com layouts e regras de acesso diferentes:

```text
app/
├── layout.tsx                  Raiz: Clerk, fonte, tema, Analytics
├── (public)/                   Site aberto
│   ├── page.tsx                → /
│   ├── about/, news/, help/…   → /about, /news, /help…
│   └── [competicao]/           → /fll, /obr…
│       ├── (fll)/              Páginas só da FLL
│       └── (obr)/              Páginas só da OBR
├── (auth)/                     → /sign-in, /sign-up (componentes do Clerk)
├── (protected)/
│   ├── dashboard/              → /dashboard/* (área logada, com sidebar)
│   └── (thinklab)/dashboard/thinklab/[id]
│                               → editor do ThinkLab, com layout próprio
├── onboarding/                 → /onboarding
└── api/                        → /api/*
```

> [!NOTE]
> Repare em `(protected)/(thinklab)/dashboard/thinklab/[id]`. A URL é a mesma de uma página do Dashboard (`/dashboard/thinklab/<id>`), mas, como o arquivo fica fora de `(protected)/dashboard/`, o editor **não herda** o `dashboard/layout.tsx`. Ele usa a tela inteira, sem a barra lateral.

Os nomes `(public)` e `(protected)` são organizacionais: **quem bloqueia o acesso é o `proxy.ts`**, e não o grupo (veja [abaixo](#quem-decide-o-acesso)).

## Segmentos dinâmicos

| Segmento | Tipo | Onde | O que recebe |
| --- | --- | --- | --- |
| `[competicao]` | Dinâmico | `(public)/[competicao]` | `fll` ou `obr` |
| `[season]` | Dinâmico | `score/[season]`, `matriz-swot/[season]`, `tabela-de-missoes/[season]` | `bioglow`, `unearthed`, `submerged`, `masterpiece` |
| `[mode]` | Dinâmico | `timers/[mode]` | `robot-game`, `judging`, `round`, `custom` |
| `[id]`, `[boardId]`, `[documentId]`, `[folderId]`, `[diagramId]` | Dinâmico | Dashboard | UUID do recurso |
| `[slug]` | Dinâmico | `news/[slug]`, `legal/[slug]` | Texto da URL |
| `[[...sign-in]]` | Catch-all opcional | `(auth)/sign-in` | Subpáginas internas do Clerk |

Nas versões atuais do Next.js, `params` é uma **Promise**:

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ competicao: string }>;
}) {
  const { competicao } = await params;
  // ...
}
```

## Rotas de competição

Todas as competições compartilham a mesma árvore em `app/(public)/[competicao]/`. Três camadas garantem que só URLs válidas respondam.

**1. O layout valida a competição.** `[competicao]/layout.tsx` consulta o catálogo `COMPETICOES` (`utils/competitions/competicoes.ts`) e chama `notFound()` para qualquer valor desconhecido. Assim `/fllx` ou `/vex` caem no 404.

**2. A home é escolhida por mapa.** `[competicao]/page.tsx` busca o componente da home em `COMPETICOES_COMPONENTES` (`utils/competitions/competicoes-map.ts`): `FLLHome` ou `OBRHome`.

**3. Páginas exclusivas checam a competição.** Os grupos `(fll)` e `(obr)` só organizam os arquivos. Como o segmento `[competicao]` continua valendo, cada página exclusiva faz a própria checagem:

```tsx
// app/(public)/[competicao]/(fll)/begins/page.tsx
const { competicao } = await params;
if (competicao !== "fll") notFound(); // /obr/begins → 404
```

| Página | FLL | OBR | Checagem |
| --- | :---: | :---: | --- |
| `begins`, `explore`, `docs/missions-guide`, `future-edition/*` | ✓ | | `competicao !== "fll"` |
| `bastidores` | | ✓ | `competicao !== "obr"` |
| `cheklist` | ✓ | ✓ | `isConfereAICompetition()` |
| `docs` | ✓ | ✓ | `isCompeticao()` |
| `timers/[mode]` | ✓ | ✓ | Modos de `TIMERS_BY_COMPETITION` |
| `score` | ✓ | ✓ | A página troca o conteúdo: temporadas da FLL ou o Pontuador da OBR |
| `quickbrick/*` | ✓ | ✓ | Ferramentas de `ferramentasPorCompeticao` |

> [!WARNING]
> Uma página nova dentro de `(fll)` ou `(obr)` **precisa** chamar `notFound()` para as outras competições. O grupo de rota sozinho não impede `/obr/<página-da-fll>`.

O que cada competição oferece está descrito em [Competições](competicoes.md).

### Menus e temporadas

A navegação das competições vem de `NAVIGATION` (`utils/competitions/navigation.ts`), com menus "Ferramentas" e "Recursos", atalhos e temporadas da FLL. Os modos de cronômetro vêm de `TIMERS_BY_COMPETITION` (`[competicao]/timers/config.ts`). O `sitemap.ts` usa essas mesmas fontes.

## Área logada (`/dashboard`)

`(protected)/dashboard/layout.tsx` monta a moldura do Dashboard: barra lateral, seletor de escopo (pessoal ou equipe), notificações e preferências. Cada ferramenta segue o mesmo padrão:

```text
dashboard/kanban/
├── page.tsx              Lista (Server Component: lê do banco)
├── actions.ts            Server Actions: criar, renomear, excluir
└── [boardId]/
    ├── page.tsx          Detalhe
    └── actions.ts        Ações do quadro (cartões, colunas…)
```

- **Leitura:** a `page.tsx` é um Server Component assíncrono que resolve o escopo e consulta o banco direto, sem passar por API.
- **Escrita:** os componentes cliente chamam funções de `actions.ts` (`"use server"`), que validam, conferem permissão, gravam e chamam `revalidatePath()`.
- **Carregamento:** `loading.tsx` mostra um esqueleto nas rotas mais pesadas (documentos, pastas, QuickBrick, ligas e o editor do ThinkLab).

Algumas actions compartilhadas entre ferramentas ficam em `utils/stagebook/actions/` (etiquetas, marcos, notificações, equipes, preferências).

## Rotas de API

| Rota | Método | Acesso | Observação |
| --- | --- | --- | --- |
| `/api/competitions` | `GET` | Sessão | Ligas do usuário. |
| `/api/data/missions` | `GET` | Pública | Catálogo de missões de todas as temporadas. |
| `/api/data/missions/[season]` | `GET` | Pública | Uma temporada. Estática: `force-static` + `generateStaticParams`. |
| `/api/data/missions/future-edition` | `GET` | Pública | Missões da Future Edition. |
| `/api/data/fllDocs`, `/api/data/obrDocs`, `/api/data/toolsAbout` | `GET` | Pública | Documentos e textos das ferramentas. |
| `/api/legal/[slug]` | `GET` | Pública | Termos e privacidade em Markdown. |
| `/api/revalidate/news` | `POST` | Segredo `Bearer` | Atualiza o cache do NECTA. |
| `/api/webhooks/clerk` | `POST` | Assinatura Svix | Sincroniza usuários e equipes. |

> [!TIP]
> Prefira **Server Actions** para mutações feitas pela própria interface. Crie um Route Handler só quando algo externo precisa chamar a URL: webhook, outro site, `fetch` público. Detalhes de cada endpoint em [APIs](referencia/apis.md).

## Quem decide o acesso

O controle de acesso por rota fica no middleware [`proxy.ts`](https://github.com/ohthias/roboStage/blob/main/proxy.ts):

1. Se o caminho está em `publicRoutePatterns`, a requisição segue.
2. Sem sessão: navegação `GET` vai para `/sign-in?redirect_url=…`; chamadas de API e `POST` recebem `401` em JSON.
3. Com sessão, mas onboarding pendente: redireciona para `/onboarding`.

O `matcher` ignora `_next` e arquivos com extensão, e sempre inclui `/api`.

A autorização **fina** (de quem é o dado e o que cada cargo pode fazer) acontece nas Server Actions e nas páginas, pelo escopo. Veja [Autenticação e permissões](autenticacao.md).

### Lista única de rotas públicas

[`utils/competitions/routes.ts`](https://github.com/ohthias/roboStage/blob/main/utils/competitions/routes.ts) foi criado para ser **a fonte única** das rotas públicas:

| Export | Conteúdo |
| --- | --- |
| `SITE_PAGES` | Páginas institucionais. |
| `COMPETITION_PAGES` | Páginas válidas de cada competição. |
| `FLL_SCORE_SEASONS`, `FLL_QUICKBRICK_SEASONS` | Temporadas com pontuador e com ferramentas sazonais. |
| `publicSitemapPaths()` | Todas as URLs públicas. |
| `isPublicPath(pathname)` | Se um caminho dispensa login. |

O teste `tests/routes.test.ts` garante que toda URL dessa lista corresponde a uma `page.tsx` existente e que cada competição registrada fica pública.

> [!IMPORTANT]
> Hoje `proxy.ts` e `app/sitemap.ts` **ainda mantêm listas próprias**: só os testes usam `routes.ts`. Ao criar uma rota pública, atualize as três (`routes.ts`, `publicRoutePatterns` no `proxy.ts` e o `sitemap.ts`) até que o middleware e o sitemap passem a importar `isPublicPath` e `publicSitemapPaths`.

## Metadados e SEO

- `app/layout.tsx` define `metadataBase`, o título padrão (`%s | RoboStage`), Open Graph e `alternates.canonical: "./"`, para que cada página seja canônica de si mesma.
- As páginas exportam `metadata` ou `generateMetadata`. As de competição geram o título a partir de `params`.
- `app/sitemap.ts` junta páginas institucionais, páginas das competições, documentos legais e notícias do NECTA. Ele é regerado a cada 5 minutos (`revalidate = 300`) e na hora em que o NECTA publica.

## Criando uma rota

**Página pública institucional**

1. Crie `app/(public)/<nome>/page.tsx` com `metadata`.
2. Adicione o caminho em `publicRoutePatterns` (`proxy.ts`), em `SITE_PAGES` (`routes.ts`) e no `sitemap.ts`.
3. Rode `npm test`: o teste de rotas confere se a página existe.

**Página de uma competição**

1. Crie em `app/(public)/[competicao]/(fll)/` ou `(obr)/` e chame `notFound()` para as outras competições.
2. Adicione em `COMPETITION_PAGES` e, se fizer sentido, no menu de `NAVIGATION`.

**Ferramenta no Dashboard**

1. Crie `app/(protected)/dashboard/<ferramenta>/page.tsx` e `actions.ts`.
2. Nas actions, resolva o escopo e confira a permissão antes de gravar (veja [Arquitetura](arquitetura.md#fluxo-de-uma-ação)).
3. Adicione `loading.tsx` se a página fizer consultas pesadas, e o link em `app/(protected)/dashboard/nav-links.tsx`.

**Competição nova**

1. Registre em `COMPETICOES` (`utils/competitions/competicoes.ts`) e crie a home em `COMPETICOES_COMPONENTES`.
2. Defina menus em `NAVIGATION` e páginas em `COMPETITION_PAGES`.
3. Libere a rota no `proxy.ts`. Hoje a lista é fixa (`/fll(.*)`, `/obr(.*)`).
