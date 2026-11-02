import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import type { Element, Root, Text } from "hast";
import { flatNav, href, legacyLinks, site } from "./site";

export type Heading = { id: string; text: string; level: 2 | 3 };
export type Doc = {
  slug: string;
  title: string;
  description: string;
  html: string;
  headings: Heading[];
  text: string;
  file: string;
  words: number;
};

const CONTENT = path.join(process.cwd(), "content", "docs");
const fileFor = (slug: string) => (slug ? `${slug}.md` : "index.md");

/* ------------------------------------------------------------ plugins */

/** Links internos: "API.md#x", "./development/setup.md" → "/referencia/apis/#x". */
function rehypeLinks(fromSlug: string) {
  const baseDir = path.posix.dirname(fileFor(fromSlug));
  const slugs = new Set(flatNav.map((n) => n.slug));
  return () => (tree: Root) => {
    visit(tree, "element", (el: Element) => {
      if (el.tagName !== "a") return;
      const raw = String(el.properties?.href ?? "");
      if (/^https?:\/\//.test(raw)) {
        el.properties = { ...el.properties, target: "_blank", rel: ["noreferrer"] };
        return;
      }
      const m = raw.match(/^([^#?]+\.md)(#.*)?$/i);
      if (!m) return;
      const [, file, hash = ""] = m;
      const resolved = path.posix.normalize(path.posix.join(baseDir, file)).replace(/^\.\//, "");
      const legacy = legacyLinks[file.replace(/^\.\//, "").toLowerCase()] ?? legacyLinks[resolved.toLowerCase()];
      const slug = legacy ?? resolved.replace(/(^|\/)index\.md$/i, "").replace(/\.md$/i, "");
      if (legacy === undefined && !slugs.has(slug)) return; // deixa como está; o check:links acusa
      el.properties = { ...el.properties, href: href(slug) + hash };
    });
  };
}

/**
 * Callouts. Aceita o formato do GitHub (`> [!NOTE]`, `[!TIP]`, `[!WARNING]`,
 * `[!IMPORTANT]`, `[!CAUTION]`) e o formato antigo (`> **Rótulo:** texto`).
 */
const KINDS: Record<string, string> = { NOTE: "note", TIP: "tip", IMPORTANT: "important", WARNING: "warning", CAUTION: "caution" };
const LABELS: Record<string, string> = { note: "Nota", tip: "Dica", important: "Importante", warning: "Atenção", caution: "Cuidado" };

function rehypeCallouts() {
  return (tree: Root) => {
    visit(tree, "element", (el: Element) => {
      if (el.tagName !== "blockquote") return;
      const p = el.children.find((c): c is Element => c.type === "element" && c.tagName === "p");
      if (!p) return;
      let kind = "note";
      const first = p.children[0];
      if (first?.type === "text") {
        const m = (first as Text).value.match(/^\s*\[!(\w+)\]\s*/);
        if (m && KINDS[m[1].toUpperCase()]) {
          kind = KINDS[m[1].toUpperCase()];
          (first as Text).value = (first as Text).value.slice(m[0].length);
          const title: Element = { type: "element", tagName: "p", properties: { className: ["callout-title"] }, children: [{ type: "text", value: LABELS[kind] }] };
          el.children.unshift(title);
        }
      }
      el.properties = { ...el.properties, className: ["callout", `callout-${kind}`] };
    });
  };
}

/** Tabelas largas rolam na horizontal em vez de estourar a página. */
function rehypeTableWrap() {
  return (tree: Root) => {
    visit(tree, "element", (el: Element, i, parent) => {
      if (el.tagName !== "table" || !parent || i === undefined) return;
      (parent.children as Element[])[i] = { type: "element", tagName: "div", properties: { className: ["table-wrap"] }, children: [el] };
    });
  };
}

/* ------------------------------------------------------------ leitura */

export const getDoc = cache(async (slug: string): Promise<Doc | null> => {
  const file = fileFor(slug);
  let source: string;
  try {
    source = await readFile(path.join(CONTENT, file), "utf8");
  } catch {
    return null;
  }

  // O primeiro "# Título" vira o cabeçalho da página.
  const h1 = source.match(/^#\s+(.+?)\s*$/m);
  const meta = flatNav.find((n) => n.slug === slug);
  const body = h1 ? source.replace(h1[0], "") : source;

  const headings: Heading[] = [];
  let text = "";

  const html = String(
    await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(() => (tree: Root) => {
        text = toString(tree).replace(/\s+/g, " ").trim();
        visit(tree, "element", (el: Element) => {
          if (el.tagName === "h2" || el.tagName === "h3") {
            headings.push({ id: String(el.properties?.id ?? ""), text: toString(el), level: el.tagName === "h2" ? 2 : 3 });
          }
        });
      })
      .use(rehypeAutolinkHeadings, {
        behavior: "append",
        properties: { className: ["anchor"], ariaHidden: "true", tabIndex: -1 },
        content: { type: "text", value: "#" },
      })
      .use(rehypeLinks(slug))
      .use(rehypeCallouts)
      .use(rehypeTableWrap)
      .use(rehypePrettyCode, {
        theme: { light: "github-light", dark: "github-dark-dimmed" },
        keepBackground: false,
        defaultLang: "plaintext",
      })
      .use(rehypeStringify)
      .process(body)
  );

  return {
    slug,
    title: h1?.[1] ?? meta?.title ?? slug,
    description: meta?.description ?? "",
    html,
    headings,
    text,
    file: `${site.editBase}${file}`,
    words: text.split(" ").length,
  };
});

export async function getAllDocs() {
  const docs = await Promise.all(flatNav.map((n) => getDoc(n.slug)));
  return docs.filter((d): d is Doc => !!d);
}
