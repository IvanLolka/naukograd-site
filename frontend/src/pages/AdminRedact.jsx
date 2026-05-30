import styles from '../css/AdminRedact.module.css'
import FormContainer from '../components/FormContainer';
import FormField from '../components/FormField';
import FormButton from '../components/FormButton';

function AdminRedact() {
    return (
        <main className={styles.AdminRedact}>
            <div className={styles.AdminRedactWrapper}>
                <h1>Админ редактирование</h1>
                <section className={styles.Block}>
                    <div>
                        <h2>Мероприятия</h2>
                        <div>
                            
                        </div>
                    </div>
                </section>
                <section></section>
            </div>
        </main>
    )
}

export default AdminRedact