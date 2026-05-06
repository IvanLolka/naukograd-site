import styles from "../css/Card.module.css";

export function Card({ icon, title }) {
  return (
    <div className={styles.Card}>
      <span className={styles.CardIcon}>{icon}</span>
      <h3 className={styles.CardTitle}>{title}</h3>
    </div>
  );
}