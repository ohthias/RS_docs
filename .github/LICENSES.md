# Licenças de terceiros

O RoboStage Docs usa software de código aberto distribuído sob as licenças de cada projeto. Esta lista cobre as **dependências diretas** declaradas no `package.json`. As dependências transitivas podem ter licenças e avisos próprios, que não estão listados aqui.

As licenças abaixo valem apenas para o software de terceiros correspondente. Elas não concedem direitos sobre a marca RoboStage, o logotipo ou outros materiais de identidade visual do projeto.

> Os dados foram conferidos nos pacotes instalados (`node_modules/<pacote>/package.json`). Antes de redistribuir, confirme as versões e as licenças nas fontes oficiais.

## Aplicação

| Pacote | Licença | Autor / projeto |
| --- | --- | --- |
| `next` | MIT | Vercel |
| `react` | MIT | Meta Platforms |
| `react-dom` | MIT | Meta Platforms |
| `lucide-react` | ISC | Lucide Contributors |
| `@fontsource-variable/roboto` | OFL-1.1 (fonte) | The Roboto Project Authors |
| `@fontsource-variable/jetbrains-mono` | OFL-1.1 (fonte) | The JetBrains Mono Project Authors |

As fontes Roboto e JetBrains Mono são distribuídas sob a **SIL Open Font License 1.1**. Elas podem ser usadas, embutidas e redistribuídas com o site, mas não podem ser vendidas sozinhas.

## Build e conteúdo

| Pacote | Licença | Autor / projeto |
| --- | --- | --- |
| `tailwindcss`, `@tailwindcss/postcss`, `@tailwindcss/typography` | MIT | Tailwind Labs |
| `daisyui` | MIT | Pouya Saadeghi |
| `unified`, `remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-slug`, `rehype-autolink-headings`, `rehype-stringify`, `hast-util-to-string`, `unist-util-visit` | MIT | Titus Wormer e colaboradores (unified) |
| `rehype-pretty-code` | MIT | atomiks |
| `shiki` | MIT | Pine Wu, Anthony Fu |
| `github-slugger` | ISC | Dan Flettre |
| `typescript` | Apache-2.0 | Microsoft Corp. |
| `@types/node`, `@types/react`, `@types/react-dom`, `@types/hast` | MIT | DefinitelyTyped |

## Serviços externos usados pelas páginas

- **shields.io**: os selos da página inicial são carregados do shields.io.
- **GitHub**: os links "Editar no GitHub" e as referências ao código apontam para o GitHub.

## Como atualizar esta lista

Depois de adicionar ou atualizar uma dependência, confira a licença dela com:

```bash
node -e 'const p=require("./package.json");for(const d of Object.keys({...p.dependencies,...p.devDependencies})){const m=require("./node_modules/"+d+"/package.json");console.log(d,m.version,m.license)}'
```
