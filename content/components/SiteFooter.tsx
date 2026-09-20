"use client";

import { usePrefs } from "./PrefsProvider";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  const { t } = usePrefs();

  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <span>{t.footer.left}</span>
        <span>{t.footer.right}</span>
      </div>
    </footer>
  );
}
