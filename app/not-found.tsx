import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-28 text-center">
      <p className="kicker">/ 404</p>
      <h1 className="mt-4 text-4xl font-black tracking-tight">
        Página <span className="highlight">não encontrada.</span>
      </h1>
      <p className="mt-5 text-base-content/65">
        Ela pode ter mudado de lugar. Use a busca (Ctrl K) ou volte para o início.
      </p>
      <Link href="/" className="btn btn-primary corner mt-8">Ir para o início</Link>
    </div>
  );
}
