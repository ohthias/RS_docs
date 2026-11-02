import {
  BookOpen, Boxes, Braces, Route, Trophy, Database, FolderTree, GitPullRequest, Layers, Map, Puzzle, Rocket, ShieldCheck, Webhook, Wrench, type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, { icon: LucideIcon; tone: string }> = {
  "": { icon: BookOpen, tone: "bg-primary/10 text-primary" },
  "comecar/instalacao": { icon: Rocket, tone: "bg-primary/10 text-primary" },
  "comecar/estrutura": { icon: FolderTree, tone: "bg-primary/10 text-primary" },
  arquitetura: { icon: Layers, tone: "bg-secondary/10 text-secondary" },
  autenticacao: { icon: ShieldCheck, tone: "bg-secondary/10 text-secondary" },
  rotas: { icon: Route, tone: "bg-secondary/10 text-secondary" },
  tipagem: { icon: Braces, tone: "bg-secondary/10 text-secondary" },
  competicoes: { icon: Trophy, tone: "bg-secondary/10 text-secondary" },
  "banco-de-dados": { icon: Database, tone: "bg-secondary/10 text-secondary" },
  funcionalidades: { icon: Boxes, tone: "bg-secondary/10 text-secondary" },
  "referencia/paginas": { icon: Map, tone: "bg-success/10 text-success" },
  "referencia/apis": { icon: Webhook, tone: "bg-success/10 text-success" },
  "referencia/hooks": { icon: Puzzle, tone: "bg-success/10 text-success" },
  "referencia/utilitarios": { icon: Wrench, tone: "bg-success/10 text-success" },
  contribuir: { icon: GitPullRequest, tone: "bg-accent/20 text-[color-mix(in_oklab,var(--color-accent)_55%,var(--color-base-content))]" },
};
