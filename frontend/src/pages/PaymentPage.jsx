import styles from '../css/PaymentPage.module.css'
import FormContainer from '../components/FormContainer';
import FormField from '../components/FormField';
import FormButton from '../components/FormButton';

function PaymentPage() {
    return (
        <main className={styles.PaymentPage}>
            <FormContainer title="Оплата" subtitle="Введите данные карты">
                <FormField 
                    label="Номер карты:" 
                    type="text" 
                    name="cardNumber" 
                    maxLength="19" 
                />
                <FormField 
                    label="Год:" 
                    type="text" 
                    name="expYear" 
                    maxLength="2" 
                />
                <FormField 
                    label="CCV код:" 
                    type="password" 
                    name="cvv" 
                    maxLength="3" 
                />
                <FormField 
                    label="Почта:" 
                    type="email" 
                    name="email" 
                />
                <FormButton>Подтвердить</FormButton>
            </FormContainer>
        </main>
    )
}

export default PaymentPage