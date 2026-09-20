import type { Metadata, Viewport } from "next";
import PrefsProvider from "@/components/PrefsProvider";
import { PREFS_BOOTSTRAP } from "@/lib/prefs";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://souss.dev"),
  title: "Sofiane — Ingénierie systèmes & réseaux",
  description:
    "Portfolio de Sofiane : applications métier, mobile, réseaux et communication. ENSISA et BUT MMI, Mulhouse.",
  authors: [{ name: "Sofiane" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "Sofiane — Ingénierie systèmes & réseaux",
    description:
      "Applications métier, mobile, réseaux et communication. Portfolio 2026.",
    siteName: "Portfolio Sofiane",
  },
};

export const viewport: Viewport = {
  themeColor: "#fcfbf9",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Décide du sort de la séquence d'ouverture AVANT le premier rendu : sans ça,
 * la page apparaîtrait une fraction de seconde avant que le voile ne tombe.
 *
 * Elle rejoue à chaque chargement. Seule la réduction des animations demandée
 * par le système la désactive.
 */
const introGate = `(function(){try{
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.dataset.intro=reduce?'done':'pending';
}catch(e){document.documentElement.dataset.intro='done';}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <script dangerouslySetInnerHTML={{ __html: PREFS_BOOTSTRAP }} />
        <script dangerouslySetInnerHTML={{ __html: introGate }} />
        <PrefsProvider>{children}</PrefsProvider>
      </body>
    </html>
  );
}
