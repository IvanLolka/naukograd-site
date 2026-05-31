import { useState } from 'react';
import styles from '../css/AdminRedact.module.css';
// импорты компонентов...

function AdminRedact() {
    // Пример данных, которые "пришли из БД"
    const [title, setTitle] = useState('Учебный день');
    const [description, setDescription] = useState(
        `· Длительность 4 академических часа\n\n` +
        `· Экскурсия по музею "Авиация и космонавтика"\n\n` +
        `· Профориентационный мастер-класс\n\n` +
        `• 2 профильных мастер-класса по 45 минут на выбор`
    );

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleDescChange = (e) => setDescription(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Сохраняем в БД:', { title, description });
        // тут запрос к API
    };

    return (
        <main className={styles.AdminRedact}>
            <div className={styles.AdminRedactWrapper}>
                <h1>Админ редактирование</h1>
                <form onSubmit={handleSubmit}>
                    <section className={styles.Block}>
                        <div>
                            <h2>Мероприятия</h2>
                            <div className={styles.Fields}>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={handleTitleChange}
                                    placeholder="Название мероприятия"
                                    className={styles.Input}
                                />
                                <textarea
                                    value={description}
                                    onChange={handleDescChange}
                                    placeholder="Описание мероприятия"
                                    className={styles.Textarea}
                                    rows={6}
                                />
                            </div>
                        </div>
                        <button type="submit">
                            Удалить
                        </button>
                    </section>
                </form>
            </div>
        </main>
    );
}

export default AdminRedact;