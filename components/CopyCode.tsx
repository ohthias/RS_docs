"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Coloca um botão "Copiar" em cada bloco de código da página. */
export default function CopyCode() {
  const path = usePathname();
  useEffect(() => {
    const figures = document.querySelectorAll<HTMLElement>(".docs-prose figure[data-rehype-pretty-code-figure]");
    figures.forEach((fig) => {
      if (fig.querySelector(".copy-btn")) return;
      const pre = fig.querySelector("pre");
      if (!pre) return;
      const lang = pre.getAttribute("data-language");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "copy-btn absolute right-2 top-2 rounded-md border border-base-300 bg-base-100/90 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-base-content/60 opacity-0 transition hover:text-primary focus:opacity-100 [figure:hover_&]:opacity-100";
      const label = lang && lang !== "plaintext" ? `${lang} · copiar` : "copiar";
      btn.textContent = label;
      btn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(pre.innerText);
          btn.textContent = "copiado!";
        } catch {
          btn.textContent = "erro";
        }
        setTimeout(() => (btn.textContent = label), 1400);
      });
      fig.appendChild(btn);
    });
  }, [path]);
  return null;
}
