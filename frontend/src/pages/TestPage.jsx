import styles from '../css/TestPage.module.css';
import FormContainer from '../components/FormContainer';
import FormField from '../components/FormField';
import FormButton from '../components/FormButton';

function TestPage() {
    return (
        <main className={styles.TestWrapper}>
            {/* 1. Форма Входа */}
            <FormContainer title="Авторизация" subtitle="Введите данные">
                <FormField label="Почта:" type="email" />
                <FormField label="Пароль:" type="password" />
                <FormField label="Повторите пароль:" type="password" />
                <FormButton>Зарегистрироваться</FormButton>
            </FormContainer>

            {/*
            <FormContainer title="Регистрация" subtitle="Создайте аккаунт">
                <FormField label="Почта:" type="email" />
                <FormField label="Пароль:" type="password" />
                <FormField label="Повторите пароль:" type="password" />
                <FormButton>Зарегистрироваться</FormButton>
            </FormContainer>


            <FormContainer title="Записаться" subtitle="Театр моды">
                <FormField label="ФИО родителя:" />
                <FormField label="Номер телефона:" />
                <FormField label="ФИО ребенка:" />
                <FormField label="Дата рождения:" type="date" />
                <FormButton>Записаться</FormButton>
            </FormContainer>*/}
        </main>
    );
}

export default TestPage;