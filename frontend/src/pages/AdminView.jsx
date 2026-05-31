import { useState } from 'react';
import styles from '../css/AdminView.module.css';
import FormContainer from '../components/FormContainer';
import FormField from '../components/FormField';
import FormButton from '../components/FormButton';

function AdminView() {
    // 📦 Симуляция данных из БД (замените на реальный fetch/запрос)
    const [courseDate, setCourseDate] = useState('2024-12-15'); 

    const handleDateChange = (e) => {
        setCourseDate(e.target.value);
    };

    // Функция для сохранения изменённой даты (например, отправка в БД)
    const saveDate = () => {
        console.log('Отправка в БД:', courseDate);
        // fetch('/api/update-date', { method: 'POST', body: JSON.stringify({ date: courseDate }) })
    };

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
                                    <p>Терешкова Анна Петровна</p>
                                    <p>Терешков Артём Петров</p>
                                </div>
                            </div>
                            <div className={styles.CourseDateBlock}>
                                <p className={styles.CourseDateText}>Назначить/изменить дату</p>
                                <input 
                                    type="date" 
                                    className={styles.CourseDate}
                                    value={courseDate}
                                    onChange={handleDateChange}
                                />
                                {/* Кнопка сохранения (опционально) */}
                                <button className={styles.SaveButton} onClick={saveDate} style={{ marginTop: 8, cursor: 'pointer' }}>
                                    Сохранить
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default AdminView;