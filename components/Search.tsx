"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, FileText, Hash, Search as SearchIcon } from "lucide-react";

export type SearchEntry = {
  slug: string;
  url: string;
  title: string;
  section: string;
  headings: { id: string; text: string }[];
  text: string;
};

type Hit = { url: string; title: string; context: string; snippet: string; heading?: boolean };

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function snippet(text: string, q: string) {
  const i = norm(text).indexOf(q);
  if (i < 0) return text.slice(0, 120);
  const start = Math.max(0, i - 50);
  return (start > 0 ? "…" : "") + text.slice(start, i + q.length + 80).trim() + "…";
}

function search(index: SearchEntry[], raw: string): Hit[] {
  const q = norm(raw.trim());
  if (q.length < 2) return [];
  const terms = q.split(/\s+/);
  const scored: (Hit & { score: number })[] = [];
  for (const d of index) {
    const t = norm(d.title);
    const body = norm(d.text);
    if (terms.every((w) => t.includes(w) || body.includes(w))) {
      const score = (t.includes(q) ? 100 : 0) + terms.filter((w) => t.includes(w)).length * 20 + (body.includes(q) ? 10 : 0);
      scored.push({ url: d.url, title: d.title, context: d.section, snippet: snippet(d.text, terms[0]), score });
    }
    for (const h of d.headings) {
      const ht = norm(h.text);
      if (terms.every((w) => ht.includes(w))) {
        scored.push({ url: `${d.url}#${h.id}`, title: h.text, context: d.title, snippet: "", heading: true, score: 50 + (ht === q ? 40 : 0) });
      }
    }
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, 12);
}

export default function Search() {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [mac, setMac] = useState(false);

  const hits = useMemo(() => (index ? search(index, q) : []), [index, q]);

  async function open() {
    dialog.current?.showModal();
    setTimeout(() => input.current?.focus(), 10);
    if (!index) {
      try {
        const res = await fetch("/search.json");
        setIndex(await res.json());
      } catch {
        setIndex([]);
      }
    }
  }

  function go(hit: Hit) {
    dialog.current?.close();
    setQ("");
    router.push(hit.url);
  }

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform));
    const h = (e: KeyboardEvent) => {
      const typing = /INPUT|TEXTAREA/.test((e.target as HTMLElement)?.tagName ?? "");
      if ((e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => setSel(0), [q]);

  return (
    <>
      <button
        onClick={open}
        className="flex h-9 w-9 items-center justify-center gap-2 rounded-lg border border-base-300 bg-base-200/60 text-sm text-base-content/55 transition hover:border-base-content/30 sm:w-64 sm:justify-start sm:px-3"
        aria-label="Buscar na documentação"
      >
        <SearchIcon className="size-4" />
        <span className="hidden flex-1 text-left sm:inline">Buscar…</span>
        <kbd className="kbd kbd-xs hidden sm:inline-flex">{mac ? "⌘" : "Ctrl"} K</kbd>
      </button>

      <dialog ref={dialog} className="modal modal-top sm:modal-middle" onClose={() => setQ("")}>
        <div className="modal-box corner-lg mt-16 max-w-2xl border border-base-300 p-0 sm:mt-0">
          <label className="flex items-center gap-3 border-b border-base-300 px-4">
            <SearchIcon className="size-5 text-primary" />
            <input
              ref={input}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, hits.length - 1)); }
                if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
                if (e.key === "Enter" && hits[sel]) go(hits[sel]);
              }}
              placeholder="Buscar na documentação (ex.: LabTest, webhook, Drizzle)"
              className="h-14 flex-1 bg-transparent text-base outline-none"
              aria-label="Termo de busca"
            />
            <kbd className="kbd kbd-xs">Esc</kbd>
          </label>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {q.trim().length < 2 ? (
              <p className="px-3 py-8 text-center text-sm text-base-content/50">Digite pelo menos duas letras.</p>
            ) : !index ? (
              <p className="px-3 py-8 text-center"><span className="loading loading-dots loading-sm" /></p>
            ) : hits.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-base-content/50">Nada encontrado para “{q}”.</p>
            ) : (
              <ul role="listbox">
                {hits.map((h, i) => (
                  <li key={h.url + i} role="option" aria-selected={i === sel}>
                    <button
                      onMouseEnter={() => setSel(i)}
                      onClick={() => go(h)}
                      className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left ${i === sel ? "bg-primary/10" : ""}`}
                    >
                      {h.heading ? <Hash className="mt-0.5 size-4 shrink-0 text-base-content/40" /> : <FileText className="mt-0.5 size-4 shrink-0 text-base-content/40" />}
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-base-content/45">{h.context}</span>
                        <span className={`block truncate font-semibold ${i === sel ? "text-primary" : ""}`}>{h.title}</span>
                        {h.snippet && <span className="mt-0.5 line-clamp-2 block text-xs text-base-content/60">{h.snippet}</span>}
                      </span>
                      {i === sel && <CornerDownLeft className="mt-1 size-4 shrink-0 text-primary" />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button>fechar</button></form>
      </dialog>
    </>
  );
}
