import { nav, site } from "@/content/site";
import styles from "./TopBar.module.css";

export default function TopBar() {
  return (
    <div className={styles.bar}>
      <div className={`wrap ${styles.inner}`}>
        <a className={styles.signature} href="#top">
          {site.alias}
        </a>
        <nav className={styles.nav} aria-label="Navigation principale">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
