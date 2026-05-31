import { useState } from 'react';
import styles from '../css/BookingPage.module.css';
import formFieldStyles from '../css/FormField.module.css'; // ✅ импортируем стили FormField
import FormContainer from '../components/FormContainer';
import FormField from '../components/FormField';
import FormButton from '../components/FormButton';
import clsx from 'clsx';

const childOptions = [
  { value: '', label: 'Выберите ребёнка', disabled: true },
  { value: 'ivanov_ivan', label: 'Иванов Иван Иванович' },
  { value: 'petrova_anna', label: 'Петрова Анна Сергеевна' },
  { value: 'sidorov_alex', label: 'Сидоров Алексей Дмитриевич' },
];

function BookingPage() {
  const [selectedChild, setSelectedChild] = useState('');

  return (
    <main className={styles.BookingPage}>
      <FormContainer title="Записаться" subtitle="Название курса">
        <FormField label="ФИО родителя:" type="text" />
        <FormField label="Номер телефона родителя:" type="tel" />
        <FormField label="Электронная почта родителя:" type="email" />

        {/* ✅ Выпадающий список с теми же стилями, что и FormField */}
        <div className={formFieldStyles.FormField}>
          <label className={formFieldStyles.Title} htmlFor="childSelect">
            ФИО ребёнка:
          </label>
          <select
            id="childSelect"
            className={formFieldStyles.Input}
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
          >
            {childOptions.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <p className={clsx(styles.ConsentText, 'margin5pxH')}>
          Нажимая кнопку «Записаться» вы подтверждаете, что согласились на обработку персональных данных.
        </p>
        <a className={clsx(styles.DocumentLink, 'margin5pxH')} href="/privacy">
          Политика конфиденциальности
        </a>
        <FormButton>Записаться</FormButton>
      </FormContainer>
    </main>
  );
}

export default BookingPage;