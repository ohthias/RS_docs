import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getDoc } from "@/lib/markdown";
import { flatNav, href, nav, site } from "@/lib/site";
import { ICONS } from "@/lib/icons";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = { title: { absolute: "Documentação do RoboStage" } };

export default async function Home() {
  const doc = (await getDoc(""))!;
  const cards = flatNav.filter((n) => n.slug !== "");

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="relative isolate overflow-hidden border-b border-base-300">
        <div className="rs-background" aria-hidden="true">
          <div className="rs-glow rs-glow-one" />
          <div className="rs-glow rs-glow-two" />
          <div className="rs-grid" />
        </div>
        <div className="mx-auto grid max-w-[90rem] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.25fr_1fr] lg:py-24 [&>*]:min-w-0">
          <div>
            <p className="kicker">/ docs.robostage.com.br · {site.version}</p>
            <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">Documentação do</h1>
            <p className="mt-2 inline-block -rotate-1 bg-primary px-3 py-1 text-4xl font-black italic leading-[0.95] tracking-tight text-primary-content sm:text-5xl lg:text-6xl">
              RoboStage.
            </p>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-base-content/70">
              Como a plataforma é construída, como cada ferramenta funciona por dentro e como rodar, integrar e
              contribuir com o projeto — tudo em português, direto do código.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={href("comecar/instalacao")} className="btn btn-primary btn-lg corner shadow-stamp transition-all hover:-translate-y-0.5">
                Começar a desenvolver <ArrowRight className="size-5" />
              </Link>
              <Link href={href("referencia/apis")} className="btn btn-ghost btn-lg corner">
                Referência de APIs
              </Link>
            </div>
          </div>

          {/* Terminal */}
          <div className="corner-lg overflow-hidden border border-base-300 bg-base-100/90 shadow-xl shadow-base-content/[0.05] backdrop-blur">
            <div className="flex items-center gap-1.5 border-b border-base-300 px-4 py-3">
              <span className="size-2.5 rounded-full bg-primary/70" />
              <span className="size-2.5 rounded-full bg-accent/80" />
              <span className="size-2.5 rounded-full bg-success/70" />
              <span className="ml-3 font-mono text-[11px] text-base-content/45">~/roboStage</span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-7">
              <code>
                <span className="text-base-content/40"># 1. código</span>{"\n"}
                <span className="text-primary">$</span> git clone {site.repo}.git{"\n"}
                <span className="text-primary">$</span> cd roboStage && npm install{"\n\n"}
                <span className="text-base-content/40"># 2. banco (Postgres/Neon via Drizzle)</span>{"\n"}
                <span className="text-primary">$</span> npm run db:migrate{"\n\n"}
                <span className="text-base-content/40"># 3. rodar</span>{"\n"}
                <span className="text-primary">$</span> npm run dev{"\n"}
                <span className="text-success">✓</span> Ready on http://localhost:3000
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* ---------------- Mapa da documentação ---------------- */}
      <section className="border-b border-base-300 bg-base-200/40">
        <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8">
          <p className="kicker">/ Mapa da documentação</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Encontre o que <span className="highlight">precisa.</span>
          </h2>
          <div className="mt-10 space-y-10">
            {nav.map((section) => {
              const items = section.items.filter((i) => i.slug !== "");
              return (
                <div key={section.title}>
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-base-content/50">{section.title}</p>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {items.map((item) => {
                      const { icon: Icon, tone } = ICONS[item.slug] ?? ICONS[""];
                      const n = cards.findIndex((c) => c.slug === item.slug) + 1;
                      return (
                        <Link
                          key={item.slug}
                          href={href(item.slug)}
                          className="group corner-lg flex flex-col border border-base-300 bg-base-100 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-base-content/[0.05]"
                        >
                          <div className="flex items-center justify-between">
                            <span className={`corner grid size-11 place-items-center ${tone}`}><Icon className="size-5" strokeWidth={1.8} /></span>
                            <span className="font-mono text-xs text-base-content/35">/{String(n).padStart(2, "0")}</span>
                          </div>
                          <h3 className="mt-5 text-lg font-bold tracking-tight">{item.title}</h3>
                          <p className="mt-1.5 flex-1 text-sm leading-6 text-base-content/60">{item.description}</p>
                          <div className="mt-4 flex items-center justify-between">
                            <code className="rounded-md bg-base-200 px-2 py-0.5 font-mono text-[11px] text-base-content/65">/{item.slug}</code>
                            <ArrowRight className="size-4 text-base-content/40 transition group-hover:translate-x-1 group-hover:text-primary" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <a href={site.platform} target="_blank" rel="noreferrer" className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            Procurando como usar a plataforma? Abra o robostage.com.br <ArrowUpRight className="size-4" />
          </a>
        </div>
      </section>

      <DocPage
        doc={doc}
        hero={
          <header className="mx-auto mb-8 max-w-3xl">
            <p className="kicker">/ Começar</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">Visão geral</h2>
          </header>
        }
      />
    </>
  );
}
