"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefs } from "./PrefsProvider";
import { LANGS, site } from "@/content/i18n";
import * as voice from "@/lib/voice";
import styles from "./SiteHeader.module.css";

const SECTIONS = ["competences", "travaux", "jeu", "contact"] as const;
type SectionId = (typeof SECTIONS)[number];

/**
 * Header en îlot flottant.
 *
 * Il se replie quand on descend et revient dès qu'on remonte — c'est le geste
 * qu'attend n'importe quel visiteur, et ça évite de devoir viser une languette
 * de vingt pixels pour récupérer la navigation. La poignée reste quand même
 * là, en secours, pour qui s'arrête en plein milieu de page.
 *
 * Une pastille glisse sous la section en cours, un filet de progression court
 * sous l'îlot, et le menu mobile s'ouvre en plein écran, entrées numérotées.
 */
export default function SiteHeader() {
  const { prefs, set, t } = usePrefs();

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<SectionId | null>(null);
  const [menu, setMenu] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);

  // Défilement : état de l'îlot, sens de lecture, avancée dans la page.
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const height = document.body.scrollHeight - window.innerHeight;

        setScrolled(y > 24);
        setProgress(height > 0 ? Math.min(y / height, 1) : 0);

        // On ne se replie qu'en descendant, et jamais tout en haut.
        if (!menu) {
          if (y > last + 6 && y > 160) setHidden(true);
          else if (y < last - 6) setHidden(false);
        }

        last = y;
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menu]);

  // Quelle section est à l'écran ?
  useEffect(() => {
    const targets = SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const seen = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (seen) setActive(seen.target.id as SectionId);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6] },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // La pastille se cale sous le lien actif.
  const placePill = useCallback(() => {
    const nav = navRef.current;
    if (!nav || !active) return setPill(null);
    const link = nav.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!link) return setPill(null);
    setPill({ x: link.offsetLeft, w: link.offsetWidth });
  }, [active]);

  useEffect(() => {
    placePill();
    window.addEventListener("resize", placePill);
    return () => window.removeEventListener("resize", placePill);
  }, [placePill, prefs.lang]);

  // Un clic ailleurs referme le sélecteur de langue.
  useEffect(() => {
    if (!langOpen) return;
    const close = () => setLangOpen(false);
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [langOpen]);

  // Le menu plein écran bloque le défilement derrière lui.
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  const go = (id: string) => {
    setMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const labels: Record<SectionId, string> = {
    competences: t.nav.competences,
    travaux: t.nav.travaux,
    jeu: t.nav.jeu,
    contact: t.nav.contact,
  };

  return (
    <>
      <div className={styles.rail} data-hidden={hidden}>
        <header className={styles.island} data-scrolled={scrolled}>
          <a
            className={styles.mark}
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              go("top");
            }}
          >
            <span className={styles.dot} aria-hidden="true" />
            {site.alias}
          </a>

          <nav ref={navRef} className={styles.nav} aria-label={t.cta.menu}>
            {pill && (
              <span
                className={styles.pill}
                style={{ transform: `translateX(${pill.x}px)`, width: pill.w }}
                aria-hidden="true"
              />
            )}
            {SECTIONS.map((id) => (
              <a
                key={id}
                data-id={id}
                data-active={active === id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(id);
                }}
              >
                {labels[id]}
              </a>
            ))}
          </nav>

          <div className={styles.tools}>
            <div className={styles.langWrap}>
              <button
                type="button"
                className={styles.chip}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => setLangOpen((v) => !v)}
                aria-expanded={langOpen}
                aria-label={t.settings.lang}
              >
                {LANGS.find((l) => l.code === prefs.lang)?.short}
              </button>
              {langOpen && (
                <ul
                  className={styles.langMenu}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {LANGS.map((l) => (
                    <li key={l.code}>
                      <button
                        type="button"
                        data-on={prefs.lang === l.code}
                        onClick={() => {
                          set({ lang: l.code });
                          voice.advance();
                          setLangOpen(false);
                        }}
                      >
                        <span>{l.short}</span>
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="button"
              className={styles.chip}
              onClick={() => {
                set({ theme: prefs.theme === "dark" ? "light" : "dark" });
                voice.advance();
              }}
              aria-label={t.settings.theme}
              title={t.settings.theme}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {prefs.theme === "dark" ? (
                  <path d="M19 14.8A8 8 0 0 1 9.2 5a8.3 8.3 0 1 0 9.8 9.8Z" />
                ) : (
                  <>
                    <circle cx="12" cy="12" r="4.2" />
                    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
                  </>
                )}
              </svg>
            </button>

            <a className={styles.contact} href={`mailto:${site.email}`}>
              {t.cta.contact}
            </a>

            <button
              type="button"
              className={styles.burger}
              onClick={() => setMenu(true)}
              aria-expanded={menu}
              aria-label={t.cta.menu}
            >
              <i />
              <i />
            </button>
          </div>

          <span
            className={styles.progress}
            style={{ transform: `scaleX(${progress})` }}
            aria-hidden="true"
          />
        </header>
      </div>

      {/* Poignée de secours : pour qui s'arrête net au milieu de la page. */}
      <button
        type="button"
        className={styles.handle}
        data-on={hidden && !menu}
        onClick={() => setHidden(false)}
        aria-label={t.cta.menu}
        tabIndex={hidden ? 0 : -1}
      >
        <svg viewBox="0 0 14 8" aria-hidden="true">
          <path d="M1 1.5 7 6.5 13 1.5" />
        </svg>
      </button>

      {/* Menu plein écran, entrées numérotées. */}
      <div className={styles.sheet} data-open={menu}>
        <button
          type="button"
          className={styles.sheetClose}
          onClick={() => setMenu(false)}
          aria-label={t.cta.close}
        >
          <i />
          <i />
        </button>

        <nav aria-label={t.cta.menu}>
          {SECTIONS.map((id, i) => (
            <a
              key={id}
              href={`#${id}`}
              style={{ transitionDelay: menu ? `${140 + i * 80}ms` : "0ms" }}
              onClick={(e) => {
                e.preventDefault();
                go(id);
              }}
            >
              <span className={styles.num}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={styles.word}>{labels[id]}</span>
            </a>
          ))}
        </nav>

        <div
          className={styles.sheetFoot}
          style={{ transitionDelay: menu ? "520ms" : "0ms" }}
        >
          <div className={styles.sheetLangs}>
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                data-on={prefs.lang === l.code}
                onClick={() => set({ lang: l.code })}
              >
                {l.short}
              </button>
            ))}
          </div>
          <a href={`mailto:${site.email}`}>{t.cta.contact}</a>
        </div>
      </div>
    </>
  );
}
