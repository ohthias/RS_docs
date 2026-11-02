# Competições

O RoboStage atende hoje duas competições com páginas próprias, a **FIRST® LEGO® League** e a **OBR**, além da **FLL Future Edition** como edição dentro da FLL. Cada competição tem uma área pública em `/<competicao>` e libera recursos diferentes no Dashboard.

| Competição | Rota | Situação |
| --- | --- | --- |
| FIRST® LEGO® League Challenge | `/fll` | Disponível |
| FLL Future Edition | `/fll/future-edition` | Disponível |
| OBR — Olimpíada Brasileira de Robótica | `/obr` | Disponível |
| FIRST® Tech Challenge | — | Em breve |

## Visão geral

| Recurso | FLL | Future Edition | OBR |
| --- | :---: | :---: | :---: |
| Pontuador | 4 temporadas | Partidas cronometradas | OBR Resgate |
| Cronômetros | Round, Sala de avaliação, Ajustável | Os da FLL | Round de competição, Ajustável |
| Recall (perguntas e flashcards) | ✓ | Os da FLL | ✓ |
| Checklist "Confia, mas confira!" | ✓ | Os da FLL | ✓ |
| Documentos da temporada | ✓ | Os da FLL | ✓ |
| Rubricas de avaliação | ✓ | ✓ | — |
| Guias para iniciantes | Challenge e Explore | — | Bastidores |
| QuickBrick Studio | 7 ferramentas | — | 4 ferramentas |
| LabTest: runs | Round 2:30 e run completa | Partida por eventos | Rodada de resgate |
| LabTest: CalibraBot | Motores, giroscópio, PID | Presets do kit CS & AI | Presets OBR Resgate |
| Anatix (telemetria) | Em breve | Em breve | ✓ |
| Caderno do robô | ✓ | Em breve | Em breve |

