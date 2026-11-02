import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { flatNav, href } from "@/lib/site";

export default function Pager({ slug }: { slug: string }) {
  const i = flatNav.findIndex((n) => n.slug === slug);
  const prev = i > 0 ? flatNav[i - 1] : null;
  const next = i >= 0 && i < flatNav.length - 1 ? flatNav[i + 1] : null;
  return (
    <div className="mt-16 grid gap-3 sm:grid-cols-2">
      {prev ? (
        <Link href={href(prev.slug)} className="group corner border border-base-300 p-4 transition hover:-translate-y-0.5 hover:border-primary/50">
          <span className="kicker flex items-center gap-1.5"><ArrowLeft className="size-3.5" /> Anterior</span>
          <span className="mt-1 block font-bold group-hover:text-primary">{prev.title}</span>
        </Link>
      ) : <span />}
      {next && (
        <Link href={href(next.slug)} className="group corner border border-base-300 p-4 text-right transition hover:-translate-y-0.5 hover:border-primary/50">
          <span className="kicker flex items-center justify-end gap-1.5">Próximo <ArrowRight className="size-3.5" /></span>
          <span className="mt-1 block font-bold group-hover:text-primary">{next.title}</span>
        </Link>
      )}
    </div>
  );
}
