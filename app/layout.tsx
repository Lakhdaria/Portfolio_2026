import type { Metadata, Viewport } from "next";
import { Fraunces, Jost } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
  variable: "--font-display",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://souss.dev"),
  title: "Sofiane — Ingénierie informatique & relation client",
  description:
    "Portfolio de Sofiane, étudiant ingénieur en informatique et réseaux à l'ENSISA, en double cursus Master Relation client & marketing de l'assurance.",
  keywords: [
    "portfolio",
    "ingénieur informatique",
    "réseaux",
    "ENSISA",
    "CRM",
    "Symfony",
    "Next.js",
    "Mulhouse",
  ],
  authors: [{ name: "Sofiane" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "Sofiane — Ingénierie informatique & relation client",
    description:
      "Systèmes métier, applications web et mobile, diagnostic CRM. Portfolio 2026.",
    siteName: "Portfolio Sofiane",
  },
};

export const viewport: Viewport = {
  themeColor: "#fdfcfa",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  );
}
