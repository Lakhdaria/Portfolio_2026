import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import ArenaPage from "@/components/ArenaPage";
import Companion from "@/components/Companion";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Jouer contre Radia — Sofiane",
  description:
    "Une partie d'échecs ou de Puissance 4 contre Radia, l'assistante du portfolio.",
};

/**
 * La récréation vit sur sa propre route. Elle n'a rien à faire dans le
 * déroulé d'un portfolio qu'un recruteur parcourt en diagonale — mais elle
 * mérite mieux qu'une page cachée, donc elle a sa place dans la navigation.
 */
export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <ArenaPage />
      </main>
      <SiteFooter />
      <Companion />
    </>
  );
}
