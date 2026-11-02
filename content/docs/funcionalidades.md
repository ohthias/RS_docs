# Funcionalidades

O RoboStage é um ecossistema de ferramentas para equipes de robótica, com foco principal na **FIRST® LEGO® League Challenge**. A OBR também tem suporte. Cada módulo resolve uma parte da temporada, e todos compartilham equipes, etiquetas, marcos e escopo.

Esta página descreve cada módulo do ponto de vista técnico: o que ele faz, onde está o código e quais dados ele usa.

## Stagebook

**Espaço de organização e documentação da equipe.**

- Documentos com capa, ícone, tabelas e blocos arrastáveis, num editor baseado em **Lexical**.
- Embeds de cartões do Kanban, eventos, gráficos do LabTest e quadros do ThinkLab dentro dos documentos.
- Pastas com cores e hierarquia.
- Etiquetas e marcos compartilhados com todas as ferramentas.
- Equipes com cargos, permissões e convites (organizações do Clerk).
- Ligas, com recursos liberados por competição.
- Perfis de uso: Competidor, Mentor técnico, Entusiasta e Organizador.
- Notificações e atualização periódica ("tempo real" por polling).

| | |
| --- | --- |
| Rotas | `/dashboard/documents`, `/dashboard/folders`, `/dashboard/labels`, `/dashboard/team`, `/dashboard/leagues` |
| Código | `components/editor/`, `components/stagebook/`, `utils/stagebook/` |
| Tabelas | `documents`, `folders`, `tags`, `milestones`, `teams`, `team_members`, `notifications` |

## QuickBrick Studio

**Planejamento estratégico e preparação do robô.**

- **Estratégias**: desenho sobre a imagem do tapete.
- **Matriz SWOT das missões** e **Matriz SWOT** do robô.
- **Mapa de calor** das regiões problemáticas do tapete.
- **Matriz de Risco**.
- **Tabela de análise de missões**.
- **Sharks Simulator**: trajetórias com waypoints, velocidade e configuração do robô. Desenvolvido pela equipe Sharks.
- **Criador de Arenas (OBR)**: percurso e sala de resgate.
- **StageMap**: apresentações de arena com atores, cenas e marcações.
- **Caderno do robô**: versões com fotos, projetos 3D do BrickLink Studio 2.0 (`three.js`) e diagramas.

| | |
| --- | --- |
| Rotas | `/dashboard/quickbrick`, ferramentas públicas em `/[competicao]/…` |
| Código | `components/QuickBrick/`, `utils/quickbrick/`, `utils/heatmap/` |
| Tabelas | `quickbrick_notebooks`, `quickbrick_photos`, `quickbrick_diagrams` |
| Arquivos | Cloudflare R2, com upload direto por URL pré-assinada |

## LabTest

**Treinos viram dados.**

- Testes de runs ligados à competição e à temporada.
- **CalibraBot**: calibração de motores, giroscópio e PID.
- Testes personalizados com campos configuráveis e predefinições do kit LEGO Education.
- **Rounds da FLL** com cronômetro e as regras de tempo da mesa.
- **Rodadas da OBR Resgate** com pontuação, falhas e sala de resgate.
- Partidas cronometradas da **FLL Future Edition**.
- Histórico, gráficos (Recharts), análise de consistência e comparação de resultados.

| | |
| --- | --- |
| Rotas | `/dashboard/labtest`, `/dashboard/labtest/new`, `/dashboard/labtest/[id]` |
| Código | `components/labtest/`, `utils/labtest/` |
| Tabelas | `tests` (`mode`: `runs`, `calibrabot`, `individual`, `custom`), `test_executions` |
| API | `GET`/`POST /api/labtest` (veja [APIs](referencia/apis.md)) |

## Anatix

**Telemetria ao vivo do robô no navegador.**

