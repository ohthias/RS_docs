# Contribuindo com o RoboStage Docs

Obrigado por ajudar a documentação do RoboStage! Este repositório contém o código e o conteúdo do [docs.robostage.com.br](https://docs.robostage.com.br).

> **Antes de contribuir:** leia o [Código de Conduta](./CODE-OF-CONDUCT.md).

Este guia trata **da documentação**. Para mudanças na plataforma (código, banco, interface), siga o [guia de contribuição do roboStage](https://github.com/ohthias/roboStage/blob/main/.github/CONTRIBUTING.md).

## Índice

- [Formas de contribuir](#formas-de-contribuir)
- [Configurando o ambiente](#configurando-o-ambiente)
- [Onde fica cada coisa](#onde-fica-cada-coisa)
- [Escrevendo uma página](#escrevendo-uma-página)
- [Guia de estilo](#guia-de-estilo)
- [Fluxo de contribuição](#fluxo-de-contribuição)
- [Checklist do pull request](#checklist-do-pull-request)
- [Mudanças no site](#mudanças-no-site)

## Formas de contribuir

- **Corrigir** um erro, um link quebrado ou uma informação desatualizada.
- **Completar** uma página com exemplos, tabelas ou explicações que faltam.
- **Escrever** uma página nova sobre um módulo, fluxo ou integração.
- **Revisar** textos: clareza, ortografia, consistência de termos.
- **Reportar** problemas abrindo uma issue neste repositório. Há modelos para erros e para pedidos de página.

Para correções pequenas, use o botão **Editar no GitHub** no topo de cada página do site. O GitHub abre o arquivo certo e cria o pull request para você.

## Configurando o ambiente

Pré-requisitos: Node.js (LTS recente), npm e Git.

```bash
git clone <url-deste-repositório>
cd robostage-docs
npm install
npm run dev
```

O site abre em `http://localhost:3000` e recarrega a cada mudança nos arquivos `.md`.

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento. |
| `npm run build` | Gera o site estático em `out/`. |
| `npm run check:links` | Depois do build: confere todos os links internos e âncoras. |
| `npm start` | Serve a pasta `out/` localmente. |

## Onde fica cada coisa

| Caminho | Conteúdo |
| --- | --- |
| `content/docs/` | **As páginas**, em Markdown. É aqui que a maior parte das contribuições acontece. |
| `lib/site.ts` | Ordem da barra lateral, títulos, descrições e links do cabeçalho. |
| `lib/markdown.ts` | Conversão do Markdown: âncoras, realce de código, callouts e links. |
| `components/` | Interface: cabeçalho, barra lateral, busca, índice da página. |
| `app/globals.css` | Tema visual (mesmos tokens do robostage.com.br). |
| `scripts/check-links.mjs` | Verificador de links. |

## Escrevendo uma página

### Página nova

1. Crie o arquivo em `content/docs/`. O caminho vira a URL: `content/docs/referencia/webhooks.md` é publicado em `/referencia/webhooks/`.
2. Adicione a página em `nav`, no arquivo `lib/site.ts`, com `slug`, `title` e `description`.
3. Rode `npm run build && npm run check:links`.

### Estrutura

```md
# Título da página

Um parágrafo dizendo o que a página cobre e para quem ela serve.

## Primeira seção

Texto, tabelas, exemplos…

### Subseção
```

- **Um único `#`** por página: é o título.
- `##` e `###` aparecem em "Nesta página" e na busca. Não pule níveis.
- Evite `####` ou níveis mais fundos. Se precisar, a página provavelmente deveria ser dividida.

### Links

- Entre páginas, aponte para o arquivo: `[Banco de dados](banco-de-dados.md)` ou `[APIs](referencia/apis.md#webhook-do-clerk)`. O build converte para a URL certa.
- Para o código do roboStage, use links permanentes do GitHub: `https://github.com/ohthias/roboStage/blob/main/<caminho>`.
- As âncoras são o título em minúsculas, sem acentos e com hífens. "## 2. Hooks de dados" vira `#2-hooks-de-dados`.

### Callouts

```md
> [!NOTE]
> Informação complementar.

> [!TIP]
> Um atalho ou boa prática.

> [!IMPORTANT]
> Algo que a pessoa precisa saber para não errar.

> [!WARNING]
> Risco de quebrar algo ou perder dados.

> [!CAUTION]
> Risco de segurança ou ação irreversível.
```

Use callouts com moderação: no máximo dois ou três por página.

### Código

Sempre indique a linguagem no bloco (`ts`, `tsx`, `bash`, `sql`, `json`, `text`). Isso ativa o realce de sintaxe e o botão de copiar.

````md
```ts
const scope = await resolveStagebookScope();
```
````

## Guia de estilo

**Escreva a partir do código.** Toda afirmação técnica precisa corresponder ao que está no repositório. Cite o arquivo (`utils/stagebook/scope.ts`) e, quando ajudar, linke para ele. Se não tiver certeza, pergunte na issue ou no pull request, sem supor.

**Português do Brasil, direto.** Frases curtas, voz ativa, segunda pessoa quando for instrução ("rode", "crie", "confira").

**Termos consistentes.**

| Use | Evite |
| --- | --- |
| equipe | time, squad |
| escopo pessoal / escopo de equipe | workspace, espaço do usuário |
| Server Action | action do servidor |
| Técnico, Mentor, Competidor, Colaborador | owner, admin (fora de código) |
| migração | migration (fora de nomes de comando) |

Nomes de ferramentas mantêm a grafia oficial: **Stagebook**, **QuickBrick Studio**, **LabTest**, **Anatix**, **ThinkLab**, **ShowLive**, **NECTA**.

**Código, caminhos e valores** vão em `código`: `npm run db:migrate`, `db/schema/`, `team_role`.

**Tabelas para comparar, listas para enumerar, prosa para explicar.**

**Nunca inclua** chaves, tokens, URLs de banco reais, e-mails pessoais ou dados de usuários, nem em exemplos. Use valores falsos e óbvios, como `sk_test_...` e `postgresql://usuario:senha@host/banco`.

**Marcas de terceiros** ("FIRST®", "LEGO®") seguem a grafia oficial.

## Fluxo de contribuição

1. Faça um fork e crie uma branch curta:

   ```bash
   git checkout -b docs/banco-de-dados-enums
   ```

   Prefixos: `docs/` para conteúdo, `feat/` para recursos do site, `fix/` para correções, `style/` para visual e `chore/` para manutenção.

2. Faça commits com mensagens no padrão `tipo: descrição`:

   ```bash
   git commit -m "docs: documenta os enums do banco"
   ```

3. Rode o build e o verificador de links:

   ```bash
   npm run build && npm run check:links
   ```

4. Abra o pull request. O template pede o que mudou, por que mudou e como você verificou.

A integração contínua roda o build e o verificador de links em todo pull request. Ele só pode ser aceito com os dois passando.

## Checklist do pull request

- [ ] `npm run build` passa.
- [ ] `npm run check:links` passa.
- [ ] As informações batem com o código atual do roboStage.
- [ ] Páginas novas foram adicionadas em `lib/site.ts`.
- [ ] Exemplos de código foram testados ou copiados do repositório.
- [ ] Não há credenciais, dados pessoais ou URLs privadas.
- [ ] Mudanças visuais foram conferidas no desktop e no celular, nos temas claro e escuro.

## Mudanças no site

Mudanças na interface (componentes, tema, busca) seguem o mesmo fluxo e devem:

- manter o visual alinhado ao robostage.com.br (tokens em `app/globals.css`);
- continuar gerando um site 100% estático (`output: "export"`);
- funcionar sem JavaScript para ler o conteúdo; busca e tema podem depender de JS;
- respeitar acessibilidade: contraste, foco visível, navegação por teclado e `prefers-reduced-motion`.

Para mudanças grandes, abra uma issue antes para discutir a ideia.

## Licença

Ao contribuir, você concorda que sua contribuição será licenciada sob a [Licença MIT](../LICENSE) deste repositório.
