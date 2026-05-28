import styles from '../css/RegistPage.module.css'
import FormContainer from '../components/FormContainer';
import FormField from '../components/FormField';
import FormButton from '../components/FormButton';
import clsx from 'clsx';

function RegistPage() {
    return (
        <main className={styles.RegistPage}>
            <div className={styles.RegistWrapper}>
                <FormContainer title="Регистрация" subtitle="Введите данные">
                    <FormField label="Почта:" type="email" />
                    <FormField label="Пароль:" type="password" />
                    <FormField label="Повторите пароль:" type="password" />
                    <p className={clsx(styles.RegistRule, 'margin5pxH')}>Нажимая кнопку “Зарегистроваться” вы подтверждаете, что являетесь родителем или опекуном.</p>
                    <a className={clsx(styles.DocumentLink, 'margin5pxH')}>Документ подтверждения</a>
                    <FormButton>Зарегистрироваться</FormButton>
                </FormContainer>
                
                {/* Весь текст — ссылка */}
                <a href="/AuthPage" className={styles.AuthLink}>
                    Уже есть аккаунт?
                </a>
            </div>
        </main>
    )
}

export default RegistPage