"use client";
import { useEffect, useState } from "react";
import type { Heading } from "@/lib/markdown";

/** "Nesta página", com a seção visível destacada. */
export default function Toc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" },
    );
    els.forEach((e) => obs.observe(e));
    return () => obs.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;
  return (
    <nav aria-label="Nesta página">
      <p className="kicker mb-3">/ Nesta página</p>
      <ul className="space-y-1 border-l border-base-300 text-[13px]">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`-ml-px block border-l py-1 leading-snug transition-colors ${h.level === 3 ? "pl-6" : "pl-3"} ${
                active === h.id
                  ? "border-primary font-medium text-primary"
                  : "border-transparent text-base-content/60 hover:text-base-content"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
