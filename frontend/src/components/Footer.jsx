import styles from "../css/Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLeftBlock}>
        <h2 className={styles.sectionTitle}>Контакты</h2>
        <h3 className={styles.subSectionTitle}>Телефоны</h3>
        <p className={styles.contactInfo}>
          +7 (499) 112-03-14<br/>
          +7 (967) 180-19-92
        </p>
        <h3 className={styles.subSectionTitle}>Социальные сети</h3>
        <div className={styles.socialMediaIcons}>
          <a href="https://t.me/your_username" target="_blank" rel="noopener noreferrer" className={styles.socialMediaLink}>
            <img className={styles.socialMediaIcon} src="/icons/Телеграмм.svg" alt="Telegram канал Наукоград" />
          </a>
          <a href="https://vk.com/your_group_or_page" target="_blank" rel="noopener noreferrer" className={styles.socialMediaLink}>
            <img className={styles.socialMediaIcon} src="/icons/ВК.svg" alt="Группа ВКонтакте Наукоград" />
          </a>
        </div>
        <p className={styles.emailBlock}>
          Электронная почта<br/>
          <a href="mailto:naukograd.belova@mfua.ru" className={styles.emailLink}>naukograd.belova@mfua.ru</a>
        </p>
      </div>

      <div className={styles.footerRightBlock}>
        <h2 className={styles.sectionTitle}>График работы</h2>
        <p className={styles.scheduleInfo}>
          Понедельник<br/> — пятница<br/>
          9:00 — 18:00
        </p>
      </div>
    </footer>
  );
}

export default Footer;