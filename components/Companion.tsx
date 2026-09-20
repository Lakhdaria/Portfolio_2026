"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Radia from "./Radia";
import { usePrefs } from "./PrefsProvider";
import { hasOnboarded, markOnboarded } from "@/lib/prefs";
import { LANGS } from "@/content/i18n";
import * as voice from "@/lib/voice";
import styles from "./Companion.module.css";

const CHAR_MS = 32;
const SECTIONS = ["top", "competences", "travaux", "jeu", "contact"] as const;
type SectionId = (typeof SECTIONS)[number];

type Mode = "closed" | "chat" | "onboarding" | "faq" | "settings";

/** Les questions d'accueil, dans l'ordre où Radia les pose. */
type Step = "lang" | "theme" | "font" | "speak" | "done";
const STEPS: Step[] = ["lang", "theme", "font", "speak", "done"];

/**
 * Radia sur le site.
 *
 * Elle accueille le visiteur en réglant la langue, le thème, la police et sa
 * propre bavardise ; elle commente ensuite les sections au fil du défilement,
 * sauf si on le lui a interdit ; et elle répond à une liste de questions
 * toutes faites en emmenant à la bonne section.
 */
export default function Companion() {
  const { prefs, set, t } = usePrefs();

  const [mode, setMode] = useState<Mode>("closed");
  const [step, setStep] = useState<Step>("lang");
  const [section, setSection] = useState<SectionId>("top");
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState("");
  const [answer, setAnswer] = useState<{ text: string; target: string } | null>(
    null,
  );

  const typer = useRef<number | null>(null);
  const autoClose = useRef<number | null>(null);
  const full = useRef("");
  /** Tant que c'est vrai, Radia se tait : le visiteur vient de la congédier. */
  const snoozed = useRef(false);

  const done = shown.length >= full.current.length && full.current.length > 0;

  /* --- Frappe ------------------------------------------------------------ */

  const stopTyping = useCallback(() => {
    if (typer.current !== null) {
      window.clearInterval(typer.current);
      typer.current = null;
    }
  }, []);

  const type = useCallback(
    (text: string) => {
      stopTyping();
      full.current = text;
      setShown("");
      let i = 0;
      typer.current = window.setInterval(() => {
        i += 1;
        setShown(text.slice(0, i));
        const char = text[i - 1] ?? "";
        if (/[a-zà-ÿ0-9]/i.test(char)) voice.say(char);
        if (i >= text.length) stopTyping();
      }, CHAR_MS);
    },
    [stopTyping],
  );

  const clearAutoClose = useCallback(() => {
    if (autoClose.current !== null) {
      window.clearTimeout(autoClose.current);
      autoClose.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      stopTyping();
      clearAutoClose();
    },
    [stopTyping, clearAutoClose],
  );

  /* --- Ouverture / fermeture --------------------------------------------- */

  const close = useCallback(() => {
    voice.dismiss();
    stopTyping();
    clearAutoClose();
    setMode("closed");
    setShown("");
    setAnswer(null);
    full.current = "";

    // Congédiée : elle se tient tranquille une demi-minute.
    snoozed.current = true;
    window.setTimeout(() => {
      snoozed.current = false;
    }, 30000);
  }, [stopTyping, clearAutoClose]);

  const lines = t.sections[section];

  const summon = useCallback(() => {
    voice.primeAudio();
    voice.open();
    clearAutoClose();
    setMode("chat");
    setIndex(0);
    setAnswer(null);
    type(lines[0] ?? "");
  }, [clearAutoClose, lines, type]);

  /* --- Accueil ------------------------------------------------------------ */

  useEffect(() => {
    if (hasOnboarded()) return;
    const id = window.setTimeout(() => {
      setMode("onboarding");
      setStep("lang");
      type(t.onboarding.intro);
    }, 1400);
    return () => window.clearTimeout(id);
    // Une seule fois, au montage : la langue peut changer ensuite sans relancer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const advanceStep = (to: Step) => {
    voice.advance();
    setStep(to);
    const prompt: Record<Step, string> = {
      lang: t.onboarding.langQuestion,
      theme: t.onboarding.themeQuestion,
      font: t.onboarding.fontQuestion,
      speak: t.onboarding.speakQuestion,
      done: t.onboarding.done,
    };
    type(prompt[to]);
    if (to === "done") {
      markOnboarded();
      autoClose.current = window.setTimeout(() => setMode("closed"), 2600);
    }
  };

  /* --- Section à l'écran -------------------------------------------------- */

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
        if (seen) setSection(seen.target.id as SectionId);
      },
      { rootMargin: "-35% 0px -40% 0px", threshold: [0, 0.25, 0.6] },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* --- Prise de parole spontanée ------------------------------------------ */

  useEffect(() => {
    // On ne coupe jamais l'accueil, un réglage ou une réponse en cours.
    if (mode === "onboarding" || mode === "settings" || mode === "faq") return;
    if (!prefs.autoSpeak || snoozed.current) return;
    if (!hasOnboarded()) return;
    if (section === "top" && mode === "closed") return; // pas d'assaut à l'arrivée

    const id = window.setTimeout(() => {
      voice.open();
      setMode("chat");
      setIndex(0);
      setAnswer(null);
      type(t.sections[section][0] ?? "");

      // Elle se retire d'elle-même : un commentaire, pas une prise d'otage.
      clearAutoClose();
      autoClose.current = window.setTimeout(() => {
        setMode((current) => (current === "chat" ? "closed" : current));
      }, 7000);
    }, 700);

    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, prefs.autoSpeak, prefs.lang]);

  /* --- Suite du dialogue -------------------------------------------------- */

  const next = () => {
    clearAutoClose();
    if (!done) {
      stopTyping();
      setShown(full.current);
      voice.advance();
      return;
    }
    if (index >= lines.length - 1) {
      close();
      return;
    }
    voice.advance();
    const to = index + 1;
    setIndex(to);
    type(lines[to] ?? "");
  };

  const openFaq = () => {
    clearAutoClose();
    voice.advance();
    setAnswer(null);
    setMode("faq");
  };

  const ask = (question: (typeof t.faq)[number]) => {
    voice.advance();
    setAnswer({ text: question.answer, target: question.target });
    type(question.answer);
  };

  const goTo = (target: string) => {
    voice.advance();
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
    setMode("closed");
    setAnswer(null);
  };

  const muted = voice.isMuted();
  const toggleMute = () => {
    const to = !muted;
    voice.setMuted(to);
    if (!to) {
      voice.primeAudio();
      voice.open();
    }
    // Forcer un rendu : la sourdine vit dans le module audio, pas dans l'état.
    setShown((s) => s);
    setMode((m) => m);
  };

  const open = mode !== "closed";

  return (
    <div className={styles.dock} data-companion="" data-open={open}>
      {open && (
        <div className={styles.bubble} role="status" aria-live="polite">
          <div className={styles.head}>
            <span className={styles.name}>{t.companion.name}</span>
            <div className={styles.headTools}>
              <button
                type="button"
                className={styles.icon}
                onClick={toggleMute}
                aria-pressed={muted}
                title={muted ? t.companion.unmute : t.companion.mute}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
                  {muted ? (
                    <path d="M16 9.5l5 5m0-5l-5 5" />
                  ) : (
                    <path d="M15.8 9.2a4 4 0 0 1 0 5.6M18.4 6.6a7.6 7.6 0 0 1 0 10.8" />
                  )}
                </svg>
              </button>
              <button
                type="button"
                className={styles.icon}
                onClick={() => {
                  clearAutoClose();
                  voice.advance();
                  setMode(mode === "settings" ? "chat" : "settings");
                }}
                aria-pressed={mode === "settings"}
                title={t.companion.settings}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="3.2" />
                  <path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18" />
                </svg>
              </button>
              <button
                type="button"
                className={styles.icon}
                onClick={close}
                title={t.companion.close}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
          </div>

          {/* --- Réglages --- */}
          {mode === "settings" ? (
            <div className={styles.panel}>
              <Field label={t.settings.lang}>
                {LANGS.map((l) => (
                  <Chip
                    key={l.code}
                    on={prefs.lang === l.code}
                    onClick={() => {
                      set({ lang: l.code });
                      voice.advance();
                    }}
                  >
                    {l.label}
                  </Chip>
                ))}
              </Field>

              <Field label={t.settings.theme}>
                <Chip
                  on={prefs.theme === "light"}
                  onClick={() => {
                    set({ theme: "light" });
                    voice.advance();
                  }}
                >
                  {t.settings.themeLight}
                </Chip>
                <Chip
                  on={prefs.theme === "dark"}
                  onClick={() => {
                    set({ theme: "dark" });
                    voice.advance();
                  }}
                >
                  {t.settings.themeDark}
                </Chip>
              </Field>

              <Field label={t.settings.font}>
                <Chip
                  on={prefs.font === "default"}
                  onClick={() => {
                    set({ font: "default" });
                    voice.advance();
                  }}
                >
                  {t.settings.fontDefault}
                </Chip>
                <Chip
                  on={prefs.font === "reading"}
                  onClick={() => {
                    set({ font: "reading" });
                    voice.advance();
                  }}
                >
                  {t.settings.fontReading}
                </Chip>
              </Field>

              <Field label={t.settings.autoSpeak}>
                <Chip
                  on={prefs.autoSpeak}
                  onClick={() => {
                    set({ autoSpeak: true });
                    voice.advance();
                  }}
                >
                  {t.settings.on}
                </Chip>
                <Chip
                  on={!prefs.autoSpeak}
                  onClick={() => {
                    set({ autoSpeak: false });
                    voice.advance();
                  }}
                >
                  {t.settings.off}
                </Chip>
              </Field>
            </div>
          ) : (
            <>
              <p className={styles.text}>
                {shown}
                {!done && <i className={styles.caret} />}
              </p>

              {/* --- Accueil : les options sous la question --- */}
              {mode === "onboarding" && (
                <div className={styles.options}>
                  {step === "lang" &&
                    LANGS.map((l) => (
                      <Chip
                        key={l.code}
                        on={prefs.lang === l.code}
                        onClick={() => {
                          set({ lang: l.code });
                          advanceStep("theme");
                        }}
                      >
                        {l.label}
                      </Chip>
                    ))}

                  {step === "theme" && (
                    <>
                      <Chip
                        on={prefs.theme === "light"}
                        onClick={() => {
                          set({ theme: "light" });
                          advanceStep("font");
                        }}
                      >
                        {t.settings.themeLight}
                      </Chip>
                      <Chip
                        on={prefs.theme === "dark"}
                        onClick={() => {
                          set({ theme: "dark" });
                          advanceStep("font");
                        }}
                      >
                        {t.settings.themeDark}
                      </Chip>
                    </>
                  )}

                  {step === "font" && (
                    <>
                      <Chip
                        on={prefs.font === "reading"}
                        onClick={() => {
                          set({ font: "reading" });
                          advanceStep("speak");
                        }}
                      >
                        {t.settings.fontReading}
                      </Chip>
                      <Chip
                        on={prefs.font === "default"}
                        onClick={() => {
                          set({ font: "default" });
                          advanceStep("speak");
                        }}
                      >
                        {t.settings.fontDefault}
                      </Chip>
                    </>
                  )}

                  {step === "speak" && (
                    <>
                      <Chip
                        on={prefs.autoSpeak}
                        onClick={() => {
                          set({ autoSpeak: true });
                          advanceStep("done");
                        }}
                      >
                        {t.settings.on}
                      </Chip>
                      <Chip
                        on={!prefs.autoSpeak}
                        onClick={() => {
                          set({ autoSpeak: false });
                          advanceStep("done");
                        }}
                      >
                        {t.settings.off}
                      </Chip>
                    </>
                  )}

                  {step === "lang" && (
                    <Chip onClick={() => advanceStep("theme")} ghost>
                      {t.companion.next}
                    </Chip>
                  )}
                </div>
              )}

              {/* --- Questions toutes faites --- */}
              {mode === "faq" && !answer && (
                <ul className={styles.questions}>
                  {t.faq.map((q) => (
                    <li key={q.question}>
                      <button type="button" onClick={() => ask(q)}>
                        {q.question}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {/* --- Barre d'actions --- */}
          {mode !== "settings" && (
            <div className={styles.actions}>
              {mode === "faq" ? (
                answer ? (
                  <>
                    <button
                      type="button"
                      className={styles.ghost}
                      onClick={() => {
                        setAnswer(null);
                        voice.advance();
                      }}
                    >
                      {t.companion.back}
                    </button>
                    <button
                      type="button"
                      className={styles.primary}
                      onClick={() => goTo(answer.target)}
                    >
                      {t.companion.next} →
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className={styles.ghost}
                    onClick={() => {
                      setMode("chat");
                      type(lines[index] ?? lines[0] ?? "");
                    }}
                  >
                    {t.companion.back}
                  </button>
                )
              ) : (
                <>
                  <button
                    type="button"
                    className={styles.ghost}
                    onClick={openFaq}
                  >
                    {t.companion.ask}
                  </button>
                  {mode === "chat" && (
                    <button
                      type="button"
                      className={styles.primary}
                      onClick={next}
                    >
                      {!done
                        ? t.companion.showAll
                        : index >= lines.length - 1
                          ? t.companion.close
                          : t.companion.next}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        className={styles.trigger}
        onClick={open ? close : summon}
        aria-expanded={open}
        title={open ? t.companion.close : t.companion.open}
      >
        <Radia
          uid="dock"
          talking={open && !done}
          className={styles.figure}
        />
        <span className="sr-only">
          {open ? t.companion.close : t.companion.open}
        </span>
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Chip({
  children,
  on = false,
  ghost = false,
  onClick,
}: {
  children: React.ReactNode;
  on?: boolean;
  ghost?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.chip}
      data-on={on}
      data-ghost={ghost}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <div className={styles.options}>{children}</div>
    </div>
  );
}
