import styles from "./Calder.module.css";

/**
 * Calder — l'assistant, en hommage à l'inventeur du mobile : des disques
 * reliés par des fils, en équilibre, chaque étage oscillant à son propre
 * rythme. C'est exactement le motif du site — des nœuds et des liens — et
 * c'est une forme inventée pour l'occasion, pas la copie d'une sculpture.
 */
export default function Calder({
  talking = false,
  busy = false,
  className,
}: {
  talking?: boolean;
  busy?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={`${styles.calder}${className ? ` ${className}` : ""}`}
      data-talking={talking}
      data-busy={busy}
      viewBox="0 0 140 168"
      aria-hidden="true"
    >
      <ellipse className={styles.shade} cx="70" cy="158" rx="28" ry="4" />

      {/* Tout l'ensemble pend d'un point unique et se balance doucement. */}
      <g className={styles.rig}>
        <path className={styles.wire} d="M70 2v12" />

        {/* Étage supérieur : la barre d'équilibre et ses deux contrepoids */}
        <g className={styles.tierTop}>
          <path className={styles.wire} d="M22 20Q70 10 118 20" />
          <path className={styles.wire} d="M22 20v16" />
          <path className={styles.wire} d="M118 20v10" />
          <circle className={styles.discAccent} cx="22" cy="41" r="5" />
          <circle className={styles.discBrass} cx="118" cy="37" r="7" />
        </g>

        {/* La tête */}
        <path className={styles.wire} d="M70 14v18" />
        <g className={styles.head}>
          <circle className={styles.discFace} cx="70" cy="62" r="30" />
          <circle className={styles.ring} cx="70" cy="62" r="24.5" />

          <g className={styles.eyes}>
            <circle cx="60" cy="58" r="3.6" />
            <circle cx="80" cy="58" r="3.6" />
          </g>
          <rect
            className={styles.mouth}
            x="63"
            y="72"
            width="14"
            height="3.4"
            rx="1.7"
          />
        </g>

        {/* Étage inférieur : il oscille plus lentement que le reste */}
        <path className={styles.wire} d="M70 92v14" />
        <g className={styles.tierLow}>
          <path className={styles.wire} d="M44 112Q70 104 96 112" />
          <path className={styles.wire} d="M44 112v9" />
          <path className={styles.wire} d="M96 112v14" />
          <circle className={styles.discInk} cx="44" cy="125" r="4" />
          <circle className={styles.discBrass} cx="96" cy="131" r="5.5" />
        </g>
      </g>
    </svg>
  );
}
