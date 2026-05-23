import styles from '../css/FormButton.module.css';

function FormButton({ children, onClick, type = "button" }) {
    return (
        <button 
            className={styles.FormButton} 
            onClick={onClick}
            type={type}
        >
            {children}
        </button>
    );
}

export default FormButton;