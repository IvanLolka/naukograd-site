import styles from '../css/AdminView.module.css'
import FormContainer from '../components/FormContainer';
import FormField from '../components/FormField';
import FormButton from '../components/FormButton';

function AdminView() {
    return (
        <main className={styles.AdminView}>
            <div className={styles.AdminViewWrapper}>
                <h1 className={styles.AdminViewTitle}>Просмотр курсов/мероприятий и назначение даты</h1>
                <section className={styles.CourseSection}>
                    <div className={styles.CourseBlock}>
                        <h2 className={styles.CourseBlockTitle}>Робототехника</h2>
                        <div className={styles.CourseBlockContent}>
                            <div className={styles.RecordsBlock}>
                                <div className={styles.OneRecord}>
                                    <p>Терешкова Анна Петровна</p> {/*Берётся из бд*/}
                                    <p>Терешков Артём Петров</p> {/*Берётся из бд*/}
                                </div>
                            </div>
                            <div className={styles.CourseDateBlock}>
                                <p className={styles.CourseDateText}>Назначить/изменить дату</p>
                                <input type='date' className={styles.CourseDate}></input>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default AdminView