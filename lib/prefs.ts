/**
 * Les réglages que Radia demande au visiteur, et qui pilotent le site entier.
 *
 * Tout est posé en attributs sur <html> : le CSS fait le reste, sans rerendu
 * React. Le script de `app/layout.tsx` les restitue AVANT la première peinture,
 * sinon le site clignoterait en clair avant de passer en sombre.
 */

export type Theme = "light" | "dark";
export type FontMode = "default" | "reading";
export type Lang = "fr" | "en" | "de";

export type Prefs = {
  theme: Theme;
  font: FontMode;
  lang: Lang;
  /** Radia prend la parole d'elle-même à chaque section. */
  autoSpeak: boolean;
};

export const DEFAULTS: Prefs = {
  theme: "light",
  font: "default",
  lang: "fr",
  autoSpeak: true,
};

const KEY = "souss-prefs";

/** Police conçue pour la lecture — chargée seulement si on la demande. */
const READING_FONT =
  "https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600&display=swap";

export function readPrefs(): Prefs {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const saved = JSON.parse(raw) as Partial<Prefs>;
    return {
      theme: saved.theme === "dark" ? "dark" : "light",
      font: saved.font === "reading" ? "reading" : "default",
      lang:
        saved.lang === "en" || saved.lang === "de" || saved.lang === "fr"
          ? saved.lang
          : DEFAULTS.lang,
      autoSpeak: saved.autoSpeak !== false,
    };
  } catch {
    return DEFAULTS;
  }
}

export function savePrefs(prefs: Prefs): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    // Stockage bloqué : les réglages ne valent que pour cette page.
  }
}

/** Charge la police de lecture à la demande, une seule fois. */
function ensureReadingFont(): void {
  if (document.getElementById("reading-font")) return;
  const link = document.createElement("link");
  link.id = "reading-font";
  link.rel = "stylesheet";
  link.href = READING_FONT;
  document.head.appendChild(link);
}

export function applyPrefs(prefs: Prefs): void {
  const root = document.documentElement;
  root.dataset.theme = prefs.theme;
  root.dataset.font = prefs.font;
  root.lang = prefs.lang;
  if (prefs.font === "reading") ensureReadingFont();
}

/**
 * Le script inline injecté avant la première peinture. Il duplique la logique
 * ci-dessus en une ligne — c'est le prix à payer pour éviter le clignotement.
 */
export const PREFS_BOOTSTRAP = `(function(){try{
  var p=JSON.parse(localStorage.getItem('${KEY}')||'{}');
  var r=document.documentElement;
  r.dataset.theme=p.theme==='dark'?'dark':'light';
  r.dataset.font=p.font==='reading'?'reading':'default';
  r.lang=(p.lang==='en'||p.lang==='de')?p.lang:'fr';
  if(p.font==='reading'){
    var l=document.createElement('link');
    l.id='reading-font';l.rel='stylesheet';l.href='${READING_FONT}';
    document.head.appendChild(l);
  }
}catch(e){
  document.documentElement.dataset.theme='light';
  document.documentElement.dataset.font='default';
}})();`;

/** Vrai si le visiteur n'a encore rien réglé : Radia lui posera les questions. */
export const ONBOARDED_KEY = "souss-onboarded";

export function hasOnboarded(): boolean {
  try {
    return localStorage.getItem(ONBOARDED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markOnboarded(): void {
  try {
    localStorage.setItem(ONBOARDED_KEY, "1");
  } catch {
    // tant pis
  }
}
