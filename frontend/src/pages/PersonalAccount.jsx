import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from "../css/PersonalAccount.module.css";

function PersonalAccount() {

  return (
    <main className={styles.PersonalAccount}>
        <div className={styles.PersonalAccountWrapper}>
            <h1 className={styles.PersonalAccountTitle}>Личный кабинет</h1>
            <section className={styles.FirstSection}>
                <div className={clsx(styles.Block, styles.FlexLine, styles.ParentChange)}>
                    <div className={styles.ProfileBlock}>
                        <div className={styles.ProfileIcon}>Т</div> {/*первая буква ФИО родителя*/}
                        <div>
                            <h2 className={styles.TitleFIO}>Терешковая Анна Петровна</h2>
                            <p className={styles.AccountType}>Родитель</p>
                        </div>
                    </div>
                    <Link to="/ParentChange" className={styles.ChildrenChangeButton}>Изменить</Link>
                </div>
                <div className={styles.Block}>
                    <div className={styles.ChildrenTitleLine}>
                        <h3 className={styles.ChildrenTitle}>Дети</h3>
                        <p className={styles.ChildrenChangeButton}>Изменить</p>
                    </div>
                    <div className={styles.RedBlock}>
                        <h4 className={styles.ChildrenFIO}>Терешков Артём Петров</h4>
                        <div className={styles.ChildrenDataLine}>
                            <p className={styles.ChildrenDataText}>12</p> {/*Подтягивать из бд*/}
                            <p className={styles.ChildrenDataText}>лет *</p>
                            <p className={styles.ChildrenDataText}>7</p> {/*Подтягивать из бд*/}
                            <p className={styles.ChildrenDataText}>класс *</p>
                            <p className={styles.ChildrenDataText}>Школа №123</p> {/*Подтягивать из бд*/}
                        </div>
                    </div>
                </div>
                <div className={clsx(styles.Block, styles.FlexList)}>
                    <h3 className={styles.Records}>Записи</h3>
                    <div className={styles.RedBlock}> {/*Каждый блок это запись*/}
                        <h4 className={styles.RecordTitle}>Роботехника</h4> {/*подтягивать из БД*/}
                    </div>
                </div>
                <div className={clsx(styles.Block, styles.FlexList)}>
                    <h3 className={styles.Records}>Уведомления</h3>
                    <div className={clsx(styles.RedBlock, styles.FlexLine)}> {/*Каждый блок это запись*/}
                        <p className={clsx(styles.RecordTitle, styles.UnderLine)}>26.06.2026</p> {/*подтягивать из БД (варианты дата / не назначено)*/}
                        <p className={styles.RecordTitle}>занятия по</p>
                        <p className={styles.RecordTitle}>Робототехника</p> {/*подтягивать из БД*/}
                    </div>
                </div>
            </section>
            <section className={clsx(styles.ButtonSection, styles.FlexList)}>
                <Link to="/AuthPage">
                    <button className={clsx(styles.Button, styles.Orange)}>
                        Записаться на курс
                    </button>
                </Link>

                <Link to="/RegistPage">
                    <button className={clsx(styles.Button, styles.Orange)}>
                        Записаться на мероприятие
                    </button>
                </Link>
                <button className={clsx(styles.Button, styles.Blue)}>Поддержка и помощь</button> {/*заглушка */}
            </section>
        </div>
    </main>
  );
}

export default PersonalAccount;