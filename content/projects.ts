export type Project = {
  id: string;
  year: string;
  title: string;
  domain: string;
  note: string;
  body: string[];
  stack: string[];
};

export const projects: Project[] = [
  {
    id: "coupole",
    year: "2026",
    title: "Système de gestion — Cinéma La Coupole",
    domain: "Application métier",
    note: "Commande réelle",
    body: [
      "Un outil complet pour l'exploitation d'une salle de cinéma : back-office EasyAdmin pour la direction, tableaux de bord employés, messagerie interne, plannings et bulletins de paie.",
      "Conçu depuis le poste d'accueil : chaque écran répond à une friction observée en salle plutôt qu'à une spécification théorique.",
    ],
    stack: ["Symfony", "Next.js", "EasyAdmin", "MySQL", "API REST"],
  },
  {
    id: "relyens-diagnostic",
    year: "2026",
    title: "Diagnostic stratégique Relyens",
    domain: "CRM & stratégie",
    note: "Mémoire de Master",
    body: [
      "Diagnostic d'entreprise de trente-cinq pages sur un groupe mutualiste d'assurance : SWOT, PESTEL, benchmark concurrentiel, audit de maturité digitale et des réseaux sociaux.",
      "Volet données : analyse de la gouvernance CRM et recommandations d'architecture de la relation client.",
    ],
    stack: ["Audit digital", "SWOT · PESTEL", "Benchmark", "Gouvernance data"],
  },
  {
    id: "relyens-blog",
    year: "2026",
    title: "Blog corporate Relyens",
    domain: "Interface & rôles",
    note: "Prolongement du diagnostic",
    body: [
      "Plateforme éditoriale d'entreprise livrée en un seul fichier HTML autonome, avec authentification locale et séparation des rôles administrateur / collaborateur.",
      "Exercice de contrainte : obtenir une identité visuelle de niveau agence sans dépendance externe ni build.",
    ],
    stack: ["HTML", "CSS", "JavaScript", "localStorage"],
  },
  {
    id: "edutrack",
    year: "2025",
    title: "EduTrack",
    domain: "Application mobile",
    note: "iOS & Android",
    body: [
      "Application mobile étudiante réunissant l'emploi du temps et un forum d'entraide entre promotions.",
      "Pensée pour l'usage de couloir : consultation en trois secondes entre deux cours.",
    ],
    stack: ["React Native", "Expo", "JavaScript"],
  },
  {
    id: "messagerie",
    year: "2025",
    title: "Messagerie ENSISA",
    domain: "Temps réel",
    note: "Déployée sur GitHub",
    body: [
      "Application de discussion pour la promotion : messages en temps réel, notes vocales, emojis, rôles de modération et administration complète.",
      "L'occasion de traiter sérieusement la question des permissions et de la modération dans un espace étudiant.",
    ],
    stack: ["Django", "Python", "WebSockets", "SQLite"],
  },
  {
    id: "nird",
    year: "2025",
    title: "NIRD / DoctorPC — Nuit de l'Info",
    domain: "Hackathon",
    note: "36 heures, en équipe",
    body: [
      "Plateforme éducative sur le numérique responsable, avec simulateur Linux intégré et assistant conversationnel.",
      "Contribution : intégration responsive et logique du simulateur.",
    ],
    stack: ["JavaScript", "Simulateur shell", "Chatbot", "Responsive"],
  },
  {
    id: "climat",
    year: "2025",
    title: "Climat de Strasbourg-Entzheim, 1950–2024",
    domain: "Analyse de données",
    note: "Soixante-quatorze ans de relevés",
    body: [
      "Analyse spectrale d'une série météorologique longue : transformée de Fourier, identification des cycles saisonniers et pluriannuels, estimation du bruit de fond.",
      "Projet jumeau : implémentation d'algorithmes de bandits (greedy, ε-greedy, Thompson Sampling) sur une simulation d'attribution de traitements médicaux, avec Enzo Battaglia.",
    ],
    stack: ["Python", "NumPy", "FFT", "Matplotlib"],
  },
];
