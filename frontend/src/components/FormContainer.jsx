import styles from '../css/FormContainer.module.css';

function FormContainer({ title, subtitle, children }) {
    return (
        <div className={styles.FormContainer}>
            <div className={styles.TitleBlock}>
                <h1 className={styles.Title}>{title}</h1>
                <h2 className={styles.Subtitle}>{subtitle}</h2>
            </div>
            
            <div className={styles.FormBody}>
                {children}
            </div>
        </div>
    );
}

export default FormContainer;