export const site = {
  name: "Sofiane",
  alias: "Souss",
  email: "sofiane.pro2004@gmail.com",
  location: "Mulhouse — Alsace, France",
  seeking: "Alternance & missions freelance",
  tagline:
    "Étudiant ingénieur en informatique et réseaux à l'ENSISA, en double cursus Master Relation client & marketing de l'assurance. Je travaille là où la technique rencontre l'usage : une architecture propre derrière, une expérience nette devant.",
} as const;

export const nav = [
  { href: "#travaux", label: "Travaux" },
  { href: "#approche", label: "Approche" },
  { href: "#savoir", label: "Savoir-faire" },
  { href: "#parcours", label: "Parcours" },
  { href: "#contact", label: "Contact" },
] as const;

export const specs = [
  {
    term: "Discipline",
    detail: "Informatique & réseaux — développement web, systèmes, sécurité",
  },
  {
    term: "Second cursus",
    detail: "Master Relation client & marketing, secteur assurance",
  },
  {
    term: "Terrain",
    detail: "Agent d'accueil, Cinéma La Coupole — et son système interne",
  },
  {
    term: "Disponibilité",
    detail: "Alternance & missions — rentrée 2026",
  },
] as const;

export const convictions = [
  {
    kicker: "Architecture",
    title: "Le modèle avant l'écran",
    body: "Un projet se décide dans son schéma de données et ses rôles. Ce qui est juste en base se paie rarement en interface ; l'inverse n'est jamais vrai.",
  },
  {
    kicker: "Usage",
    title: "L'utilisateur final, pas l'utilisateur idéal",
    body: "Deux ans de guichet apprennent plus sur un parcours client que n'importe quel persona. Je conçois pour la personne pressée, pas pour la démo.",
  },
  {
    kicker: "Livraison",
    title: "Fini vaut mieux que brillant",
    body: "Un outil déployé, documenté et repris par l'équipe a plus de valeur qu'un prototype spectaculaire que personne ne maintient.",
  },
] as const;

export const skills = [
  {
    group: "Développement",
    items: [
      "Symfony · PHP",
      "Django · Python",
      "Next.js · React",
      "React Native · Expo",
      "HTML · CSS · JavaScript",
    ],
  },
  {
    group: "Systèmes & réseaux",
    items: [
      "VLAN, routage inter-VLAN, port security",
      "Cisco Packet Tracer",
      "Unix · scripting bash",
      "Assembleur x86-64 · NASM",
      "Sécurité logicielle · buffer overflow",
    ],
  },
  {
    group: "Données",
    items: [
      "SQL · modélisation SGBD",
      "Business Intelligence · OLAP · MDX",
      "Analyse spectrale · FFT",
      "Algorithmes de bandits",
      "Gouvernance de la donnée",
    ],
  },
  {
    group: "Relation client",
    items: [
      "Stratégie CRM",
      "Diagnostic & audit digital",
      "SWOT · PESTEL · benchmark",
      "Marketing de l'assurance",
      "Gestion de projet",
    ],
  },
] as const;

export const timeline = [
  {
    when: "En cours",
    title: "ENSISA — Ingénierie informatique & réseaux",
    body: "Formation d'ingénieur à Mulhouse : systèmes, réseaux, sécurité logicielle, bases de données, mathématiques appliquées.",
  },
  {
    when: "En cours",
    title: "Master — Relation client & marketing de l'assurance",
    body: "Double cursus orienté CRM, données clients et stratégie digitale. Mémoire appuyé sur un diagnostic complet du groupe Relyens.",
  },
  {
    when: "Depuis 2024",
    title: "Cinéma La Coupole — Agent d'accueil",
    body: "Accueil, billetterie, gestion de flux. C'est de ce poste qu'est né le système de gestion interne développé pour l'établissement.",
  },
  {
    when: "Déc. 2025",
    title: "Nuit de l'Info — Équipe NIRD",
    body: "Trente-six heures de développement en équipe sur une plateforme éducative autour du numérique responsable.",
  },
] as const;
