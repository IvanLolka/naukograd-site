import styles from '../css/SetNewPasswordPage.module.css'
import FormContainer from '../components/FormContainer';
import FormField from '../components/FormField';
import FormButton from '../components/FormButton';

function SetNewPasswordPage() {
    return (
        <main className={styles.SetNewPasswordPage}>
            <FormContainer title="Востановление пароля" subtitle="Введите данные">
                <FormField label="Новый пароль:" type="password" />
                <FormField label="Повторите пароль:" type="password" />
                <FormButton>Подтвердить</FormButton>
            </FormContainer>
        </main>
    )
}

export default SetNewPasswordPage