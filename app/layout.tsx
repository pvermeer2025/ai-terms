import type { Metadata } from "next";
import Script from "next/script";
import { categoriesFrom, getCatalog } from "@/lib/ai-terms";
import { FALLBACK_TOPICS } from "@/lib/routes";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "../public/scss/main.scss";
import "./glossary.css";

export const metadata: Metadata = {
  title: {
    default: "Begrippen · AI Terms",
    template: "%s · AI Terms",
  },
  description:
    "AI-termen in gewone taal. Zoek een begrip, blader op letter of filter op onderwerp.",
  icons: { icon: "/images/logo/favicon.svg" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const catalog = await getCatalog();
  const topics =
    catalog.ok && catalog.terms.length > 0
      ? categoriesFrom(catalog.terms).slice(0, 5)
      : FALLBACK_TOPICS.slice(0, 5);

  return (
    <html lang="nl" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Script id="at-theme" strategy="beforeInteractive">
          {`(function(){try{if(localStorage.getItem("at-theme")==="dark"){document.documentElement.classList.add("dark-mode");document.body.classList.add("dark-mode");}}catch(e){}})();`}
        </Script>
        <div className="at-site">
          <a className="at-skip" href="#inhoud">
            Naar inhoud
          </a>
          <SiteHeader />
          <main className="at-main" id="inhoud">
            {children}
          </main>
          <SiteFooter topics={topics} />
        </div>
      </body>
    </html>
  );
}
