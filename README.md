# RoboStage Docs

[![CI](https://img.shields.io/badge/CI-build%20%2B%20links-cf2a2a)](.github/workflows/ci.yml) [![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-1e459f)](LICENSE)

Código do **[docs.robostage.com.br](https://docs.robostage.com.br)**, a documentação técnica do [RoboStage](https://www.robostage.com.br).

Site estático em Next.js 16 + Tailwind 4 + daisyUI, com o visual do robostage.com.br. O conteúdo é escrito em Markdown.

## Rodando

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # gera o site estático em out/
npm run check:links  # depois do build: confere links internos e âncoras
```

## Escrevendo

```text
content/docs/
├── index.md                 Visão geral (página inicial)
├── comecar/instalacao.md
├── comecar/estrutura.md
├── arquitetura.md
├── autenticacao.md
├── banco-de-dados.md
├── funcionalidades.md
├── referencia/paginas.md
├── referencia/apis.md
├── referencia/hooks.md
├── referencia/utilitarios.md
└── contribuir.md
```

- **Página nova:** crie o `.md` e adicione-o em `nav`, no arquivo `lib/site.ts`. A ordem ali define a barra lateral e o "Anterior / Próximo".
- **Título:** um único `#` por página. As seções `##` e `###` entram automaticamente em "Nesta página" e na busca.
- **Links entre páginas:** podem apontar para o `.md` (`[APIs](referencia/apis.md)`). Os nomes da documentação antiga (`API.md`, `development/setup.md`…) também são convertidos.
- **Avisos:** use os callouts do GitHub: `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]` e `[!CAUTION]`.
- **Código:** blocos com linguagem (` ```ts `) recebem realce (Shiki) e um botão de copiar.

## Recursos

- Busca com `Ctrl/⌘ K` ou `/`, a partir de um índice gerado no build (`/search.json`).
- "Nesta página" com a seção visível destacada.
- Tema claro e escuro, que segue o sistema e lembra a escolha do usuário.
- Link "Editar no GitHub" em cada página. A base é configurada em `site.editBase` (`lib/site.ts`).
- `sitemap.xml`, `robots.txt` e página 404.

## Publicando em docs.robostage.com.br

O build gera HTML estático em `out/`, compatível com Vercel, Cloudflare Pages ou GitHub Pages.

**Vercel:** importe o repositório e use o framework Next.js. Depois adicione o domínio `docs.robostage.com.br` e crie no DNS um `CNAME docs → cname.vercel-dns.com`.

### Dentro do repositório principal (pasta `docs/`)

Para manter a documentação junto do código, substitua o conteúdo de `docs/` por este projeto e:

1. No `tsconfig.json` da **raiz** do roboStage, adicione `"docs"` em `exclude`. Sem isso, a build do site principal tenta compilar os arquivos daqui.
2. Na Vercel, crie um segundo projeto apontando para o mesmo repositório com **Root Directory = `docs`**.
3. Mantenha `site.editBase` como `…/edit/main/docs/content/docs/`, que já é o padrão.

## Documentos do repositório

| Arquivo | Conteúdo |
| --- | --- |
| [CONTRIBUTING](.github/CONTRIBUTING.md) | Como contribuir, como escrever uma página e o guia de estilo. |
| [CODE-OF-CONDUCT](.github/CODE-OF-CONDUCT.md) | Código de Conduta, que segue o do RoboStage. |
| [SECURITY](.github/SECURITY.md) | O que reportar aqui, o que reportar no roboStage e como reportar de forma privada. |
| [CHANGELOG](.github/CHANGELOG.md) | Histórico de versões da documentação (`YYYY.N`). |
| [LICENSES](.github/LICENSES.md) | Licenças das dependências de terceiros. |
| [LICENSE](LICENSE) | Licença MIT. |

Os modelos de issue e de pull request ficam em `.github/`. O CI (`.github/workflows/ci.yml`) roda o build e o verificador de links em todo pull request.

## Licença

[MIT](LICENSE) © 2025-2026 Matheus Gabriel.
