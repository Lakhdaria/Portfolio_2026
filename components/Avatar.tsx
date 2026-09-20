import styles from "./Avatar.module.css";

/**
 * Nœud — l'assistant. Un personnage original : boîtier clair, visage-écran
 * sombre, antenne à nœud, deux bras qui pianotent. Rien d'emprunté.
 */
export default function Avatar({
  talking = false,
  typing = false,
}: {
  talking?: boolean;
  typing?: boolean;
}) {
  return (
    <svg
      className={styles.avatar}
      data-talking={talking}
      data-typing={typing}
      viewBox="0 0 120 138"
      width="120"
      height="138"
      aria-hidden="true"
    >
      {/* Ombre portée */}
      <ellipse className={styles.shade} cx="60" cy="128" rx="30" ry="5" />

      {/* Antenne */}
      <path className={styles.antenna} d="M60 20V9" />
      <circle className={styles.beacon} cx="60" cy="6" r="4.5" />

      {/* Boîtier */}
      <rect
        className={styles.shell}
        x="18"
        y="20"
        width="84"
        height="80"
        rx="26"
      />

      {/* Bras */}
      <rect className={styles.armLeft} x="8" y="60" width="9" height="22" rx="4.5" />
      <rect className={styles.armRight} x="103" y="60" width="9" height="22" rx="4.5" />

      {/* Visage-écran */}
      <rect className={styles.face} x="30" y="36" width="60" height="46" rx="17" />

      {/* Yeux */}
      <g className={styles.eyes}>
        <circle cx="48" cy="55" r="5" />
        <circle cx="72" cy="55" r="5" />
      </g>

      {/* Bouche */}
      <rect className={styles.mouth} x="52" y="68" width="16" height="4" rx="2" />

      {/* Pieds */}
      <rect className={styles.foot} x="34" y="100" width="18" height="9" rx="4.5" />
      <rect className={styles.foot} x="68" y="100" width="18" height="9" rx="4.5" />
    </svg>
  );
}
