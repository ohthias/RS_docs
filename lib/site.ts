/**
 * Configuração do docs.robostage.com.br.
 *
 * `nav` define a ordem da barra lateral e do "Anterior / Próximo".
 * Cada `slug` corresponde a um arquivo em `content/docs/<slug>.md`
 * (o slug "" é a página inicial, `content/docs/index.md`).
 */

export const site = {
  name: "RoboStage Docs",
  url: "https://docs.robostage.com.br",
  platform: "https://www.robostage.com.br",
  repo: "https://github.com/ohthias/roboStage",
  /** Onde ficam os .md deste projeto — usado no link "Editar no GitHub". */
  editBase: "https://github.com/ohthias/RS_docs/edit/master/docs/content/docs/",
  version: "v2026.7",
};

export type NavItem = { slug: string; title: string; description: string };
export type NavSection = { title: string; items: NavItem[] };

export const nav: NavSection[] = [
  {
    title: "Começar",
    items: [
      { slug: "", title: "Visão geral", description: "O que é o RoboStage e como esta documentação está organizada." },
      { slug: "comecar/instalacao", title: "Instalação e configuração", description: "Ambiente local, variáveis de ambiente, banco e scripts." },
      { slug: "comecar/estrutura", title: "Estrutura do projeto", description: "Diretórios, responsabilidades e convenções." },
    ],
  },
  {
    title: "Fundamentos",
    items: [
      { slug: "arquitetura", title: "Arquitetura", description: "Camadas, fluxo de uma requisição e integrações." },
      { slug: "rotas", title: "Arquitetura das rotas", description: "App Router, grupos, segmentos dinâmicos, competições e acesso." },
      { slug: "autenticacao", title: "Autenticação e permissões", description: "Clerk, middleware, escopos e cargos de equipe." },
      { slug: "banco-de-dados", title: "Banco de dados", description: "Modelagem com Drizzle, tabelas e migrações." },
      { slug: "tipagem", title: "Tipagem", description: "TypeScript estrito, tipos do Drizzle, types/ e validação." },
      { slug: "funcionalidades", title: "Funcionalidades", description: "Os módulos do ecossistema, um a um." },
      { slug: "competicoes", title: "Competições", description: "O que a FLL, a Future Edition e a OBR oferecem." },
    ],
  },
  {
    title: "Referência",
    items: [
      { slug: "referencia/paginas", title: "Páginas e rotas", description: "Catálogo de rotas do App Router por área e acesso." },
      { slug: "referencia/apis", title: "APIs", description: "Endpoints HTTP, parâmetros, respostas e erros." },
      { slug: "referencia/hooks", title: "Contextos e hooks", description: "Estado compartilhado e hooks reutilizáveis." },
      { slug: "referencia/utilitarios", title: "Utilitários", description: "Regras de negócio compartilhadas em utils/." },
    ],
  },
  {
    title: "Comunidade",
    items: [
      { slug: "contribuir", title: "Contribuir", description: "Como propor mudanças no código e nesta documentação." },
    ],
  },
];

export const links = [
  { label: "Plataforma", href: site.platform },
  { label: "Changelog", href: `${site.repo}/blob/main/.github/CHANGELOG.md` },
  { label: "Reportar problema", href: `${site.repo}/issues/new/choose` },
];

/** Nomes dos arquivos da documentação antiga (Docsify) → slug novo. */
export const legacyLinks: Record<string, string> = {
  "readme.md": "",
  "development/setup.md": "comecar/instalacao",
  "development/project-structure.md": "comecar/estrutura",
  "architecture.md": "arquitetura",
  "authentication.md": "autenticacao",
  "database.md": "banco-de-dados",
  "features.md": "funcionalidades",
  "pages.md": "referencia/paginas",
  "api.md": "referencia/apis",
  "development.md": "referencia/hooks",
  "utils.md": "referencia/utilitarios",
};

export const flatNav = nav.flatMap((s) => s.items.map((i) => ({ ...i, section: s.title })));

export const href = (slug: string) => (slug ? `/${slug}/` : "/");