O que cada liga libera **no Dashboard** é definido em [`utils/stagebook/league-features.ts`](https://github.com/ohthias/roboStage/blob/main/utils/stagebook/league-features.ts) (detalhes [abaixo](#recursos-por-liga-no-dashboard)).

## FIRST® LEGO® League Challenge

A competição com mais ferramentas no RoboStage. As equipes constroem e programam um robô LEGO® para cumprir as missões da temporada num tapete, desenvolvem um Projeto de Inovação e são avaliadas também pelos Core Values.

### Temporadas

| Temporada | Período | Pontuador | Ferramentas sazonais do QuickBrick | Documentos |
| --- | --- | :---: | :---: | :---: |
| BIOGLOW | 2026/2027 | ✓ | ✓ | ✓ |
| UNEARTHED | 2025/2026 | ✓ | ✓ | ✓ |
| SUBMERGED | 2024/2025 | ✓ | ✓ | |
| MASTERPIECE | 2023/2024 | ✓ | | |

As missões de cada temporada ficam em `public/data/missions.json`, servidas por `/api/data/missions/[season]`. As listas de temporadas ficam em `FLL_SCORE_SEASONS` e `FLL_QUICKBRICK_SEASONS` (`utils/competitions/routes.ts`) e em `NAVIGATION.fll.seasons`.

### Páginas

| Página | Rota | O que oferece |
| --- | --- | --- |
| Home | `/fll` | Apresentação da competição e atalhos (`FLLHome`). |
| Pontuador | `/fll/score/[season]` | Calcula a pontuação do Robot Game com as regras de cada temporada. |
| Documentações | `/fll/docs` | Livro de regras e materiais oficiais por temporada (`fllDocs.json`). |
| Guia de Missões | `/fll/docs/missions-guide` | Guia detalhado das missões da temporada. |
| Iniciantes da Challenge | `/fll/begins` | O que é o programa, como funciona a temporada, checklist inicial, vídeos e FAQ. |
| Iniciantes da Explore | `/fll/explore` | O mesmo, para a FLL Explore. |
| Rubrica | `/fll/rubric` | Avaliação interativa com pontuação, comentários e feedback. |
| Mapa de Empatia | `/fll/empathy-map` | Personas, notas adesivas e análise para o Projeto de Inovação. |
| Recall | `/fll/recall` | Perguntas de Core Values, Projeto de Inovação, Design do Robô e da temporada. |
| Partiu Mesa! | `/fll/partiu-mesa` | Monta uma sequência de missões, cronometra os lançamentos e analisa o desempenho. Gratuito e sem login. |
| Confia, mas confira! | `/fll/cheklist` | Checklists de treino, pré-campeonato e campeonato, com itens personalizados. |
| Timers | `/fll/timers` | **Round do Robô** (contagem oficial com alertas), **Sala de Avaliação** (entrada, apresentação, perguntas e feedback) e **Ajustável**. |

### QuickBrick Studio

| Ferramenta | Rota |
| --- | --- |
| Estratégias: desenho sobre o tapete | `/fll/quickbrick/estrategia` |
| Matriz SWOT das Missões | `/fll/quickbrick/matriz-swot/[season]` |
| Mapa de calor de missões | `/fll/quickbrick/heatmap` |
| Sharks Simulator: trajetórias com waypoints | `/fll/quickbrick/sharks-simulator` |
| Matriz de Risco | `/fll/quickbrick/matriz-de-risco` |
| Matriz SWOT do robô | `/fll/quickbrick/matriz-swot` |
| Tabela de análise de missões | `/fll/quickbrick/tabela-de-missoes/[season]` |

### No LabTest

- **Runs** em dois modos: **Round 2:30**, que segue as regras de tempo da mesa, e **Run completa**. As missões e a pontuação vêm da temporada escolhida.
- **CalibraBot**: motores, giroscópio e PID.
- **Testes personalizados**, com campos definidos pela equipe.

Código: `utils/labtest/fll.ts`, `utils/labtest/catalog.ts`, `components/labtest/FllRoundExecution.tsx`.

## FLL Future Edition

Edição da FLL para a temporada **BIOGLOW™ (2026/27)**, apoiada em três pilares:

- **Kit**: LEGO® Education Computer Science & AI.
- **Hardware sem fio**.
- **Partidas em alianças cooperativas**.

Funciona de forma parecida com a FRC e a FTC: **não usa missões fixas no tapete** como a Challenge.

| Página | Rota | O que oferece |
| --- | --- | --- |
| Apresentação | `/fll/future-edition` | O que é a Future Edition e como ela difere da Challenge. |
| Pontuador | `/fll/future-edition/score` | Pontuação da partida, com contadores, interruptores e penalidades. |
| Rubrica | `/fll/future-edition/rubric` | Rubricas de avaliação da edição. |

### No LabTest

- **Partidas cronometradas** registradas como uma lista de **eventos com carimbo de tempo** ("aos 42,3 s o objetivo X passou a valer 2"). O placar de qualquer instante é recalculado a partir dos eventos. Isso permite desfazer o último toque, ver a pontuação ao longo da partida e analisar cada fase. A duração padrão é de 150 s, configurável por teste.
- **CalibraBot** com presets do kit CS & AI (motor duplo, motor simples, sensor de cor, controle e Coding Canvas). Os campos são medições anotadas pela equipe.

As regras de pontuação são as mesmas do pontuador (`hooks/useScoreCalculator.ts`). Código: `utils/labtest/future-edition.ts`, `utils/labtest/kit-ia.ts`. Dados: `public/data/fll/future-edition.json`.

## OBR — Olimpíada Brasileira de Robótica

A OBR tem três modalidades: **Prática**, **Teórica** e **Artística**. O RoboStage foca na **Prática (Resgate)**: o robô segue uma linha por uma arena de ladrilhos com perigos e resgata vítimas numa sala. A modalidade **Artística** também tem uma ferramenta própria.

### Páginas

| Página | Rota | O que oferece |
| --- | --- | --- |
| Home | `/obr` | Modalidades, números da olimpíada e atalhos (`OBRHome`). |
| Pontuador | `/obr/score` | Pontuação da rodada de Resgate. |
| Documentações | `/obr/docs` | Documentos e materiais de apoio (`obrDocs.json`, "Nacional 2026"). |
| Bastidores | `/obr/bastidores` | Biblioteca de livros, vídeos, cursos e sites sobre lógica, programação, Arduino e OBR, com filtro por tema e idioma. |
| Recall | `/obr/recall` | Perguntas de Mecânica e Estrutura, Sensores, Programação, Desafios da Pista, Resgate e Estratégia. |
| Confia, mas confira! | `/obr/cheklist` | Checklists com configuração própria (`public/data/obr/confere-ai.json`). |
| Timers | `/obr/timers` | **Round de Competição** (2 min de calibração + 5 min de round, tirando 1 min a cada desistência de checkpoint) e **Ajustável**. |

### Pontuação do Resgate

As regras ficam em [`utils/competitions/obr/scoring.ts`](https://github.com/ohthias/roboStage/blob/main/utils/competitions/obr/scoring.ts). O mesmo módulo é usado pelo Pontuador e pelo LabTest, então os dois sempre dão o mesmo resultado.

| Elemento | Pontos |
| --- | --- |
| Interseção / beco sem saída | 10 cada |
| Gangorra | 20 cada |
| Obstáculo desviado | 20 cada |
| Ladrilho com gap, rampa ou lombada | 10 por ladrilho |
| Passagem | 0 |
| Ladrilho de partida | 5 |
| Checkpoint superado | 5, 3 ou 1 por ladrilho (1ª, 2ª ou 3ª tentativa); 0 depois |
| Chegada | 60, menos 5 por falha de progresso (mínimo 0) |

A soma acima é a **base**. Os resgates multiplicam a base: ×1,3 por vítima viva na área verde (até 2), ×1,3 por vítima morta na área vermelha (até 1), ×1,1 por vítima invertida e ×1,5 pelo Desafio Surpresa. O total é arredondado para cima. O tempo (até 300 s) é guardado para desempate e vale 300 s se o robô não chegou ou desistiu.

A conta usa aritmética inteira (multiplicadores em décimos), para evitar erros de ponto flutuante como 1,3 × 1,3.

> [!NOTE]
> Os valores acima são os do código atual e acompanham o manual da OBR usado como referência. Confira sempre o manual oficial da edição em que sua equipe compete.

### QuickBrick Studio

| Ferramenta | Rota | Modalidade |
| --- | --- | --- |
| Criador de Arenas | `/obr/quickbrick/criador-de-arenas` | Prática: monta o percurso e a sala de resgate, com detecção de colisão e análise. |
| Mapa de palco (StageMap) | `/obr/quickbrick/mapa-de-palco` | Artística: palco de 2,70 × 2,70 m, marcações, trajetórias por cena, animação e verificador das regras de 2026. |
| Matriz de Risco | `/obr/quickbrick/matriz-de-risco` | — |
| Matriz SWOT | `/obr/quickbrick/matriz-swot` | — |

O Mapa de palco não abre em telas estreitas (até 720 px): nelas, ele mostra um aviso para usar um computador.

### No LabTest

- **Rodadas de Resgate** com a mesma pontuação do Pontuador. Além do placar, guardam o que serve para treinar: tentativas de cada perigo (taxa de sucesso), onde aconteceu cada falha (mapa de calor sobre a arena) e a linha do tempo da sala de resgate.
- **CalibraBot** com presets próprios da OBR, como a leitura de cores (preto, branco, verde, prata, vermelho) e campos calculados automaticamente.
- **Anatix**: telemetria ao vivo do robô (Arduino) pelo navegador.

Código: `utils/labtest/obr.ts`, `utils/labtest/obr-presets.ts`, `utils/competitions/obr/`, `components/labtest/obr/`.

## Recursos por liga no Dashboard

As ligas ficam na tabela `leagues`. O código reconhece cada liga por código e nome e associa a ela um **perfil** de recursos:

| Recurso | `fll` | `fll-future` | `obr` / `obr-resgate` | `generic` |
| --- | :---: | :---: | :---: | :---: |
| Testes de Runs | Completo | Completo | Completo | Em breve |
| CalibraBot | Completo | Completo | Completo | Completo |
| Testes personalizados | Completo | Completo | Completo | Completo |
| Anatix | Em breve | Em breve | Completo | Em breve |
| Caderno do robô | Completo | Em breve | Em breve | Em breve |

Independentemente da liga, todos têm **Stagebook, ThinkLab, Kanban, Calendário, etiquetas e marcos**.

Ligas sem perfil conhecido caem em `generic`. Para liberar um recurso para uma liga, edite `PROFILES` em `league-features.ts`. Os níveis possíveis são `full`, `simple`, `paused` e `soon`.

## FIRST® Tech Challenge

A FTC aparece como "em breve" na home e já tem título e descrição previstos em `[competicao]/layout.tsx`. Ainda **não** está registrada em `COMPETICOES`, então `/ftc` responde 404.

## Adicionando uma competição

Veja o passo a passo em [Arquitetura das rotas](rotas.md#criando-uma-rota). Em resumo:

1. Registre em `COMPETICOES` e crie a home em `COMPETICOES_COMPONENTES`.
2. Defina menus e temporadas em `NAVIGATION`, páginas em `COMPETITION_PAGES` e cronômetros em `TIMERS_BY_COMPETITION`.
3. Adicione os dados em `public/data/<competicao>/` e as ferramentas do QuickBrick em `ferramentasPorCompeticao`.
4. Libere a rota no `proxy.ts` e crie um perfil em `league-features.ts`.
5. Documente aqui.
