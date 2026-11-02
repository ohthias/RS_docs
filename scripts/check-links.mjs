// Confere os links internos e as âncoras do site gerado em out/.
// Uso: npm run build && npm run check:links
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
if (!existsSync(OUT)) {
  console.error("Pasta out/ não encontrada. Rode `npm run build` antes.");
  process.exit(1);
}

const pages = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith(".html")) pages.push(p);
  }
})(OUT);

const ids = new Map();
const urlOf = (file) => "/" + path.relative(OUT, file).replace(/index\.html$/, "").replace(/\\/g, "/");
for (const p of pages) {
  const html = readFileSync(p, "utf8");
  ids.set(urlOf(p), new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}

let broken = 0;
for (const p of pages) {
  if (p.endsWith("404.html") || p.includes("_not-found")) continue;
  const html = readFileSync(p, "utf8");
  for (const [, raw] of html.matchAll(/href="([^"]+)"/g)) {
    if (/^(https?:|mailto:|#$)/.test(raw) || raw.startsWith("/_next") || /\.(ico|png|svg|xml|txt|json)$/.test(raw)) continue;
    const [pathname, hash] = raw.startsWith("#") ? [urlOf(p), raw.slice(1)] : raw.split("#");
    const target = ids.get(pathname);
    if (!target) { broken++; console.log(`✗ ${urlOf(p)} → ${raw} (página não existe)`); continue; }
    if (hash && !target.has(decodeURIComponent(hash))) { broken++; console.log(`✗ ${urlOf(p)} → ${raw} (âncora não existe)`); }
  }
  // Links .md que não foram convertidos
  for (const [, raw] of html.matchAll(/href="([^"]+\.md(?:#[^"]*)?)"/g)) {
    if (!/^https?:/.test(raw)) { broken++; console.log(`✗ ${urlOf(p)} → ${raw} (.md não convertido)`); }
  }
}
console.log(broken ? `\n${broken} link(s) quebrado(s) em ${pages.length} páginas.` : `✓ ${pages.length} páginas, nenhum link quebrado.`);
process.exit(broken ? 1 : 0);
