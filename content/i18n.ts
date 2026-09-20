/**
 * Tout le texte du site, en trois langues. Radia demande la sienne au visiteur
 * dès l'arrivée ; le header permet d'en changer à tout moment.
 *
 * Les noms propres et les technologies ne se traduisent pas — ils restent
 * hors des dictionnaires, dans les tableaux partagés en bas de fichier.
 */

import type { Lang } from "@/lib/prefs";

export type SkillGlyph =
  | "network"
  | "layers"
  | "shield"
  | "wave"
  | "grid"
  | "orbit";

export type Dict = {
  label: string;
  nav: { travaux: string; competences: string; jeu: string; contact: string };
  cta: { contact: string; menu: string; close: string };
  hero: {
    kicker: string;
    titleTop: string;
    titleBottom: string;
    cta: string;
  };
  markers: { value: string; caption: string }[];
  skills: {
    kicker: string;
    title: string;
    cards: { id: string; title: string; keywords: string[]; glyph: SkillGlyph }[];
  };
  works: {
    kicker: string;
    title: string;
    items: { id: string; title: string; line: string }[];
  };
  arena: {
    kicker: string;
    title: string;
    lead: string;
    chess: string;
    connect4: string;
    play: string;
    yourTurn: string;
    thinking: string;
    youWin: string;
    sheWins: string;
    draw: string;
    restart: string;
    youAre: string;
    white: string;
    yellow: string;
    check: string;
    difficulty: string;
    levels: { calm: string; sharp: string; merciless: string };
  };
  contact: { title: string; cta: string };
  footer: { left: string; right: string };
  companion: {
    name: string;
    open: string;
    close: string;
    next: string;
    showAll: string;
    mute: string;
    unmute: string;
    ask: string;
    settings: string;
    back: string;
  };
  settings: {
    theme: string;
    themeLight: string;
    themeDark: string;
    font: string;
    fontDefault: string;
    fontReading: string;
    lang: string;
    autoSpeak: string;
    on: string;
    off: string;
  };
  onboarding: {
    intro: string;
    langQuestion: string;
    themeQuestion: string;
    fontQuestion: string;
    speakQuestion: string;
    done: string;
  };
  faq: { question: string; answer: string; target: string }[];
  sections: { top: string[]; competences: string[]; travaux: string[]; jeu: string[]; contact: string[] };
  introLines: string[];
};

