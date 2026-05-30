import styles from '../css/Error404Page.module.css'
import { Link } from 'react-router-dom'

function Error404Page() {
    return (
        <main className={styles.Error404Main}>
            <h1>404</h1>
            <h2>Страница не найдена.</h2>
            <p className={styles.Error404Par}>Данная страница либо никогда не существовала, либо была удалена.</p>
            
            <Link to="/" className={styles.LinkWrapper}>
                <button className={styles.ReturnButton}>Вернуться на главную</button>
            </Link>
            
        </main>
    )
}

export default Error404Page