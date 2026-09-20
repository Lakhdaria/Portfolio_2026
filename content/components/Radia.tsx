import styles from "./Radia.module.css";

/**
 * Radia — la petite ombre qui veille sur le site.
 *
 * Le nom vient de Radia Perlman, qui a inventé le Spanning Tree Protocol :
 * l'algorithme qui supprime les boucles d'un réseau commuté et décide par où
 * passe chaque trame. Inconnue du grand public, fondatrice chez les réseaux —
 * et le prénom dit déjà ce que fait le personnage : il rayonne.
 *
 * Forme originale : une goutte d'encre arrondie, grands yeux, sourire, une
 * mèche de fumée sur le crâne et deux mains qui flottent.
 */
export default function Radia({
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
  const halo = `${uid}-halo`;
  const skin = `${uid}-skin`;
  const soft = `${uid}-soft`;
  const glow = `${uid}-glow`;

  return (
    <svg
      className={`${styles.radia}${className ? ` ${className}` : ""}`}
      data-talking={talking}
      data-busy={busy}
      viewBox="0 0 140 156"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={halo} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--radia-glow)" stopOpacity="0.3" />
          <stop offset="58%" stopColor="var(--radia-glow)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--radia-glow)" stopOpacity="0" />
        </radialGradient>

        <linearGradient id={skin} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="var(--radia-ink-lift)" />
          <stop offset="60%" stopColor="var(--radia-ink)" />
          <stop offset="100%" stopColor="var(--radia-ink)" />
        </linearGradient>

        <filter id={soft} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>

        <filter id={glow} x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle className={styles.halo} cx="70" cy="80" r="62" fill={`url(#${halo})`} />

      {/* Le coussin d'ombre sur lequel elle flotte */}
      <ellipse
        className={styles.cushion}
        cx="70"
        cy="142"
        rx="30"
        ry="6"
        filter={`url(#${soft})`}
      />

      <g className={styles.float}>
        {/* La mèche, qui ondule */}
        <path className={styles.tuft} d="M70 26c1-9-6-11-3-18 2-5 7-6 9-3" />

        {/* Les mains */}
        <circle className={styles.handLeft} cx="29" cy="94" r="7.5" />
        <circle className={styles.handRight} cx="111" cy="94" r="7.5" />

        {/* Le corps : dôme arrondi, bas ondulé */}
        <path
          className={styles.body}
          fill={`url(#${skin})`}
          d="M70 26c28 0 38 22 38 54 0 16-2 30-6 40-3 8-9 2-15 6s-11-2-17 1-11-3-17-1-12 2-15-6c-4-10-6-24-6-40 0-32 10-54 38-54Z"
        />

        {/* Joues */}
        <g className={styles.cheeks}>
          <ellipse cx="45" cy="88" rx="7" ry="4.5" />
          <ellipse cx="95" cy="88" rx="7" ry="4.5" />
        </g>

        {/* Les yeux, grands et ronds */}
        <g className={styles.eyes} filter={`url(#${glow})`}>
          <circle cx="56" cy="72" r="7.5" />
          <circle cx="84" cy="72" r="7.5" />
        </g>
        <g className={styles.glints}>
          <circle cx="58.6" cy="69.4" r="2.4" />
          <circle cx="86.6" cy="69.4" r="2.4" />
        </g>

        {/* Le sourire */}
        <path className={styles.smile} d="M61 88q9 9 18 0" filter={`url(#${glow})`} />

        {/* Étincelles */}
        <g className={styles.sparks} filter={`url(#${glow})`}>
          <circle cx="30" cy="60" r="1.7" />
          <circle cx="110" cy="52" r="1.4" />
          <circle cx="38" cy="36" r="1.2" />
          <circle cx="104" cy="30" r="1.6" />
        </g>
      </g>
    </svg>
  );
}
