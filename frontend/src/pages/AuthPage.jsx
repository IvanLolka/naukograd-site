import styles from '../css/AuthPage.module.css'
import FormContainer from '../components/FormContainer';
import FormField from '../components/FormField';
import FormButton from '../components/FormButton';

function AuthPage() {
    return (
        <main className={styles.AuthPage}>
            <FormContainer title="Авторизация" subtitle="Введите данные">
                <FormField label="Почта:" type="email" />
                <FormField label="Пароль:" type="password" />
                <a className={styles.ForgotLink}>Забыли пароль?</a>
                <FormButton>Войти</FormButton>
            </FormContainer>
            
            {/* Весь текст — ссылка */}
            <a href="/RegistPage" className={styles.RegistLink}>
                Ещё не зарегистрировались?
            </a>
        </main>
    )
}

export default AuthPage