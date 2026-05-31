// components/MobileNav.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/MobileNav.module.css';

// 🔹 ТЕСТОВАЯ ПЕРЕМЕННАЯ — переключайте для проверки
const TEST_IS_ADMIN = true;

function MobileNav({ isOpen, onClose }) {
  // 🔹 В реальном проекте: брать из контекста аутентификации
  const isAdmin = TEST_IS_ADMIN;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.mobileNav}>
        <h2 className={styles.mobileNavTitle}>Навигация</h2>
        <nav className={styles.navList}>
          {isAdmin ? (
            // 👑 Админ-меню (2 ссылки)
            <>
              <Link className={styles.navListLink} to="/AdminRedact" onClick={onClose}>
                Редактирование
              </Link>
              <Link className={styles.navListLink} to="/AdminView" onClick={onClose}>
                Просмотр
              </Link>
            </>
          ) : (
            // 👤 Обычное меню (4 ссылки)
            <>
              <Link className={styles.navListLink} to="/" onClick={onClose}>
                Главная
              </Link>
              <Link className={styles.navListLink} to="/CourseCatalog" onClick={onClose}>
                Курсы
              </Link>
              <Link className={styles.navListLink} to="/EventsCatalog" onClick={onClose}>
                Мероприятия
              </Link>
              <Link className={styles.navListLink} to="/PersonalAccount" onClick={onClose}>
                Личный кабинет
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}

export default MobileNav;