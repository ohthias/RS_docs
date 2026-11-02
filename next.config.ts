import type { NextConfig } from "next";

// Site 100% estático: `next build` gera a pasta `out/`, pronta para
// Vercel, Cloudflare Pages ou GitHub Pages em docs.robostage.com.br.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