const fr: Dict = {
  label: "Français",
  nav: {
    travaux: "Travaux",
    competences: "Compétences",
    jeu: "Jouer",
    contact: "Contact",
  },
  cta: { contact: "Me contacter", menu: "Menu", close: "Fermer" },
  hero: {
    kicker: "Ingénierie systèmes & réseaux",
    titleTop: "Du réseau",
    titleBottom: "jusqu'au client.",
    cta: "Voir les travaux",
  },
  markers: [
    { value: "ENSISA", caption: "Ingénieur informatique & réseaux" },
    { value: "BUT MMI", caption: "Métiers du multimédia & de l'internet" },
    { value: "La Coupole", caption: "Système interne en production" },
  ],
  skills: {
    kicker: "Compétences",
    title: "Six terrains, un même métier.",
    cards: [
      { id: "web", title: "Développement web", keywords: ["Next.js", "React", "Symfony", "Django"], glyph: "layers" },
      { id: "mobile", title: "Mobile", keywords: ["React Native", "Expo"], glyph: "orbit" },
      { id: "reseaux", title: "Systèmes & réseaux", keywords: ["VLAN", "Routage", "Unix", "Packet Tracer"], glyph: "network" },
      { id: "securite", title: "Sécurité & bas niveau", keywords: ["x86-64", "NASM", "Buffer overflow", "Rust"], glyph: "shield" },
      { id: "data", title: "Données & BI", keywords: ["SQL", "OLAP", "Python", "FFT"], glyph: "wave" },
      { id: "crm", title: "Communication & marketing", keywords: ["Marketing digital", "Stratégie CRM", "Audit digital"], glyph: "grid" },
    ],
  },
  works: {
    kicker: "Travaux",
    title: "Des outils en service, pas des maquettes.",
    items: [
      { id: "coupole", title: "Cinéma La Coupole", line: "Le système de gestion de la salle où je travaille. Plannings, paie, messagerie." },
      { id: "relyens", title: "Relyens", line: "Diagnostic stratégique et blog corporate pour un groupe d'assurance." },
      { id: "edutrack", title: "EduTrack", line: "Emploi du temps et forum étudiant, sur iOS et Android." },
      { id: "messagerie", title: "Messagerie ENSISA", line: "Chat temps réel avec notes vocales et modération." },
      { id: "nird", title: "NIRD", line: "Simulateur Linux et plateforme éducative, en 36 heures." },
      { id: "climat", title: "Climat 1950–2024", line: "Analyse spectrale de soixante-quatorze ans de relevés." },
    ],
  },
  arena: {
    kicker: "Récréation",
    title: "Vous pensez battre Radia ?",
    lead: "Elle calcule pendant que vous réfléchissez. Bonne chance.",
    chess: "Échecs",
    connect4: "Puissance 4",
    play: "Lancer la partie",
    yourTurn: "À vous",
    thinking: "Radia réfléchit",
    youWin: "Vous gagnez. Bien joué.",
    sheWins: "Radia gagne.",
    draw: "Partie nulle.",
    restart: "Rejouer",
    youAre: "Vous jouez",
    white: "les blancs",
    yellow: "les jaunes",
    check: "Échec",
    difficulty: "Niveau",
    levels: { calm: "Posé", sharp: "Affûté", merciless: "Sans pitié" },
  },
  contact: { title: "Disponible pour une alternance.", cta: "Écrire à Sofiane" },
  footer: { left: "Sofiane — 2026", right: "Next.js · Three.js" },
  companion: {
    name: "Radia",
    open: "Parler à Radia",
    close: "Fermer",
    next: "Suivant",
    showAll: "Tout afficher",
    mute: "Couper la voix",
    unmute: "Réactiver la voix",
    ask: "Poser une question",
    settings: "Réglages",
    back: "Retour",
  },
  settings: {
    theme: "Apparence",
    themeLight: "Clair",
    themeDark: "Sombre",
    font: "Lecture",
    fontDefault: "Standard",
    fontReading: "Confort de lecture",
    lang: "Langue",
    autoSpeak: "Radia commente les sections",
    on: "Oui",
    off: "Non",
  },
  onboarding: {
    intro: "Avant de commencer, trois questions pour régler le site.",
    langQuestion: "Dans quelle langue voulez-vous lire ?",
    themeQuestion: "Clair ou sombre ?",
    fontQuestion: "Une police plus confortable à lire ? Utile en cas de dyslexie.",
    speakQuestion: "Je commente les sections en chemin ?",
    done: "C'est réglé. Bonne visite !",
  },
  faq: [
    { question: "Comment contacter Sofiane pour un projet ?", answer: "Par courriel, en bas de page. Il répond vite.", target: "contact" },
    { question: "Qu'est-ce qu'il sait faire, concrètement ?", answer: "Six domaines, du câble réseau à la communication.", target: "competences" },
    { question: "Qu'a-t-il déjà livré ?", answer: "Six projets, dont un qui tourne tous les jours en salle de cinéma.", target: "travaux" },
    { question: "Est-il disponible ?", answer: "Il cherche une alternance pour la rentrée 2026.", target: "contact" },
    { question: "On peut jouer ?", answer: "Échecs ou Puissance 4. Je vous préviens, je ne retiens pas mes coups.", target: "jeu" },
  ],
  sections: {
    top: ["Bienvenue chez mon maître !", "Cliquez-moi quand vous voulez : j'ai un mot sur chaque section."],
    competences: ["Six domaines, du câble réseau à la communication.", "Rares sont ceux qui tiennent les deux bouts."],
    travaux: ["Ces outils-là servent pour de vrai. Tous les jours.", "Celui du cinéma tourne en salle, à l'heure où je vous parle."],
    jeu: ["Une partie ? Je calcule vite, je préviens.", "Aux échecs je punis la moindre faute. Au Puissance 4, je ne perds pas."],
    contact: ["Mon maître cherche une alternance.", "Écrivez-lui ! Je veillerai à ce qu'il réponde."],
  },
  introLines: [
    "Coucou ! Moi c'est Radia.",
    "Je veille sur les travaux de mon maître, Sofiane.",
    "Venez, je vous emmène chez lui !",
  ],
};

