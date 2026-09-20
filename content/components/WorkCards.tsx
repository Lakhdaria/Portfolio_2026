"use client";

import Reveal from "./Reveal";
import { usePrefs } from "./PrefsProvider";
import { STACKS, WIDE, YEARS } from "@/content/i18n";
import styles from "./WorkCards.module.css";

export default function WorkCards() {
  const { t } = usePrefs();

  return (
    <section className="panel" id="travaux">
      <div className="wrap">
        <div className="panelHead">
          <p className="panelKicker">{t.works.kicker}</p>
          <h2 className="panelTitle">{t.works.title}</h2>
        </div>

        <div className={styles.grid}>
          {t.works.items.map((project, i) => (
            <Reveal
              key={project.id}
              delay={i * 60}
              className={project.id === WIDE ? styles.wide : undefined}
            >
              <article className={styles.card}>
                <span className={styles.year}>{YEARS[project.id]}</span>
                <h3>{project.title}</h3>
                <p>{project.line}</p>
                <ul className={styles.stack}>
                  {(STACKS[project.id] ?? []).map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
