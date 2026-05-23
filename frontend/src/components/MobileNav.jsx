// components/MobileNav.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/MobileNav.module.css';

function MobileNav({ isOpen, onClose }) {
  // Закрытие при нажатии на оверлей (фон слева)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // запретить скролл при открытом меню
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = ''; // вернуть скролл
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.mobileNav}>
        <h2 className={styles.mobileNavTitle}>Навигация</h2>
        <nav className={styles.navList}>
          <Link className={styles.navListLink} to="/" onClick={onClose}>Главная</Link>
          <Link className={styles.navListLink} to="/CourseCatalog" onClick={onClose}>Курсы</Link>
          <Link className={styles.navListLink} to="/EventsCatalog" onClick={onClose}>Мероприятия</Link>
          <Link className={styles.navListLink} to="/contacts" onClick={onClose}>Личный кабинет</Link>
        </nav>
      </div>
    </div>
  );
}

export default MobileNav;