const en: Dict = {
  label: "English",
  nav: { travaux: "Work", competences: "Skills", jeu: "Play", contact: "Contact" },
  cta: { contact: "Get in touch", menu: "Menu", close: "Close" },
  hero: {
    kicker: "Systems & network engineering",
    titleTop: "From the network",
    titleBottom: "to the client.",
    cta: "See the work",
  },
  markers: [
    { value: "ENSISA", caption: "Computer science & network engineering" },
    { value: "BUT MMI", caption: "Multimedia & internet studies" },
    { value: "La Coupole", caption: "Internal system in production" },
  ],
  skills: {
    kicker: "Skills",
    title: "Six fields, one craft.",
    cards: [
      { id: "web", title: "Web development", keywords: ["Next.js", "React", "Symfony", "Django"], glyph: "layers" },
      { id: "mobile", title: "Mobile", keywords: ["React Native", "Expo"], glyph: "orbit" },
      { id: "reseaux", title: "Systems & networks", keywords: ["VLAN", "Routing", "Unix", "Packet Tracer"], glyph: "network" },
      { id: "securite", title: "Security & low level", keywords: ["x86-64", "NASM", "Buffer overflow", "Rust"], glyph: "shield" },
      { id: "data", title: "Data & BI", keywords: ["SQL", "OLAP", "Python", "FFT"], glyph: "wave" },
      { id: "crm", title: "Communication & marketing", keywords: ["Digital marketing", "CRM strategy", "Digital audit"], glyph: "grid" },
    ],
  },
  works: {
    kicker: "Work",
    title: "Tools in service, not mockups.",
    items: [
      { id: "coupole", title: "La Coupole Cinema", line: "The management system for the venue where I work. Rotas, payroll, messaging." },
      { id: "relyens", title: "Relyens", line: "Strategic audit and corporate blog for an insurance group." },
      { id: "edutrack", title: "EduTrack", line: "Student timetable and forum, on iOS and Android." },
      { id: "messagerie", title: "ENSISA Messenger", line: "Real-time chat with voice notes and moderation." },
      { id: "nird", title: "NIRD", line: "Linux simulator and learning platform, built in 36 hours." },
      { id: "climat", title: "Climate 1950–2024", line: "Spectral analysis of seventy-four years of readings." },
    ],
  },
  arena: {
    kicker: "Interlude",
    title: "Think you can beat Radia?",
    lead: "She calculates while you think. Good luck.",
    chess: "Chess",
    connect4: "Connect 4",
    play: "Start the game",
    yourTurn: "Your move",
    thinking: "Radia is thinking",
    youWin: "You win. Well played.",
    sheWins: "Radia wins.",
    draw: "Draw.",
    restart: "Play again",
    youAre: "You play",
    white: "White",
    yellow: "Yellow",
    check: "Check",
    difficulty: "Level",
    levels: { calm: "Steady", sharp: "Sharp", merciless: "Merciless" },
  },
  contact: { title: "Available for an apprenticeship.", cta: "Email Sofiane" },
  footer: { left: "Sofiane — 2026", right: "Next.js · Three.js" },
  companion: {
    name: "Radia",
    open: "Talk to Radia",
    close: "Close",
    next: "Next",
    showAll: "Show all",
    mute: "Mute voice",
    unmute: "Unmute voice",
    ask: "Ask a question",
    settings: "Settings",
    back: "Back",
  },
  settings: {
    theme: "Appearance",
    themeLight: "Light",
    themeDark: "Dark",
    font: "Reading",
    fontDefault: "Standard",
    fontReading: "Easier to read",
    lang: "Language",
    autoSpeak: "Radia comments on sections",
    on: "Yes",
    off: "No",
  },
  onboarding: {
    intro: "Before we start, three questions to set the site up.",
    langQuestion: "Which language would you like to read in?",
    themeQuestion: "Light or dark?",
    fontQuestion: "A typeface that's easier to read? Helpful with dyslexia.",
    speakQuestion: "Shall I comment on sections as we go?",
    done: "All set. Enjoy the visit!",
  },
  faq: [
    { question: "How do I contact Sofiane about a project?", answer: "By email, at the bottom of the page. He answers quickly.", target: "contact" },
    { question: "What can he actually do?", answer: "Six fields, from network cabling to communication.", target: "competences" },
    { question: "What has he shipped?", answer: "Six projects, one of which runs daily in a cinema.", target: "travaux" },
    { question: "Is he available?", answer: "He's looking for an apprenticeship starting in 2026.", target: "contact" },
    { question: "Can we play something?", answer: "Chess or Connect 4. Fair warning: I don't hold back.", target: "jeu" },
  ],
  sections: {
    top: ["Welcome to my master's place!", "Click me any time — I have a word on every section."],
    competences: ["Six fields, from network cabling to communication.", "Few people hold both ends at once."],
    travaux: ["These tools are in real service. Every day.", "The cinema one is running right now, as we speak."],
    jeu: ["A game? I calculate fast, fair warning.", "At chess I punish every slip. At Connect 4, I don't lose."],
    contact: ["My master is looking for an apprenticeship.", "Write to him! I'll make sure he answers."],
  },
  introLines: [
    "Hello! I'm Radia.",
    "I watch over my master's work — Sofiane.",
    "Come, let me take you to him!",
  ],
};

