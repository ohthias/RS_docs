# Changelog

Todas as mudanças relevantes do **RoboStage Docs** são registradas neste arquivo.

O projeto acompanha o versionamento do RoboStage, **`YYYY.N`**:

- `YYYY` é o ano da atualização;
- `N` é a ordem da atualização naquele ano.

Uma versão da documentação descreve a versão de mesmo número da plataforma. Por exemplo, a `2026.7` documenta o RoboStage `2026.7`.

---

## Não lançado

### Adicionado

- Página **Arquitetura das rotas**: arquivos especiais, grupos, segmentos dinâmicos, rotas de competição, Dashboard, APIs, acesso e passo a passo para criar rotas.
- Página **Tipagem**: configuração do TypeScript, tipos do Drizzle, pasta `types/`, padrões (uniões discriminadas, `as const`, `satisfies`, type guards) e validação de entrada.
- Página **Competições**: o que FLL, Future Edition e OBR oferecem, temporadas, pontuação do Resgate e recursos por liga.
- **Utilitários** ampliado com OBR, dados estáticos, caderno do robô, ArenaBuilder, StageMap, ThinkLab, novos módulos do LabTest e do Stagebook.

### Alterado

### Corrigido

---

## 2026.7 — 2026-11-01

Primeira versão do **docs.robostage.com.br**, que substitui a documentação em Docsify da pasta `docs/` do repositório principal.

### Site

- Site estático em Next.js 16 (`output: "export"`), Tailwind CSS 4 e daisyUI, com os tokens visuais do robostage.com.br.
- Barra lateral numerada, índice "Nesta página" com a seção visível destacada e navegação Anterior / Próximo.
- Busca por páginas e seções (`Ctrl/⌘ K` ou `/`), com índice gerado no build.
- Realce de sintaxe (Shiki) com botão de copiar e tema claro e escuro.
- Callouts no formato do GitHub (`> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`).
- Link "Editar no GitHub" em todas as páginas.
- `sitemap.xml`, `robots.txt` e página 404.
- Verificador de links internos e âncoras (`npm run check:links`).

### Conteúdo

- **Novas páginas**, escritas a partir do código da `2026.7`: Instalação e configuração, Estrutura do projeto, Arquitetura, Autenticação e permissões, Banco de dados, Funcionalidades e Contribuir.
- **Migradas** da documentação anterior: Visão geral, Páginas e rotas, APIs, Contextos e hooks, Utilitários.
- Links antigos (`API.md`, `development/setup.md`…) passam a apontar para as novas URLs.

### Corrigido

- Duas âncoras quebradas em Utilitários, que apontavam para seções de Contextos e hooks com o nome errado.
