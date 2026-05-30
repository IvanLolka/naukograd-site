import styles from '../css/BookingPage.module.css'
import FormContainer from '../components/FormContainer';
import FormField from '../components/FormField';
import FormButton from '../components/FormButton';
import clsx from 'clsx';

function BookingPage() {
    return (
        <main className={styles.BookingPage}>
            <FormContainer title="Записаться" subtitle="Название курса">
                <FormField label="ФИО родителя:" type="text" />
                <FormField label="Номер телефона родителя:" type="tel" />
                <FormField label="Электронная почта родителя:" type="email" />
                <FormField label="ФИО ребёнка:" type="text" />
                <p className={clsx(styles.ConsentText, 'margin5pxH')}>
                    Нажимая кнопку «Записаться» вы подтверждаете, что согласились на обработку персональных данных.
                </p>
                <a className={clsx(styles.DocumentLink, 'margin5pxH')} href="/privacy">
                    Политика конфиденциальности
                </a>
                <FormButton>Записаться</FormButton>
            </FormContainer>
        </main>
    )
}

export default BookingPage