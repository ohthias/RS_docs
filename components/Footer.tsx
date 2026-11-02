import Link from "next/link";
import { href, links, nav, site } from "@/lib/site";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-base-300">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-6 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-base-content/60">
            Documentação técnica do RoboStage — plataforma aberta para equipes de robótica. Feita com a comunidade.
          </p>
        </div>
        {nav.slice(0, 3).map((s) => (
          <div key={s.title}>
            <h3 className="footer-title">{s.title}</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {s.items.map((i) => (
                <li key={i.slug}><Link className="link link-hover text-base-content/70" href={href(i.slug)}>{i.title}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-base-300">
        <div className="mx-auto flex max-w-[90rem] flex-wrap justify-between gap-3 px-6 py-4 font-mono text-[11px] text-base-content/50">
          <span>© {new Date().getFullYear()} RoboStage · MIT</span>
          <span className="flex flex-wrap gap-4">
            {links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="hover:text-primary">{l.label}</a>)}
            <a href={site.repo} target="_blank" rel="noreferrer" className="hover:text-primary">GitHub</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
