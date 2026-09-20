import styles from "./Shade.module.css";

/**
 * Soulages — l'ombre au service de son maître.
 *
 * Le nom est un hommage à Pierre Soulages, le peintre de l'outrenoir : toute
 * une œuvre en noir pur, dont la seule matière est la lumière qu'elle renvoie.
 * C'est exactement ce personnage — une silhouette d'encre qui ne se lit que
 * par ses reflets.
 *
 * La forme est inventée pour l'occasion : une silhouette encapuchonnée qui se
 * lève d'une flaque d'ombre, volutes, braises et regard luisant.
 */
export default function Shade({
  uid,
  talking = false,
  busy = false,
  className,
}: {
  /** Identifiant unique : les filtres SVG ne doivent pas se marcher dessus. */
  uid: string;
  talking?: boolean;
  busy?: boolean;
  className?: string;
}) {
  const aura = `${uid}-aura`;
  const veil = `${uid}-veil`;
  const soft = `${uid}-soft`;
  const glow = `${uid}-glow`;

  return (
    <svg
      className={`${styles.shade}${className ? ` ${className}` : ""}`}
      data-talking={talking}
      data-busy={busy}
      viewBox="0 0 140 172"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={aura} cx="50%" cy="46%" r="50%">
          <stop offset="0%" stopColor="var(--shade-glow)" stopOpacity="0.34" />
          <stop offset="55%" stopColor="var(--shade-glow)" stopOpacity="0.09" />
          <stop offset="100%" stopColor="var(--shade-glow)" stopOpacity="0" />
        </radialGradient>

        {/* Le corps s'éclaircit vers le bas : il se dissout dans sa flaque. */}
        <linearGradient id={veil} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--shade-ink)" />
          <stop offset="72%" stopColor="var(--shade-ink)" />
          <stop offset="100%" stopColor="var(--shade-ink)" stopOpacity="0.55" />
        </linearGradient>

        <filter id={soft} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>

        <filter id={glow} x="-160%" y="-160%" width="420%" height="420%">
          <feGaussianBlur stdDeviation="2.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Halo */}
      <circle className={styles.aura} cx="70" cy="80" r="66" fill={`url(#${aura})`} />

      {/* La flaque d'où il sort */}
      <ellipse
        className={styles.pool}
        cx="70"
        cy="154"
        rx="36"
        ry="8"
        filter={`url(#${soft})`}
      />
      <ellipse className={styles.poolRim} cx="70" cy="154" rx="36" ry="8" />

      <g className={styles.figure}>
        {/* Volutes : la fumée s'échappe des épaules et de la capuche */}
        <g className={styles.wisps} filter={`url(#${soft})`}>
          <path d="M50 84C40 76 34 62 36 46" />
          <path d="M90 84c10-8 16-22 14-38" />
          <path d="M40 112C28 104 22 88 24 70" />
          <path d="M100 112c12-8 18-24 16-42" />
          <path d="M62 34c-4-10-3-18 2-26" />
          <path d="M78 34c4-10 3-18-2-26" />
        </g>

        {/* Le corps. Capuche étroite, col creusé, épaules larges, et un bas
            de manteau déchiqueté : une ombre n'a pas d'ourlet net. */}
        <path
          className={styles.body}
          fill={`url(#${veil})`}
          d="M70 26C81 26 89 37 88 52c-0.6 9-3 15-6 18 14 6 24 34 24 80-6 8-14 0-22 5-8 5-16-3-24 1-8 4-16-4-22-6 0-46 10-74 24-80-3-3-5.4-9-6-18-1-15 7-26 18-26Z"
        />

        {/* Le regard, enfoncé dans la capuche */}
        <g className={styles.eyes} filter={`url(#${glow})`}>
          <ellipse cx="63" cy="50" rx="4.8" ry="2.4" transform="rotate(-12 63 50)" />
          <ellipse cx="77" cy="50" rx="4.8" ry="2.4" transform="rotate(12 77 50)" />
        </g>

        {/* Braises */}
        <g className={styles.embers} filter={`url(#${glow})`}>
          <circle cx="46" cy="120" r="1.7" />
          <circle cx="96" cy="112" r="1.4" />
          <circle cx="58" cy="132" r="1.2" />
          <circle cx="86" cy="128" r="1.6" />
          <circle cx="70" cy="140" r="1.1" />
        </g>
      </g>
    </svg>
  );
}
