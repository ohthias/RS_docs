# Contribuir

O RoboStage é um projeto independente e aberto, construído com a comunidade de robótica. Você não precisa ser desenvolvedor para ajudar: relatos de bugs, ideias, testes e textos de documentação também contam.

O guia completo está no [CONTRIBUTING.md](https://github.com/ohthias/roboStage/blob/main/.github/CONTRIBUTING.md). Antes de participar, leia o [Código de Conduta](https://github.com/ohthias/roboStage/blob/main/.github/CODE-OF-CONDUCT.md).

## Formas de contribuir

| Como | Onde |
| --- | --- |
| Reportar um bug | [Abrir uma issue](https://github.com/ohthias/roboStage/issues/new/choose) dizendo o que aconteceu, o que deveria acontecer e como reproduzir. |
| Sugerir uma funcionalidade | Também por issue: descreva o problema da equipe antes da solução. |
| Corrigir ou criar código | Fork, branch, pull request (abaixo). |
| Melhorar esta documentação | Botão **Editar no GitHub** no topo de cada página. |
| Reportar uma vulnerabilidade | Siga a [política de segurança](https://github.com/ohthias/roboStage/blob/main/.github/SECURITY.md). **Não** abra uma issue pública. |

## Fluxo de desenvolvimento

1. Faça um fork e clone o repositório. Configure o ambiente seguindo [Instalação e configuração](comecar/instalacao.md).
2. Crie uma branch curta e focada:

   ```bash
   git checkout -b feat/labtest-filtros
   ```

3. Faça a mudança e rode a build e os testes:

   ```bash
   npm run build
   npm test
   ```

4. Envie a branch e abra um pull request explicando **o que** mudou, **por que** mudou, **como** foi implementado e **como** foi testado. Ligue a issue relacionada, se houver.

### Nomes de branch

```text
feat/labtest-filtros
fix/dashboard-loading
docs/contributing
refactor/team-dashboard
style/fll-hero
chore/update-dependencies
```

### Mensagens de commit

Use `tipo: descrição` e um commit por alteração lógica:

| Tipo | Uso |
| --- | --- |
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Documentação |
| `style` | Interface, sem mudar comportamento |
| `refactor` | Refatoração |
| `test` | Testes |
| `chore` | Manutenção |
| `perf` | Desempenho |
| `security` | Correções de segurança |

```bash
git commit -m "feat: adiciona filtro ao LabTest"
```

## Checklist antes do pull request

- [ ] `npm run build` passa.
- [ ] `npm test` passa e cobre a regra nova, se ela for de dados, escopo ou permissão.
- [ ] Mudanças de interface testadas em desktop, tablet e celular, incluindo estados de carregamento, vazio e erro.
- [ ] Mudanças de banco incluem o schema **e** a migração (veja [Banco de dados](banco-de-dados.md)).
- [ ] Nenhum `.env`, chave ou dado real de usuário no commit.
- [ ] Documentação atualizada quando o comportamento mudou.

## Contribuir com esta documentação

As páginas são arquivos Markdown em `content/docs/`. A ordem da barra lateral fica em `lib/site.ts`.

- Use um único `#` por página (o título). As seções começam em `##` e entram automaticamente em "Nesta página".
- Links entre páginas podem apontar para o arquivo `.md` (por exemplo, `[APIs](referencia/apis.md)`): eles são convertidos na URL certa no build.
- Para destacar um aviso, use os callouts do GitHub:

  ```md
  > [!TIP]
  > Rode `npm test` antes de abrir o PR.
  ```

  Os tipos disponíveis são `NOTE`, `TIP`, `IMPORTANT`, `WARNING` e `CAUTION`.
- Escreva a partir do código: cite o arquivo e linke para o GitHub quando ajudar quem lê.

Para rodar a documentação localmente:

```bash
npm install
npm run dev          # http://localhost:3000
npm run check:links  # confere links internos e âncoras
```
