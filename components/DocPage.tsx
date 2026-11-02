import { Clock, Pencil } from "lucide-react";
import type { Doc } from "@/lib/markdown";
import { flatNav } from "@/lib/site";
import Sidebar from "./Sidebar";
import Toc from "./Toc";
import Pager from "./Pager";
import CopyCode from "./CopyCode";

/** Moldura de uma página: barra lateral · conteúdo · "Nesta página". */
export default function DocPage({ doc, hero }: { doc: Doc; hero?: React.ReactNode }) {
  const section = flatNav.find((n) => n.slug === doc.slug)?.section;
  return (
    <div className="mx-auto grid max-w-[90rem] gap-10 px-4 sm:px-6 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_13rem]">
      <aside className="hidden lg:block">
        <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto py-10 pr-2">
          <Sidebar />
        </div>
      </aside>

      <main className="min-w-0 py-10">
        {hero}
        <article className="mx-auto max-w-3xl">
          {!hero && (
            <header className="mb-10">
              {section && <p className="kicker">/ {section}</p>}
              <h1 className="mt-3 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">{doc.title}</h1>
              {doc.description && <p className="mt-4 text-lg leading-relaxed text-base-content/65">{doc.description}</p>}
              <p className="mt-5 flex items-center gap-4 font-mono text-[11px] text-base-content/50">
                <span className="flex items-center gap-1.5"><Clock className="size-3.5" /> {Math.max(1, Math.round(doc.words / 200))} min de leitura</span>
                <a href={doc.file} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-primary">
                  <Pencil className="size-3.5" /> Editar no GitHub
                </a>
              </p>
            </header>
          )}
          <div className="docs-prose prose prose-neutral" dangerouslySetInnerHTML={{ __html: doc.html }} />
          <CopyCode />
          <Pager slug={doc.slug} />
          <p className="mt-10 border-t border-base-300 pt-5 text-sm text-base-content/55">
            Algo errado ou faltando nesta página?{" "}
            <a href={doc.file} target="_blank" rel="noreferrer" className="link link-primary">Sugira uma edição</a>.
          </p>
        </article>
      </main>

      <aside className="hidden xl:block">
        <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto py-10">
          <Toc headings={doc.headings} />
        </div>
      </aside>
    </div>
  );
}
