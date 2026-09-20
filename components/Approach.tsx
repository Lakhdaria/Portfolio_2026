import { convictions } from "@/content/site";
import styles from "./Approach.module.css";

export default function Approach() {
  return (
    <section className="section section--cream" id="approche">
      <div className="wrap">
        <div className="sectionHead">
          <h2>Approche</h2>
          <span className="label">Trois convictions</span>
        </div>

        <div className={styles.triptych}>
          {convictions.map((item) => (
            <div key={item.kicker}>
              <span className="label">{item.kicker}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
