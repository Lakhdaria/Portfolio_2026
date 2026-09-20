import type { SkillGlyph } from "@/content/i18n";

/**
 * Marques au trait, une par domaine. Chaque dessin montre la structure du
 * domaine qu'il désigne plutôt qu'une icône interchangeable.
 */
export default function Glyph({
  kind,
  className,
}: {
  kind: SkillGlyph;
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 40 40",
    width: 40,
    height: 40,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (kind) {
    // Pile de couches : le front, l'API, la base.
    case "layers":
      return (
        <svg {...common}>
          <path d="M20 5 34 12 20 19 6 12Z" />
          <path d="M6 20 20 27 34 20" />
          <path d="M6 28 20 35 34 28" />
        </svg>
      );

    // Orbite : un appareil, deux plateformes.
    case "orbit":
      return (
        <svg {...common}>
          <rect x="14" y="7" width="12" height="26" rx="3" />
          <ellipse cx="20" cy="20" rx="17" ry="7.5" />
          <circle cx="20" cy="29" r="1" fill="currentColor" stroke="none" />
        </svg>
      );

    // Topologie : un cœur, quatre segments.
    case "network":
      return (
        <svg {...common}>
          <circle cx="20" cy="20" r="3.4" />
          <circle cx="7" cy="9" r="2.4" />
          <circle cx="33" cy="9" r="2.4" />
          <circle cx="7" cy="31" r="2.4" />
          <circle cx="33" cy="31" r="2.4" />
          <path d="M9 10.7 17.4 18M31 10.7 22.6 18M9 29.3 17.4 22M31 29.3 22.6 22" />
        </svg>
      );

    // Écusson et pile mémoire.
    case "shield":
      return (
        <svg {...common}>
          <path d="M20 5 33 9v11c0 8-6 13-13 15C13 33 7 28 7 20V9Z" />
          <path d="M14 18h12M14 23h12" />
        </svg>
      );

    // Signal et sa décomposition.
    case "wave":
      return (
        <svg {...common}>
          <path d="M4 22c4-12 7 8 11-4s7 10 11-2 6 6 10 2" />
          <path d="M4 32h32" opacity="0.45" />
        </svg>
      );

    // Segmentation : une base découpée.
    case "grid":
      return (
        <svg {...common}>
          <rect x="6" y="6" width="28" height="28" rx="3" />
          <path d="M20 6v28M6 20h28" />
          <rect
            x="6"
            y="6"
            width="14"
            height="14"
            rx="3"
            fill="currentColor"
            opacity="0.16"
            stroke="none"
          />
        </svg>
      );
  }
}
