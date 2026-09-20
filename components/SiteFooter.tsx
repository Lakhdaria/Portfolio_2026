import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <span>Sofiane — Portfolio 2026</span>
        <span>Conçu et codé à Mulhouse</span>
      </div>
    </footer>
  );
}
