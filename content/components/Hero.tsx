"use client";

import NetworkField from "./NetworkField";
import { usePrefs } from "./PrefsProvider";
import { site } from "@/content/i18n";
import styles from "./Hero.module.css";

export default function Hero() {
  const { t } = usePrefs();

  return (
    <header className={styles.hero} id="top">
      <NetworkField className={styles.field} />

      <div className={`wrap ${styles.inner}`}>
        <p className={styles.kicker}>{t.hero.kicker}</p>
        <h1 className={styles.title}>
          {t.hero.titleTop}
          <br />
          {t.hero.titleBottom}
        </h1>
        <p className={styles.sub}>
          {site.name} — {site.city}
        </p>

        <a className={styles.cta} href="#travaux">
          {t.hero.cta}
        </a>
      </div>

      <div className={`wrap ${styles.markers}`}>
        {t.markers.map((marker) => (
          <div key={marker.value}>
            <span className={styles.markerValue}>{marker.value}</span>
            <span className={styles.markerCaption}>{marker.caption}</span>
          </div>
        ))}
      </div>
    </header>
  );
}
