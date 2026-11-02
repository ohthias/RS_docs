"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "rs-docs-theme";

/** Aplicado no <head> antes da pintura, para não piscar o tema errado. */
export const themeScript = `(function(){try{var t=localStorage.getItem('${KEY}');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'robostage-dark':'robostage'}document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`;

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.getAttribute("data-theme") === "robostage-dark"), []);

  function toggle() {
    const next = dark ? "robostage" : "robostage-dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem(KEY, next); } catch {}
    setDark(!dark);
  }

  return (
    <button onClick={toggle} className="btn btn-ghost btn-sm btn-square" aria-label={dark ? "Usar tema claro" : "Usar tema escuro"}>
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
