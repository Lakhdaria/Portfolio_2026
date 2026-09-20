"use client";

import { usePrefs } from "./PrefsProvider";
import { site } from "@/content/i18n";
import styles from "./Contact.module.css";

export default function Contact() {
  const { t } = usePrefs();

  return (
    <section className={`panel ${styles.panel}`} id="contact">
      <div className={`wrap ${styles.inner}`}>
        <h2 className={styles.statement}>{t.contact.title}</h2>
        <a className={styles.cta} href={`mailto:${site.email}`}>
          {site.email}
        </a>
      </div>
    </section>
  );
}
