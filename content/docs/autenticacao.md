# Autenticação e permissões

A identidade é gerenciada pelo **Clerk**. A autorização acontece em três pontos:

1. O **middleware** decide quem pode entrar em cada rota.
2. O **escopo** decide de quem é cada dado (pessoal ou de equipe).
3. Os **cargos de equipe** decidem o que cada pessoa pode fazer dentro de uma equipe.

## Middleware

Arquivo: [`proxy.ts`](https://github.com/ohthias/roboStage/blob/main/proxy.ts)

Toda requisição passa pelo `clerkMiddleware`, exceto arquivos estáticos e `_next`.

| Situação | Resposta |
| --- | --- |
| Rota pública | Segue normalmente. |
| Sem sessão, navegação (`GET`/`HEAD`) | Redireciona para `/sign-in?redirect_url=<rota original>`. |
| Sem sessão, em `/api/*` ou método diferente de `GET` | `401` com `{ "error": "Não autenticado" }`. |
| Sessão com `onboardingComplete === false` | Redireciona para `/onboarding`. |

> [!NOTE]
> Por que `401` em vez de redirecionar? Um redirecionamento `307` preserva o método. Um `POST` de Server Action seria reenviado para `/sign-in`, que é uma página, e o resultado seria `405`. O JSON `401` deixa o cliente tratar o erro.

O bloqueio de onboarding só acontece quando a flag existe **e** é `false`. Se o claim não vier no token, a requisição segue, para evitar um loop de redirecionamento.

### Rotas públicas

Entre outras: `/`, `/about`, `/fll`, `/obr`, `/news`, `/help`, `/legal`, `/labtest`, `/stagebook`, `/anatix`, `/showlive`, `/sign-in`, `/sign-up`, `/onboarding` e as APIs `/api/data/missions`, `/api/data/fllDocs`, `/api/data/obrDocs`, `/api/data/toolsAbout`, `/api/webhooks` e `/api/revalidate`. A lista completa está em `publicRoutePatterns`, dentro de `proxy.ts`.

> [!WARNING]
> Ao criar uma rota pública nova, adicione-a em `publicRoutePatterns`. Caso contrário, visitantes sem login serão enviados para o `/sign-in`.

## Sincronização com o banco

O Clerk é a fonte da identidade, mas o banco precisa de uma linha em `users` para as chaves estrangeiras. O `id` é o **mesmo** id do Clerk (`user_xxx`), sem tabela de mapeamento.

O webhook `POST /api/webhooks/clerk`, tratado por [`db/clerk-sync.ts`](https://github.com/ohthias/roboStage/blob/main/db/clerk-sync.ts), mantém o banco em dia:

| Evento | Efeito |
| --- | --- |
| `user.created`, `user.updated` | Cria ou atualiza a linha em `users`. |
| `user.deleted` | Remove o usuário. |
| `organization.updated`, `organization.deleted` | Atualiza ou remove a equipe (`teams.clerk_org_id`). |
| `organizationMembership.created/updated/deleted` | Mantém `team_members` e o cargo de cada pessoa. |

A assinatura é verificada com Svix e `CLERK_WEBHOOK_SECRET`.

Se o webhook ainda não tiver rodado (comum em desenvolvimento local), `requireAuthenticatedUser()` cria o usuário no banco na primeira ação autenticada. Isso evita erros de chave estrangeira.

## Escopos

Arquivo: [`utils/stagebook/scope.ts`](https://github.com/ohthias/roboStage/blob/main/utils/stagebook/scope.ts)

Os recursos do Stagebook nunca pertencem a um `userId` solto. Eles pertencem a um **escopo**:

```ts
type StagebookScope =
  | { type: "personal"; userId: string }
  | { type: "team"; teamId: string; userId: string; role: TeamRole };
```

| Função | Uso |
| --- | --- |
| `requireAuthenticatedUser()` | Exige sessão e garante que o usuário existe no banco. Retorna o `userId`. |
| `resolveStagebookScope()` | Lê a equipe ativa do cookie `stagebook_team_id`. Sem cookie, ou sem vínculo com a equipe, retorna o escopo pessoal. |
| `requireStagebookAccess(teamId)` | Resolve um `teamId` explícito e **lança erro** se a pessoa não for membro. |
| `requireTeamAccess(teamId)` | Igual ao anterior, mas exige um escopo de equipe e valida o UUID. |
| `scopeOwnership(scope)` | Retorna o par `{ userId, teamId }` para gravar em `INSERT`s. |

No banco, cada tabela com dono tem um `CHECK` que exige que **exatamente um** entre `user_id` e `team_id` esteja preenchido.

> [!IMPORTANT]
> Ao ligar dois recursos (por exemplo, um cartão do Kanban a uma página), use `assertSameScope(a, b)`. Recursos de escopos diferentes nunca podem ser relacionados.

## Cargos de equipe

Arquivo: [`utils/stagebook/team-permissions.ts`](https://github.com/ohthias/roboStage/blob/main/utils/stagebook/team-permissions.ts)

| Cargo | Valor | Descrição |
| --- | --- | --- |
| Técnico | `owner` | Administra a equipe, os membros e os marcos. Único que exclui a equipe. |
| Mentor | `mentor` | Administra a equipe, os membros e os marcos. |
| Competidor | `competidor` | Acesso a todos os recursos da equipe. |
| Colaborador | `colaborador` | Acesso a todos os recursos da equipe. |

### Matriz de capacidades

| Capacidade | Técnico | Mentor | Competidor | Colaborador |
| --- | :---: | :---: | :---: | :---: |
| `tool.create`: criar e editar Kanbans, ThinkLabs e LabTests | ✓ | ✓ | ✓ | ✓ |
| `tool.delete.any`: excluir recursos criados por outras pessoas | ✓ | ✓ | | |
| `milestone.manage`: criar, editar e excluir marcos | ✓ | ✓ | | |
| `team.edit`: nome, foto e dados da equipe | ✓ | ✓ | | |
| `team.members.manage`: convidar, remover e trocar cargos | ✓ | ✓ | | |
| `team.delete`: excluir a equipe | ✓ | | | |

Regras adicionais:

- Só um Técnico concede ou retira o cargo de Técnico, e a equipe sempre mantém pelo menos um.
- Membros excluem apenas o que eles mesmos criaram.
- No **espaço pessoal**, o dono pode tudo.

Nas Server Actions, a barreira é aplicada com `requireCapability(scope, capacidade)`, em `utils/stagebook/permissions.ts`. Se a capacidade for negada, o erro traz uma mensagem pronta para a interface, como "Só técnicos e mentores podem criar e editar os marcos da equipe.".

A interface usa `roleCan(role, capacidade)` apenas para esconder ou desabilitar botões. Quem garante a regra é o servidor.

### Mapeamento a partir do Clerk

| Clerk | RoboStage |
| --- | --- |
| `org:admin` | `owner` (Técnico) |
| `publicMetadata.stagebookRole` (`tecnico`, `mentor`, `competidor`, `colaborador`) | O cargo escolhido no convite, que tem prioridade. |
| `org:member` sem metadata | `colaborador` |

## Na API

As rotas protegidas usam a sessão do Clerk enviada pelo cookie. Nunca envie `userId` no corpo para escolher outro usuário: o servidor sempre usa o usuário autenticado. Veja [APIs](referencia/apis.md).
