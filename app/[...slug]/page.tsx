import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDoc } from "@/lib/markdown";
import { flatNav } from "@/lib/site";
import DocPage from "@/components/DocPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return flatNav.filter((n) => n.slug).map((n) => ({ slug: n.slug.split("/") }));
}

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = await getDoc((await params).slug.join("/"));
  return doc ? { title: doc.title, description: doc.description } : {};
}

export default async function Page({ params }: Props) {
  const doc = await getDoc((await params).slug.join("/"));
  if (!doc) notFound();
  return <DocPage doc={doc} />;
}
