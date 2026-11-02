import { getAllDocs } from "@/lib/markdown";
import { flatNav, href } from "@/lib/site";

export const dynamic = "force-static";

/** Índice da busca, gerado no build (o site é estático). */
export async function GET() {
  const docs = await getAllDocs();
  return Response.json(
    docs.map((d) => ({
      slug: d.slug,
      url: href(d.slug),
      title: d.slug ? d.title : "Visão geral",
      section: flatNav.find((n) => n.slug === d.slug)?.section ?? "",
      headings: d.headings.map(({ id, text }) => ({ id, text })),
      text: d.text,
    })),
  );
}
