import { site, specs } from "@/content/site";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <div className={styles.hero} id="top">
      <div className="wrap">
        <div className={`label ${styles.eyebrow} ${styles.r1}`}>
          <span>Portfolio 2026</span>
          <span>Mulhouse, Alsace</span>
          <span>Ingénierie &amp; relation client</span>
        </div>

        <h1 className={`${styles.title} ${styles.r2}`}>
          Je construis des systèmes qui tiennent, <i>du réseau</i> jusqu&apos;au
          client.
        </h1>

        <p className={`${styles.lede} ${styles.r3}`}>{site.tagline}</p>

        <div className={styles.spec}>
          <dl>
            {specs.map((item) => (
              <div key={item.term}>
                <dt className="label">{item.term}</dt>
                <dd>{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
