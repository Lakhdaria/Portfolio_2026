/**
 * Ce que Radia raconte, section par section. Deux répliques courtes par
 * section : au-delà, on lit un roman au lieu de regarder un portfolio.
 */

export const introLines = [
  "Coucou ! Moi c'est Radia.",
  "Je veille sur les travaux de mon maître, Sofiane.",
  "Venez, je vous emmène chez lui !",
] as const;

export const introUrl = "souss.dev";

export type DialogueSection = {
  id: string;
  lines: string[];
};

export const dialogue: DialogueSection[] = [
  {
    id: "top",
    lines: [
      "Bienvenue chez mon maître !",
      "Cliquez-moi quand vous voulez : j'ai un mot sur chaque section.",
    ],
  },
  {
    id: "competences",
    lines: [
      "Six domaines, du câble réseau à la communication.",
      "Rares sont ceux qui tiennent les deux bouts.",
    ],
  },
  {
    id: "travaux",
    lines: [
      "Ces outils-là servent pour de vrai. Tous les jours.",
      "Celui du cinéma tourne en salle, à l'heure où je vous parle.",
    ],
  },
  {
    id: "contact",
    lines: [
      "Mon maître cherche une alternance.",
      "Écrivez-lui ! Je veillerai à ce qu'il réponde.",
    ],
  },
];
