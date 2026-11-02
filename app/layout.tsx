import type { Metadata } from "next";
import "@fontsource-variable/roboto";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { site } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { themeScript } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Documentação do RoboStage", template: "%s · RoboStage Docs" },
  description: "Documentação técnica do RoboStage: arquitetura, funcionalidades, APIs, banco de dados e desenvolvimento.",
  openGraph: { type: "website", locale: "pt_BR", siteName: site.name, url: site.url },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-theme="robostage" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#cf2a2a" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-base-100 focus:px-3 focus:py-2">
          Pular para o conteúdo
        </a>
        <Header />
        <div id="conteudo" className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