O robô é ligado por USB e lido pela **Web Serial API**. A biblioteca do lado do robô é a [Anatix_C](https://github.com/ohthias/Anatix_C), para Arduino.

- Valores ao vivo de sensores, PID e motores.
- Marcações na linha do tempo e estados do robô.
- Tempo de execução de trechos do código.
- Laboratórios gravados (até 3 por espaço), com sessões e frames salvos em lotes.

| | |
| --- | --- |
| Rotas | `/anatix` (pública), `/dashboard/labtest/anatix` |
| Código | `components/labtest/anatix/`, `hooks/useAnatixSerial.ts`, `types/web-serial.d.ts` |
| Tabelas | `anatix_labs`, `anatix_sessions`, `anatix_frames` |

> [!NOTE]
> A Web Serial API está disponível em navegadores baseados em Chromium (Chrome, Edge) no desktop.

## Kanban

- Quadros, colunas e cartões, com regras de coluna.
- Etiquetas, marcos e vários responsáveis por cartão.
- Documentos e eventos vinculados, e histórico de atividades.

**Rotas:** `/dashboard/kanban`, `/dashboard/kanban/[boardId]`. **Tabelas:** `boards`, `board_columns`, `board_cards` e as tabelas de vínculo.

## Calendário

- Treinos, reuniões, competições, prazos, projetos e eventos.
- Filtros por uma ou várias equipes e visão do dia.
- Etiquetas, marcos e documentos ligados aos eventos.

**Rota:** `/dashboard/calendar`. **Tabelas:** `calendar_events`, `calendar_event_documents`, `calendar_event_tags`.

## ThinkLab

**Projeto de Inovação.**

- Quadros para brainstorming, pesquisa e evidências.
- Modelos de Ishikawa, 5W2H, mapa de empatia e fluxogramas.
- Emojis, ícones, imagens e cartões de missões.
- Exportação em SVG.

**Rotas:** `/dashboard/thinklab` (editor em `app/(protected)/(thinklab)/`). **Código:** `components/thinklab/`, `utils/thinklab/`. **Tabela:** `thinklab`.

## Mapa de Empatia

- Personas com fotos e informações.
- Notas adesivas com cores e votação.
- Análises heurísticas.
- Exportação para Markdown e CSV.

**Código:** `components/EmpathyMap/`, `utils/EmpathyMap/`.

## Ferramentas para o dia da competição

| Ferramenta | O que faz | Código |
| --- | --- | --- |
| **Timers** | Cronômetros para mesa, pit, inovação, apresentações e round da OBR. | `/[competicao]/timers`, `components/Timers/` |
| **Recall** | Perguntas e flashcards da temporada, missões, estratégias e entrevistas técnicas. | `/[competicao]/recall`, `components/FlashQA/` |
| **Confia, mas confira!** | Checklists de partida, treino e competição. | `/[competicao]/cheklist`, `components/competicoes/FLL/confere-ai/` |
| **Rubricas** | Apoio às rubricas de avaliação. | `components/Rubric/` |
| **ShowLive** | Gestão de torneios: rodadas, salas, equipes, ranking e exibição de resultados. | `/showlive` |

## NECTA

**Notícias, Eventos, Comunidade, Tutoriais e Atualizações.** É o espaço de conteúdo do RoboStage, aberto à contribuição das equipes, com revisão antes de publicar.

As publicações são escritas num editor separado e lidas do Supabase pela chave pública. Só o conteúdo publicado chega ao site.

| | |
| --- | --- |
| Rotas | `/news`, `/news/[slug]` |
| Código | `utils/institutional/news.ts`, `components/news/` |
| API | `POST /api/revalidate/news` (atualiza o cache na hora) |

## Competições suportadas

| Competição | Situação |
| --- | --- |
| FIRST® LEGO® League Challenge | Disponível |
| FLL Future Edition | Disponível |
| OBR (Olimpíada Brasileira de Robótica) | Disponível |
| FTC | Em breve |

O catálogo fica em `utils/competitions/`, e os dados de cada temporada, em `public/data/fll/` e `public/data/obr/`. O que cada competição oferece, página por página, está em [Competições](competicoes.md).
