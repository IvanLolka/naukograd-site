// components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MobileNav from './MobileNav.jsx';
import styles from '../css/Header.module.css';

// 🔹 ТЕСТОВАЯ ПЕРЕМЕННАЯ — заменить на реальный источник (Context, Redux, API)
// В реальном проекте: получать из authContext.isAuthenticated или localStorage
const TEST_IS_AUTHENTICATED = false; // переключите на true для теста

function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(TEST_IS_AUTHENTICATED);
  const navigate = useNavigate();

  // 🔹 Эффект для "реального" сценария: проверка авторизации при монтировании
  // В продакшене здесь будет проверка токена / запрос к бэкенду
  useEffect(() => {
    // Пример для будущего:
    // const token = localStorage.getItem('authToken');
    // if (token) validateToken(token).then(setIsAuthenticated);
    
    // Пока используем тестовое значение
    setIsAuthenticated(TEST_IS_AUTHENTICATED);
  }, []);

  const handleLogout = () => {
    // 🔹 Здесь будет реальная логика выхода:
    // - очистка токена: localStorage.removeItem('authToken')
    // - сброс состояния: authContext.logout()
    // - редирект: navigate('/')
    
    console.log('🔐 Выход из системы (тест)');
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleLoginClick = (e) => {
    // Можно добавить логику перед переходом на страницу входа
    if (isAuthenticated) {
      e.preventDefault();
      handleLogout();
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerLine}>
          <div className={styles.headerLeftBlock}>
            <Link to="/" className={styles.logo}>
              <img src='/logo/Логотип.svg' alt="Логотип Наукоград" />
              <span className={styles.siteName}>Наукоград</span>
            </Link>
          </div>

          <div className={styles.headerRightBlock}>
            {isAuthenticated ? (
              // 👤 Авторизован: показываем "Выйти"
              <button 
                onClick={handleLogout} 
                className={styles.loginButton}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit' }}
              >
                Выйти
              </button>
            ) : (
              // 👤 Не авторизован: показываем "Войти"
              <Link 
                to="/AuthPage" 
                className={styles.loginButton}
                onClick={handleLoginClick}
              >
                Войти
              </Link>
            )}
            
            <img
              className={styles.burgerButton}
              src="/icons/Бургер меню.svg"
              alt="Меню"
              onClick={() => setIsNavOpen(true)}
            />
          </div>
        </div>
      </header>

      <MobileNav
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        // 🔹 Можно передать isAuthenticated, если в мобильном меню нужна авторизация
        // isAuthenticated={isAuthenticated}
      />
    </>
  );
}

export default Header;