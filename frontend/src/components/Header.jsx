// components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MobileNav from './MobileNav.jsx';
import styles from '../css/Header.module.css';

function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);

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
            <Link to="/authorization" className={styles.loginButton}>
              Войти
            </Link>
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
      />
    </>
  );
}

export default Header;