export type Project = {
  id: string;
  year: string;
  title: string;
  line: string;
  stack: string[];
  /** La première carte occupe deux colonnes sur grand écran. */
  wide?: boolean;
};

export const projects: Project[] = [
  {
    id: "coupole",
    year: "2026",
    title: "Cinéma La Coupole",
    line: "Le système de gestion de la salle où je travaille. Plannings, paie, messagerie.",
    stack: ["Symfony", "Next.js", "MySQL"],
    wide: true,
  },
  {
    id: "relyens",
    year: "2026",
    title: "Relyens",
    line: "Diagnostic stratégique et blog corporate pour un groupe d'assurance.",
    stack: ["Audit CRM", "HTML", "JS"],
  },
  {
    id: "edutrack",
    year: "2025",
    title: "EduTrack",
    line: "Emploi du temps et forum étudiant, sur iOS et Android.",
    stack: ["React Native", "Expo"],
  },
  {
    id: "messagerie",
    year: "2025",
    title: "Messagerie ENSISA",
    line: "Chat temps réel avec notes vocales et modération.",
    stack: ["Django", "WebSockets"],
  },
  {
    id: "nird",
    year: "2025",
    title: "NIRD",
    line: "Simulateur Linux et plateforme éducative, en 36 heures.",
    stack: ["JavaScript", "Hackathon"],
  },
  {
    id: "climat",
    year: "2025",
    title: "Climat 1950–2024",
    line: "Analyse spectrale de soixante-quatorze ans de relevés.",
    stack: ["Python", "FFT"],
  },
];
