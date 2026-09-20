"use client";

import Glyph from "./Glyph";
import Reveal from "./Reveal";
import { usePrefs } from "./PrefsProvider";
import styles from "./SkillCards.module.css";

export default function SkillCards() {
  const { t } = usePrefs();

  return (
    <section className={`panel ${styles.panel}`} id="competences">
      <div className="wrap">
        <div className="panelHead">
          <p className="panelKicker">{t.skills.kicker}</p>
          <h2 className="panelTitle">{t.skills.title}</h2>
        </div>

        <div className={styles.grid}>
          {t.skills.cards.map((card, i) => (
            <Reveal key={card.id} delay={i * 60}>
              <article className={styles.card}>
                <Glyph kind={card.glyph} className={styles.glyph} />
                <h3>{card.title}</h3>
                <p>{card.keywords.join(" · ")}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
