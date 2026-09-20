"use client";

import Link from "next/link";
import { usePrefs } from "./PrefsProvider";
import Arena from "./Arena";
import styles from "./ArenaPage.module.css";

/**
 * L'enveloppe de la page Jouer : un en-tête à elle, le lien de retour, puis
 * la console de jeu partagée.
 */
export default function ArenaPage() {
  const { t } = usePrefs();

  return (
    <div className={styles.page}>
      <div className={`wrap ${styles.top}`}>
        <Link className={styles.back} href="/">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M10 3 5 8l5 5" />
          </svg>
          {t.companion.back}
        </Link>
      </div>

      <Arena standalone />
    </div>
  );
}
