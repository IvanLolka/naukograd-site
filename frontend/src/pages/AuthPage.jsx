import styles from '../css/AuthPage.module.css'
import FormContainer from '../components/FormContainer';
import FormField from '../components/FormField';
import FormButton from '../components/FormButton';

function AuthPage() {
    return (
        <main className={styles.AuthPage}>
            <div className={styles.AuthWrapper}>
                <FormContainer title="Авторизация" subtitle="Введите данные">
                    <FormField label="Почта:" type="email" />
                    <FormField label="Пароль:" type="password" />
                    <a href="/VerifyCodePage" className={styles.ForgotLink}>Забыли пароль?</a>
                    <FormButton>Войти</FormButton>
                </FormContainer>
                
                <a href="/RegistPage" className={styles.RegistLink}>
                    Ещё не зарегистрировались?
                </a>
            </div>
        </main>
    )
}

export default AuthPage