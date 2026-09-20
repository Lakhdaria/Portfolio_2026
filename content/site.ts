export const site = {
  name: "Sofiane",
  alias: "Souss",
  email: "sofiane.pro2004@gmail.com",
  role: "Ingénierie systèmes & réseaux",
  city: "Mulhouse",
} as const;

export const nav = [
  { href: "#competences", label: "Compétences" },
  { href: "#travaux", label: "Travaux" },
  { href: "#contact", label: "Contact" },
] as const;

/** Trois repères sous l'accroche. Trois mots maximum chacun. */
export const markers = [
  { value: "ENSISA", caption: "Ingénieur informatique & réseaux" },
  { value: "BUT MMI", caption: "Métiers du multimédia & de l'internet" },
  { value: "La Coupole", caption: "Système interne en production" },
] as const;

export type SkillCard = {
  id: string;
  title: string;
  keywords: string[];
  glyph: "network" | "layers" | "shield" | "wave" | "grid" | "orbit";
};

export const skillCards: SkillCard[] = [
  {
    id: "web",
    title: "Développement web",
    keywords: ["Next.js", "React", "Symfony", "Django"],
    glyph: "layers",
  },
  {
    id: "mobile",
    title: "Mobile",
    keywords: ["React Native", "Expo"],
    glyph: "orbit",
  },
  {
    id: "reseaux",
    title: "Systèmes & réseaux",
    keywords: ["VLAN", "Routage", "Unix", "Packet Tracer"],
    glyph: "network",
  },
  {
    id: "securite",
    title: "Sécurité & bas niveau",
    keywords: ["x86-64", "NASM", "Buffer overflow", "Rust"],
    glyph: "shield",
  },
  {
    id: "data",
    title: "Données & BI",
    keywords: ["SQL", "OLAP", "Python", "FFT"],
    glyph: "wave",
  },
  {
    id: "crm",
    title: "Communication & marketing",
    keywords: ["Marketing digital", "Stratégie CRM", "Audit digital"],
    glyph: "grid",
  },
];
