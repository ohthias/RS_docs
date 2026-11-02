# Tipagem

O RoboStage é escrito inteiramente em **TypeScript** com `strict` ligado. Os tipos vêm de três lugares:

- do **schema do banco**, inferidos pelo Drizzle;
- da pasta **`types/`**, com formatos compartilhados pela interface;
- dos próprios **módulos de domínio** em `utils/`, ao lado da regra que usam.

Esta página explica onde fica cada tipo e quais padrões o projeto segue.

## Configuração

Trecho relevante do [`tsconfig.json`](https://github.com/ohthias/roboStage/blob/main/tsconfig.json):

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "strict": true,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "allowJs": true,
    "paths": { "@/*": ["./*"] }
  }
}
```

| Opção | Efeito no projeto |
| --- | --- |
| `strict` | Ativa `strictNullChecks`, `noImplicitAny` e as demais checagens estritas. Valores possivelmente nulos precisam ser tratados. |
| `noEmit` | O TypeScript só **verifica**. Quem compila é o Next.js (Turbopack). |
| `resolveJsonModule` | Permite `import missions from "@/public/data/missions.json"` com tipo inferido. |
| `paths` (`@/*`) | Importações absolutas a partir da raiz: `@/db/schema`, `@/utils/stagebook/scope`. |
| `allowJs` | Aceita os scripts `.mjs` de `scripts/`. |

A checagem de tipos roda no `npm run build`. Um erro de tipo **quebra a build**.

## Tipos do banco (Drizzle)

As tabelas definidas em `db/schema/` já carregam os tipos das linhas. Cada arquivo exporta pares de tipos inferidos:

```ts
// db/schema/users.ts
export type UserRow = typeof users.$inferSelect;    // o que vem de um SELECT
export type NewUserRow = typeof users.$inferInsert; // o que um INSERT aceita
```

| Tipo | Uso |
| --- | --- |
| `XRow` (`$inferSelect`) | Resultado de consultas. As colunas `notNull()` são obrigatórias; as outras, `T \| null`. |
| `NewXRow` (`$inferInsert`) | Entrada de `db.insert()`. Colunas com `default` ficam opcionais. |

Exemplos no código: `UserRow`, `LeagueRow`, `UserLeagueInterestRow`, `MilestoneRow`.

### Colunas `jsonb` e textos com valores conhecidos

Por padrão, uma coluna `jsonb` é `unknown`. O projeto declara o formato com `$type<…>()`:

```ts
// db/schema/notifications.ts
data: jsonb("data").$type<Record<string, unknown>>(),

// db/schema/quickbrick.ts — texto no banco, união de literais no TypeScript
kind: text("kind").$type<DiagramKind>().notNull(),
```

> [!WARNING]
> `$type<T>()` só muda o **tipo**. O banco não valida o conteúdo. Dados `jsonb` vindos do cliente precisam passar por uma função de validação ou sanitização antes de gravar, como `sanitizeProject()` no ArenaBuilder.

### Enums do Postgres

Os enums de `db/schema/enums.ts` (`personaTypeEnum`, `leagueRelationEnum`, `teamRoleEnum`) e `testModeEnum` viram uniões de strings nos tipos inferidos. Por isso, `UserRow["personaType"]` é `"competidor" | "mentor_tecnico" | "entusiasta" | "organizador" | null`.

## A pasta `types/`

[`types/`](https://github.com/ohthias/roboStage/tree/main/types) reúne os formatos usados por componentes e páginas que **não** são linhas do banco: estados de editores, DTOs e configurações de ferramentas.

| Arquivo | Conteúdo |
| --- | --- |
| `labtest.types.ts` | `FieldType` (`number`, `boolean`, `text`, `select`, `duration`), `ModeId`, `FieldDefinition`, `TestEntry`, `TestRecord`. |
| `labels.ts` | `LabelableKind`, `TagDTO`, `MilestoneDTO`, `ResourceLabels` e a lista `LABELABLE_KINDS`. |
| `team-workspace.ts` | Resumos da página da equipe: `TeamBoardSummary`, `TeamLabTestSummary`, `TeamMemberSummary`… |
| `preferences.ts` | `UserPreferences` e `DEFAULT_PREFERENCES`. |
| `thinklab.types.ts`, `CanvasType.ts` | Elementos, estilos e estado do quadro do ThinkLab. |
| `anatix.types.ts` | Frames, métricas e sessões da telemetria. |
| `EmpathyMap.types.ts`, `FlashQATypes.ts`, `TimersType.ts`, `SharksSimulator.types.ts`, `MatrizRisco.ts`, `heatmap.ts`, `TableAnalytics.ts` | Estado de cada ferramenta. |
| `folders.ts`, `navigation.ts` | Pastas e itens de menu. |
| `web-serial.d.ts` | Declarações da **Web Serial API**, que o `lib.dom` do TypeScript ainda não traz. |

> [!TIP]
> Tipos usados por **um único módulo** ficam no próprio módulo (ex.: `utils/competitions/obr/types.ts`, `utils/quickbrick/ArenaBuilder/types.ts`). Mova um tipo para `types/` quando dois domínios diferentes passarem a usá-lo.

## Padrões usados no projeto

### Uniões discriminadas

O escopo do Stagebook é o exemplo central. O campo `type` decide quais outros campos existem:

```ts
// utils/stagebook/scope.ts
export type StagebookScope =
  | { type: "personal"; userId: string }
  | { type: "team"; teamId: string; userId: string; role: TeamRole };

export type TeamScope = Extract<StagebookScope, { type: "team" }>;
```

Depois de `if (scope.type === "team")`, o TypeScript sabe que `scope.teamId` e `scope.role` existem.

O resultado das Server Actions segue o mesmo padrão:

```ts
// utils/stagebook/action-result.ts
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };
```

### Catálogos com `as const` e `keyof typeof`

Listas fixas são escritas uma vez como valor, e o tipo é derivado delas. Assim o tipo nunca diverge do dado:

```ts
// utils/competitions/routes.ts
export const FLL_SCORE_SEASONS = ["bioglow", "unearthed", "submerged", "masterpiece"] as const;

// utils/competitions/competicoes.ts → routes.ts
export type Competicao = keyof typeof COMPETICOES; // "fll" | "obr"
```

### `satisfies`

Confere a forma de um objeto **sem perder** os tipos literais inferidos:

```ts
// utils/competitions/navigation.ts
menus: [ /* ... */ ] satisfies NavMenuGroup[],
```

### Type guards

Valores que chegam de fora (cookie, banco, formulário) são estreitados com funções `value is T`:

```ts
// utils/stagebook/team-permissions.ts
export function isTeamRole(value: unknown): value is TeamRole {
  return typeof value === "string" && (TEAM_ROLES as readonly string[]).includes(value);
}
```

Outros exemplos: `isPersonaType()`, `isConfereAICompetition()` e `isCompeticao()`. Quando o valor é desconhecido, o padrão é **falhar fechado**: um cargo inválido vira `colaborador`, sem privilégios.

### `Record` com chave tipada

Matrizes e tabelas de configuração usam `Record<UniãoDeChaves, Valor>`. Se alguém adicionar um cargo novo a `TeamRole`, o compilador aponta todos os `Record<TeamRole, …>` incompletos.

```ts
const MATRIX: Record<TeamCapability, readonly TeamRole[]> = { /* ... */ };
```

## Entrada não confiável

O TypeScript não existe em tempo de execução. Tudo que vem do navegador (argumentos de Server Actions, corpo de requisições, `params`, cookies) deve ser tratado como `unknown` até ser validado.

O projeto **não usa** uma biblioteca de schema como zod. Ele usa funções pequenas em [`utils/stagebook/validation.ts`](https://github.com/ohthias/roboStage/blob/main/utils/stagebook/validation.ts), que recebem `unknown` e devolvem o tipo certo ou lançam `ValidationError` com uma mensagem em português:

| Função | Devolve |
| --- | --- |
| `requireText(value, label, { minLength, maxLength })` | `string` limpa (espaços normalizados). |
| `optionalText(value, maxLength)` | `string \| null` |
| `requireOneOf(value, opções, label)` | Um dos literais permitidos. |
| `requireEmail(value)` | `string` |
| `requireUuid(value, label)` / `optionalUuid` | UUID validado. |
| `requireDate(value, label)` / `optionalDate` | `Date` |

Exemplo ilustrativo (as actions reais, como as de `dashboard/quickbrick/actions.ts`, seguem este formato):

```ts
export async function renameBoard(id: unknown, name: unknown) {
  return runAction(async () => {
    const boardId = requireUuid(id, "quadro");
    const title = requireText(name, "o nome do quadro", { maxLength: 80 });
    // ... escopo, permissão e gravação
  });
}
```

`runAction()` converte `ValidationError` e `StagebookAuthError` em `{ ok: false, error }`. A mensagem chega ao usuário porque, em produção, o Next.js esconde a mensagem de erros lançados por Server Actions.

## Tipos de componentes e páginas

- **Props de página** recebem `params` e `searchParams` como `Promise` (veja [Arquitetura das rotas](rotas.md#segmentos-dinâmicos)).
- **Componentes cliente** declaram as props com um `type` ou `interface` local. Os dois estilos aparecem no código: funções com props tipadas e `React.FC<Props>`.
- **Ícones** em catálogos usam o tipo `LucideIcon` de `lucide-react`.
- **Server Components assíncronos** podem ser `async function` e retornar JSX diretamente.

## Boas práticas

- Derive tipos de valores (`as const`, `typeof`, `$inferSelect`) em vez de reescrevê-los à mão.
- Evite `any`. Para dados externos, use `unknown` e uma função de validação.
- Prefira uniões de literais (`"runs" | "custom"`) a `string` quando o conjunto é fechado.
- Não use `as` para "convencer" o compilador sobre dados vindos de fora. Valide.
- Ao adicionar uma coluna, atualize o schema primeiro: os tipos `Row` acompanham sozinhos.
