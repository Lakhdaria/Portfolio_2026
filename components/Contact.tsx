import { site } from "@/content/site";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section className={`section ${styles.closing}`} id="contact">
      <div className="wrap">
        <h2 className={styles.statement}>
          Parlons de votre <i>prochain</i> projet.
        </h2>

        <div className={styles.rows}>
          <a className={styles.row} href={`mailto:${site.email}`}>
            <span className="label">Écrire</span>
            <span className={styles.value}>{site.email}</span>
            <span className={styles.arrow} aria-hidden="true">
              ↗
            </span>
          </a>

          <div className={styles.row}>
            <span className="label">Localisation</span>
            <span className={styles.value}>{site.location}</span>
            <span className={styles.arrow} aria-hidden="true" />
          </div>

          <div className={styles.row}>
            <span className="label">Recherche</span>
            <span className={styles.value}>{site.seeking}</span>
            <span className={styles.arrow} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
