import styles from '../css/VerifyCodePage.module.css'
import FormContainer from '../components/FormContainer';
import FormField from '../components/FormField';
import FormButton from '../components/FormButton';
import clsx from 'clsx';

function VerifyCodePage() {
    return (
        <main className={styles.VerifyCodePage}>
            <FormContainer title="Востановление пароля" subtitle="Введите данные">
                <p className='margin5pxH'>Сейчас вам на почту придёт код, введите его</p>
                <p className={clsx(styles.AgainLink, 'margin5pxH')}>Отправить ещё раз</p>
                <FormField label="Код подтверждения:" type="text" />
                <FormButton>Востановить пароль</FormButton>
            </FormContainer>
        </main>
    )
}

export default VerifyCodePage