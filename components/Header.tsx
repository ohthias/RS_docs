"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { site } from "@/lib/site";
import Logo from "./Logo";
import Search from "./Search";
import ThemeToggle from "./ThemeToggle";
import Sidebar from "./Sidebar";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
      <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

export default function Header() {
  const drawer = useRef<HTMLDialogElement>(null);
  const path = usePathname();
  useEffect(() => drawer.current?.close(), [path]);

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-base-300 bg-base-100/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[90rem] items-center gap-3 px-4 sm:px-6">
        <button className="btn btn-ghost btn-sm btn-square lg:hidden" aria-label="Abrir menu" onClick={() => drawer.current?.showModal()}>
          <Menu className="size-5" />
        </button>
        <Link href="/" aria-label="Início da documentação" className="shrink-0">
          <Logo />
        </Link>
        <span className="hidden font-mono text-[11px] text-base-content/45 md:inline">{site.version}</span>

        <div className="ml-auto flex flex-1 items-center justify-end gap-1 sm:gap-2">
          <Search />
          <a href={site.platform} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm hidden md:inline-flex">
            Plataforma <ArrowUpRight className="size-3.5" />
          </a>
          <a href={site.repo} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm btn-square hidden sm:inline-flex" aria-label="Repositório no GitHub">
            <GitHubIcon />
          </a>
          <ThemeToggle />
        </div>
      </div>

      <dialog ref={drawer} className="modal modal-start lg:hidden">
        <div className="modal-box h-full max-h-none w-80 rounded-none p-0">
          <div className="flex h-16 items-center justify-between border-b border-base-300 px-4">
            <Logo />
            <form method="dialog"><button className="btn btn-ghost btn-sm btn-square" aria-label="Fechar menu"><X className="size-5" /></button></form>
          </div>
          <div className="p-4"><Sidebar onNavigate={() => drawer.current?.close()} /></div>
        </div>
        <form method="dialog" className="modal-backdrop"><button>fechar</button></form>
      </dialog>
    </header>
  );
}
