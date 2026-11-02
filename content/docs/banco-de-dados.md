# Banco de dados

O RoboStage usa **PostgreSQL** (hospedado no Neon) com **Drizzle ORM**. O schema é escrito em TypeScript e é a fonte de verdade. As migrações SQL são geradas a partir dele.

## Conexão

Arquivo: [`db/client.ts`](https://github.com/ohthias/roboStage/blob/main/db/client.ts)

```ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
```

Passar o `schema` habilita a API relacional:

```ts
const board = await db.query.boards.findFirst({
  where: eq(boards.id, boardId),
  with: { columns: true },
});
```

As relações ficam declaradas em `db/schema/relations.ts`.

## Princípios de modelagem

**Ids de usuário vêm do Clerk.** `users.id` é o texto `user_xxx` gerado pelo Clerk. Toda tabela referencia esse id diretamente, sem tabela de mapeamento. O webhook do Clerk mantém `users` em dia (veja [Autenticação](autenticacao.md)).

**Dono é escopo, autoria é outra coisa.** Recursos do Stagebook têm `user_id` **ou** `team_id`, e um `CHECK` exige exatamente um dos dois. Já `created_by` e `updated_by` registram apenas quem criou ou editou, nunca quem é o dono.

**Texto livre onde o domínio cresce.** Tipos de evento do calendário (`treino`, `reuniao`, `competicao`…) são `text`, e não um enum do banco. Assim, um tipo novo não exige migração. A aplicação valida os valores conhecidos.

**Catálogos são linhas, não colunas.** Novas ligas (FLL, OBR, FTC, WRO…) entram como linhas em `leagues`, sem alterar o schema.

**Vínculos em tabelas próprias.** Etiquetas, responsáveis e documentos ligados usam tabelas de relação (`board_card_tags`, `board_card_assignees`, `calendar_event_documents`…), o que garante exclusão em cascata pelo próprio banco.

## Tabelas por domínio

### Identidade e equipes

| Tabela | Arquivo | Descrição |
| --- | --- | --- |
| `users` | `users.ts` | Espelho do usuário do Clerk: e-mail, nome, avatar, `persona_type` e `onboarding_completed_at`. |
| `user_preferences` | `user-preferences.ts` | Uma linha por usuário: layout, barra lateral, aceitar convites. Sem linha, valem os padrões. |
| `teams` | `teams.ts` | Equipe, ligada a uma organização do Clerk (`clerk_org_id`), liga e temporada. |
| `team_members` | `teams.ts` | Pessoa ↔ equipe, com cargo (`team_role`). Par único por equipe. |
| `leagues` | `leagues.ts` | Catálogo de ligas e competições. |
| `user_league_interests` | `leagues.ts` | Ligas de cada usuário, como `participante` ou `interessado`. |
| `notifications` | `notifications.ts` | Notificações individuais. `data` (jsonb) aponta para o recurso de origem. |

### Stagebook (documentos e organização)

| Tabela | Descrição |
| --- | --- |
| `folders` | Pastas com cor e hierarquia. |
| `documents` | As "Pages" do Stagebook. O nome da tabela foi mantido por compatibilidade. |
| `tags` | Catálogo de etiquetas **por escopo**: renomear ou recolorir não afeta outros espaços. |
| `document_tags`, `board_card_tags`, `calendar_event_tags`, `thinklab_tags`, `test_tags` | Etiquetas aplicadas a cada ferramenta. |
| `milestones` | Marcos universais do escopo, usados por cartões, páginas, eventos, ThinkLab e LabTest. |

### Kanban e calendário

| Tabela | Descrição |
| --- | --- |
| `boards` | Quadro Kanban de um escopo. |
| `board_columns` | Colunas personalizáveis, com regras. |
| `board_cards` | Cartões. |
| `board_card_assignees` | Vários responsáveis por cartão. |
| `board_card_documents` | Cartão ↔ página. |
| `board_card_events` | Cartão ↔ evento do calendário. |
| `calendar_events` | Treinos, reuniões, competições e prazos. |
| `calendar_event_documents` | Evento ↔ páginas. |

### LabTest e Anatix

| Tabela | Descrição |
| --- | --- |
| `tests` | Um teste configurado. `mode` usa o enum `test_mode`: `runs`, `calibrabot`, `individual` ou `custom`. |
| `test_executions` | Cada execução (lançamento) de um teste. O número da execução é único por teste. |
| `anatix_labs` | Laboratório de telemetria, até 3 por espaço. |
| `anatix_sessions` | Cada conexão serial aberta em um laboratório. |
| `anatix_frames` | Frames recebidos do robô, gravados em lotes (`jsonb`). |

### QuickBrick Studio e ThinkLab

| Tabela | Descrição |
| --- | --- |
| `quickbrick_notebooks` | Caderno do robô (um robô ou projeto). |
| `quickbrick_photos` | Versões do robô: foto no R2, data e notas. |
| `quickbrick_diagrams` | Diagramas das ferramentas de estratégia (`jsonb`). |
| `quickbrick_notebook_tags` | Etiquetas dos cadernos. |
| `thinklab` | Quadros do ThinkLab. |

> [!NOTE]
> Arquivos do QuickBrick ficam no Cloudflare R2. O banco guarda apenas a **chave** do objeto.

## Enums

| Enum | Valores |
| --- | --- |
| `persona_type` | `competidor`, `mentor_tecnico`, `entusiasta`, `organizador` |
| `league_relation_type` | `participante`, `interessado` |
| `team_role` | `owner`, `mentor`, `competidor`, `colaborador` |
| `test_mode` | `runs`, `calibrabot`, `individual`, `custom` |

## Migrações

As migrações geradas ficam em [`drizzle/`](https://github.com/ohthias/roboStage/tree/main/drizzle), e o histórico, em `drizzle/meta/_journal.json`.

### Alterando o schema

1. Edite o arquivo do domínio em `db/schema/`. Se for um arquivo novo, reexporte-o em `db/schema/index.ts`.
2. Gere a migração e revise o SQL produzido:

   ```bash
   npm run db:generate
   ```

3. Aplique em um banco de desenvolvimento:

   ```bash
   npm run db:migrate
   ```

4. Rode os testes, que usam o schema real:

   ```bash
   npm test
   ```

5. Inclua o schema **e** a migração no mesmo pull request.

> [!WARNING]
> `npm run db:push` aplica o schema direto, sem gerar migração. Use apenas em bancos descartáveis. Avalie sempre o impacto sobre dados existentes e nunca rode alterações destrutivas em produção sem autorização.

> [!IMPORTANT]
> O Drizzle Kit lê apenas `db/schema/index.ts`. Hoje `db/schema/quickbrick.ts` é importado diretamente pelo código (`@/db/schema/quickbrick`) e **não** está reexportado no `index.ts`, então mudanças nele não entram no `db:generate`. Ou reexporte o arquivo, ou mantenha a migração manual correspondente.

### Scripts manuais

`drizzle/manual/` guarda SQL equivalente a algumas migrações (`anatix_labs.sql`, `quickbrick_studio.sql`, `user_preferences.sql`, `test_execution_number_unique.sql`), com `CREATE ... IF NOT EXISTS`. Eles servem para bancos que precisam ser ajustados à mão. Em geral, prefira `db:generate` + `db:migrate`, que mantêm o journal em dia.

## Testes com banco real

`tests/setup.ts` substitui `@/db/client` por um **PGlite**, um Postgres em memória com o schema do projeto. Cada arquivo de teste recebe uma instância nova, então dá para testar `CHECK`s, chaves estrangeiras e cascatas de verdade, sem banco externo.

## Boas práticas

- Nunca inclua dumps ou dados reais de usuários no repositório.
- Filtre sempre pelo escopo resolvido no servidor, nunca por um `userId` vindo do cliente.
- Prefira tabelas de relação a arrays de ids: o banco garante a integridade.
