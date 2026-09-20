import { skills } from "@/content/site";
import styles from "./Skills.module.css";

export default function Skills() {
  return (
    <section className="section" id="savoir">
      <div className="wrap">
        <div className="sectionHead">
          <h2>Savoir-faire</h2>
          <span className="label">Technique &amp; relation client</span>
        </div>

        <div className={styles.columns}>
          {skills.map((column) => (
            <div key={column.group} className={styles.column}>
              <h3>{column.group}</h3>
              <ul>
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
