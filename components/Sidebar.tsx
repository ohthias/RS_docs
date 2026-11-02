"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { href, nav } from "@/lib/site";

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  const current = path.replace(/\/$/, "") || "/";
  let n = 0;
  return (
    <nav aria-label="Documentação" className="space-y-7">
      {nav.map((section) => (
        <div key={section.title}>
          <p className="kicker mb-2.5 px-3">/ {section.title}</p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              n += 1;
              const target = href(item.slug);
              const active = (target.replace(/\/$/, "") || "/") === current;
              return (
                <li key={item.slug}>
                  <Link
                    href={target}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                      active
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                    }`}
                  >
                    <span className={`font-mono text-[10px] ${active ? "text-primary/70" : "text-base-content/30"}`}>
                      {String(n).padStart(2, "0")}
                    </span>
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