const de: Dict = {
  label: "Deutsch",
  nav: { travaux: "Arbeiten", competences: "Fähigkeiten", jeu: "Spielen", contact: "Kontakt" },
  cta: { contact: "Kontakt aufnehmen", menu: "Menü", close: "Schließen" },
  hero: {
    kicker: "System- & Netzwerktechnik",
    titleTop: "Vom Netzwerk",
    titleBottom: "bis zum Kunden.",
    cta: "Arbeiten ansehen",
  },
  markers: [
    { value: "ENSISA", caption: "Informatik & Netzwerktechnik" },
    { value: "BUT MMI", caption: "Multimedia & Internet" },
    { value: "La Coupole", caption: "Internes System im Einsatz" },
  ],
  skills: {
    kicker: "Fähigkeiten",
    title: "Sechs Felder, ein Handwerk.",
    cards: [
      { id: "web", title: "Webentwicklung", keywords: ["Next.js", "React", "Symfony", "Django"], glyph: "layers" },
      { id: "mobile", title: "Mobil", keywords: ["React Native", "Expo"], glyph: "orbit" },
      { id: "reseaux", title: "Systeme & Netzwerke", keywords: ["VLAN", "Routing", "Unix", "Packet Tracer"], glyph: "network" },
      { id: "securite", title: "Sicherheit & Hardwarenähe", keywords: ["x86-64", "NASM", "Buffer Overflow", "Rust"], glyph: "shield" },
      { id: "data", title: "Daten & BI", keywords: ["SQL", "OLAP", "Python", "FFT"], glyph: "wave" },
      { id: "crm", title: "Kommunikation & Marketing", keywords: ["Digitales Marketing", "CRM-Strategie", "Digital-Audit"], glyph: "grid" },
    ],
  },
  works: {
    kicker: "Arbeiten",
    title: "Werkzeuge im Einsatz, keine Entwürfe.",
    items: [
      { id: "coupole", title: "Kino La Coupole", line: "Das Verwaltungssystem des Kinos, in dem ich arbeite. Dienstpläne, Lohn, Nachrichten." },
      { id: "relyens", title: "Relyens", line: "Strategische Analyse und Unternehmensblog für eine Versicherungsgruppe." },
      { id: "edutrack", title: "EduTrack", line: "Stundenplan und Studierendenforum, für iOS und Android." },
      { id: "messagerie", title: "ENSISA-Messenger", line: "Echtzeit-Chat mit Sprachnachrichten und Moderation." },
      { id: "nird", title: "NIRD", line: "Linux-Simulator und Lernplattform, in 36 Stunden gebaut." },
      { id: "climat", title: "Klima 1950–2024", line: "Spektralanalyse von vierundsiebzig Jahren Messdaten." },
    ],
  },
  arena: {
    kicker: "Pause",
    title: "Glauben Sie, Sie schlagen Radia?",
    lead: "Sie rechnet, während Sie überlegen. Viel Glück.",
    chess: "Schach",
    connect4: "Vier gewinnt",
    play: "Partie starten",
    yourTurn: "Sie sind dran",
    thinking: "Radia überlegt",
    youWin: "Sie gewinnen. Gut gespielt.",
    sheWins: "Radia gewinnt.",
    draw: "Unentschieden.",
    restart: "Nochmal",
    youAre: "Sie spielen",
    white: "Weiß",
    yellow: "Gelb",
    check: "Schach",
    difficulty: "Stufe",
    levels: { calm: "Ruhig", sharp: "Scharf", merciless: "Gnadenlos" },
  },
  contact: { title: "Verfügbar für ein duales Studium.", cta: "Sofiane schreiben" },
  footer: { left: "Sofiane — 2026", right: "Next.js · Three.js" },
  companion: {
    name: "Radia",
    open: "Mit Radia sprechen",
    close: "Schließen",
    next: "Weiter",
    showAll: "Alles anzeigen",
    mute: "Stimme aus",
    unmute: "Stimme an",
    ask: "Eine Frage stellen",
    settings: "Einstellungen",
    back: "Zurück",
  },
  settings: {
    theme: "Erscheinungsbild",
    themeLight: "Hell",
    themeDark: "Dunkel",
    font: "Lesen",
    fontDefault: "Standard",
    fontReading: "Leichter lesbar",
    lang: "Sprache",
    autoSpeak: "Radia kommentiert die Abschnitte",
    on: "Ja",
    off: "Nein",
  },
  onboarding: {
    intro: "Vorab drei Fragen, um die Seite einzurichten.",
    langQuestion: "In welcher Sprache möchten Sie lesen?",
    themeQuestion: "Hell oder dunkel?",
    fontQuestion: "Eine leichter lesbare Schrift? Hilfreich bei Legasthenie.",
    speakQuestion: "Soll ich die Abschnitte unterwegs kommentieren?",
    done: "Alles eingestellt. Viel Vergnügen!",
  },
  faq: [
    { question: "Wie erreiche ich Sofiane für ein Projekt?", answer: "Per E-Mail, unten auf der Seite. Er antwortet schnell.", target: "contact" },
    { question: "Was kann er konkret?", answer: "Sechs Felder, vom Netzwerkkabel bis zur Kommunikation.", target: "competences" },
    { question: "Was hat er bereits geliefert?", answer: "Sechs Projekte, eines läuft täglich in einem Kino.", target: "travaux" },
    { question: "Ist er verfügbar?", answer: "Er sucht ein duales Studium ab 2026.", target: "contact" },
    { question: "Können wir spielen?", answer: "Schach oder Vier gewinnt. Vorwarnung: ich halte mich nicht zurück.", target: "jeu" },
  ],
  sections: {
    top: ["Willkommen bei meinem Meister!", "Klicken Sie mich jederzeit an — ich habe zu jedem Abschnitt etwas zu sagen."],
    competences: ["Sechs Felder, vom Netzwerkkabel bis zur Kommunikation.", "Wenige halten beide Enden zugleich."],
    travaux: ["Diese Werkzeuge sind wirklich im Einsatz. Täglich.", "Das des Kinos läuft gerade jetzt, während wir sprechen."],
    jeu: ["Eine Partie? Ich rechne schnell, zur Warnung.", "Im Schach bestrafe ich jeden Fehler. Bei Vier gewinnt verliere ich nicht."],
    contact: ["Mein Meister sucht ein duales Studium.", "Schreiben Sie ihm! Ich sorge dafür, dass er antwortet."],
  },
  introLines: [
    "Hallo! Ich bin Radia.",
    "Ich wache über die Arbeiten meines Meisters, Sofiane.",
    "Kommen Sie, ich bringe Sie zu ihm!",
  ],
};

export const DICTS: Record<Lang, Dict> = { fr, en, de };

export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: "fr", label: "Français", short: "FR" },
  { code: "en", label: "English", short: "EN" },
  { code: "de", label: "Deutsch", short: "DE" },
];

/** Ce qui ne se traduit pas : piles techniques, années, adresse. */
export const STACKS: Record<string, string[]> = {
  coupole: ["Symfony", "Next.js", "MySQL"],
  relyens: ["Audit CRM", "HTML", "JS"],
  edutrack: ["React Native", "Expo"],
  messagerie: ["Django", "WebSockets"],
  nird: ["JavaScript", "Hackathon"],
  climat: ["Python", "FFT"],
};

export const YEARS: Record<string, string> = {
  coupole: "2026",
  relyens: "2026",
  edutrack: "2025",
  messagerie: "2025",
  nird: "2025",
  climat: "2025",
};

/** La première carte occupe deux colonnes sur grand écran. */
export const WIDE = "coupole";

export const site = {
  name: "Sofiane",
  alias: "Souss",
  email: "sofiane.pro2004@gmail.com",
  city: "Mulhouse",
} as const;

export const introUrl = "souss.dev";
