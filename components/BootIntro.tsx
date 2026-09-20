"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Radia from "./Radia";
import { usePrefs } from "./PrefsProvider";
import { introUrl } from "@/content/i18n";
import * as voice from "@/lib/voice";
import styles from "./BootIntro.module.css";

type Phase =
  | "off"
  | "boot"
  | "greet"
  | "typing"
  | "loading"
  | "launch"
  | "done";

const CHAR_MS = 36; // vitesse de parole
const KEY_MS = 80; // vitesse de frappe
const LINE_PAUSE = 460;
const LOAD_MS = 1300; // le site « charge » dans la fenêtre
const ZOOM_MS = 1500; // puis la fenêtre avale l'écran

/**
 * Séquence d'ouverture : un écran qu'on allume, Radia qui présente son maître,
 * qui tape l'adresse, le site qui charge dans la fenêtre, puis un zoom lent
 * jusqu'au vrai site.
 *
 * Elle rejoue à chaque chargement de la page, se passe d'un clic ou de la
 * touche Échap, et ne s'affiche pas du tout si la personne a demandé la
 * réduction des animations. Le script en tête de `app/layout.tsx` pose
 * `data-intro` sur <html> avant le premier rendu, pour qu'aucun éclair de
 * page ne précède le voile.
 */
export default function BootIntro() {
  const { t } = usePrefs();

  const [phase, setPhase] = useState<Phase>("off");
  const [spoken, setSpoken] = useState("");
  const [typed, setTyped] = useState("");
  const [muted, setMuted] = useState(false);

  const timers = useRef<number[]>([]);
  const started = useRef(false);

  useEffect(() => setMuted(voice.isMuted()), []);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const finish = useCallback(() => {
    clearTimers();
    setPhase("done");
    document.documentElement.dataset.intro = "done";
  }, [clearTimers]);

  // La séquence rejoue à chaque chargement : seule la réduction des
  // animations la désactive, et c'est le script de `layout.tsx` qui tranche.
  useEffect(() => {
    if (document.documentElement.dataset.intro === "done") setPhase("done");
    return clearTimers;
  }, [clearTimers]);

  useEffect(() => {
    if (phase === "done") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, finish]);

  /**
   * Toute la séquence est programmée d'un coup, au clic sur le bouton
   * d'allumage — un navigateur n'autorise le son qu'à partir de ce geste.
   */
  const start = useCallback(() => {
    if (started.current) return; // le mode strict monte les effets deux fois
    started.current = true;

    voice.primeAudio();
    voice.chime();
    setPhase("boot");

    let at = 1500;
    after(at, () => setPhase("greet"));

    // La parole : une lettre révélée, une note jouée.
    t.introLines.forEach((text) => {
      at += 260;
      const lineStart = at;
      after(lineStart, () => setSpoken(""));

      text.split("").forEach((char, i) => {
        after(lineStart + (i + 1) * CHAR_MS, () => {
          setSpoken(text.slice(0, i + 1));
          if (/[a-zà-ÿ0-9]/i.test(char)) voice.say(char);
        });
      });

      at = lineStart + text.length * CHAR_MS + LINE_PAUSE;
    });

    // La frappe : elle écrit l'adresse elle-même.
    at += 200;
    after(at, () => setPhase("typing"));

    introUrl.split("").forEach((_, i) => {
      after(at + 420 + i * KEY_MS, () => {
        setTyped(introUrl.slice(0, i + 1));
        voice.key();
      });
    });

    // Entrée : le site charge dans la fenêtre avant qu'on y entre.
    at += 420 + introUrl.length * KEY_MS + 360;
    after(at, () => {
      setPhase("loading");
      voice.advance();
    });

    at += LOAD_MS;
    after(at, () => {
      setPhase("launch");
      voice.open();
    });

    after(at + ZOOM_MS, finish);
  }, [after, finish, t.introLines]);

  const toggleMute = () => {
    const to = !muted;
    voice.setMuted(to);
    setMuted(to);
  };

  if (phase === "done") return null;

  const talking = phase === "greet" && spoken.length > 0;
  const showScene =
    phase === "greet" ||
    phase === "typing" ||
    phase === "loading" ||
    phase === "launch";
  const showWindow =
    phase === "typing" || phase === "loading" || phase === "launch";

  return (
    <div
      className={styles.overlay}
      data-phase={phase}
      data-intro-overlay=""
      role="presentation"
    >
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.ghost}
          onClick={toggleMute}
          aria-pressed={muted}
        >
          {muted ? t.companion.unmute : t.companion.mute}
        </button>
        <button type="button" className={styles.ghost} onClick={finish}>
          {t.cta.close}
        </button>
      </div>

      <div className={styles.screen}>
        <div className={styles.scanlines} aria-hidden="true" />

        {phase === "off" && (
          <div className={styles.standby}>
            <button
              type="button"
              className={styles.power}
              onClick={start}
              autoFocus
            >
              <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d="M24 8v16" />
                <path d="M34.5 13.5a15 15 0 1 1-21 0" />
              </svg>
              <span className="sr-only">Souss</span>
            </button>
            <p className={styles.standbyHint}>souss.dev</p>
          </div>
        )}

        {phase === "boot" && (
          <div className={styles.boot}>
            <div className={styles.mark}>S</div>
            <div className={styles.progress}>
              <i />
            </div>
          </div>
        )}

        {showScene && (
          <div className={styles.desktop}>
            {showWindow && (
              <div className={styles.window}>
                <div className={styles.chrome}>
                  <span className={styles.dots}>
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className={styles.tab}>{introUrl}</span>
                  <span className={styles.address}>
                    {typed}
                    {phase === "typing" && <i className={styles.caret} />}
                  </span>
                </div>

                {/* La barre de chargement du navigateur, sous la barre d'adresse */}
                <div className={styles.loader} />

                <div className={styles.viewport}>
                  <p className={styles.viewportKicker}>{t.hero.kicker}</p>
                  <p className={styles.viewportTitle}>
                    {t.hero.titleTop}
                    <br />
                    {t.hero.titleBottom}
                  </p>
                  <span className={styles.viewportCta}>{t.hero.cta}</span>
                </div>
              </div>
            )}

            <div className={styles.stage} data-aside={phase !== "greet"}>
              {phase === "greet" && (
                <p className={styles.bubble} aria-live="polite">
                  {spoken}
                  <i className={styles.bubbleCaret} />
                </p>
              )}
              <Radia
                uid="intro"
                talking={talking}
                busy={phase === "typing" || phase === "loading"}
              />
              {phase === "greet" && (
                <p className={styles.nameplate}>Radia</p>
              )}
            </div>

            <div className={styles.taskbar} aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
