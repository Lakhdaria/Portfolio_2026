import { timeline } from "@/content/site";
import styles from "./Timeline.module.css";

export default function Timeline() {
  return (
    <section className="section section--cream" id="parcours">
      <div className="wrap">
        <div className="sectionHead">
          <h2>Parcours</h2>
          <span className="label">Formation &amp; terrain</span>
        </div>

        <div className={styles.track}>
          {timeline.map((entry) => (
            <div key={entry.title} className={styles.row}>
              <span className={styles.when}>{entry.when}</span>
              <div>
                <h3>{entry.title}</h3>
                <p>{entry.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
