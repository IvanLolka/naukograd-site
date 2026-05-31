import { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from "../css/PersonalAccount.module.css";

// Начальные данные (в реальном проекте придут из БД)
const INITIAL_CHILDREN = [
  {
    id: 1,
    fio: "Терешков Артём Петров",
    age: "12",
    grade: "7",
    school: "Школа №123"
  }
];

const EMPTY_CHILD = {
  fio: "",
  age: "",
  grade: "",
  school: ""
};

function PersonalAccount() {
  const [children, setChildren] = useState(INITIAL_CHILDREN);
  
  // Состояния для редактирования
  const [editingId, setEditingId] = useState(null);
  const [draftChild, setDraftChild] = useState(null);
  
  // Состояния для добавления
  const [isAdding, setIsAdding] = useState(false);
  const [newChild, setNewChild] = useState(EMPTY_CHILD);
  
  // Общие состояния
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // === РЕДАКТИРОВАНИЕ ===
  const handleEdit = (child) => {
    setEditingId(child.id);
    setDraftChild({ ...child });
    setIsAdding(false);
    setSaveMessage('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDraftChild(null);
  };

  const handleEditChange = (field, value) => {
    setDraftChild(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      setChildren(prev => prev.map(child => 
        child.id === editingId ? { ...child, ...draftChild } : child
      ));
      setIsSaving(false);
      setEditingId(null);
      setDraftChild(null);
      setSaveMessage('Данные успешно сохранены');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 1000);
  };

  // === ДОБАВЛЕНИЕ ===
  const handleAdd = () => {
    setIsAdding(true);
    setNewChild({ ...EMPTY_CHILD });
    setEditingId(null);
    setSaveMessage('');
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewChild(EMPTY_CHILD);
  };

  const handleAddChange = (field, value) => {
    setNewChild(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveNew = () => {
    // Простая валидация
    if (!newChild.fio.trim()) {
      setSaveMessage('Укажите ФИО ребёнка');
      return;
    }
    
    setIsSaving(true);
    
    setTimeout(() => {
      const newId = Math.max(0, ...children.map(c => c.id)) + 1;
      setChildren(prev => [...prev, { ...newChild, id: newId }]);
      setIsSaving(false);
      setIsAdding(false);
      setNewChild(EMPTY_CHILD);
      setSaveMessage('Ребёнок успешно добавлен');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 1000);
  };

  return (
    <main className={styles.PersonalAccount}>
      <div className={styles.PersonalAccountWrapper}>
        <h1 className={styles.PersonalAccountTitle}>Личный кабинет</h1>
        <section className={styles.FirstSection}>
          
          {/* Профиль родителя */}
          <div className={clsx(styles.Block, styles.FlexLine, styles.ParentChange)}>
            <div className={styles.ProfileBlock}>
              <div className={styles.ProfileIcon}>Т</div>
              <div>
                <h2 className={styles.TitleFIO}>Терешкова Анна Петровна</h2>
                <p className={styles.AccountType}>Родитель</p>
              </div>
            </div>
          </div>

          {/* БЛОК ДЕТЕЙ */}
          <div className={styles.Block}>
            <div className={styles.ChildrenTitleLine}>
              <h3 className={styles.ChildrenTitle}>Дети</h3>
              <div className={styles.ChildrenActions}>
                {!isAdding && !editingId && (
                  <>
                    <p className={styles.ChildrenAddButton} onClick={handleAdd}>Добавить</p>
                    <span className={styles.ActionsSeparator}>|</span>
                  </>
                )}
                {!isAdding && !editingId && (
                  <p className={styles.ChildrenChangeButton} onClick={() => children[0] && handleEdit(children[0])}>
                    Изменить
                  </p>
                )}
              </div>
            </div>

            {/* РЕЖИМ ДОБАВЛЕНИЯ */}
            {isAdding && (
              <div className={styles.RedBlock}>
                <h4 className={styles.ChildrenFIO}>Новый ребёнок</h4>
                <input
                  type="text"
                  className={styles.InputField}
                  value={newChild.fio}
                  onChange={(e) => handleAddChange('fio', e.target.value)}
                  placeholder="ФИО ребёнка *"
                />
                <div className={styles.ChildrenDataLine}>
                  <input
                    className={styles.InputFieldSmall}
                    type="text"
                    inputMode="numeric"
                    value={newChild.age}
                    onChange={(e) => handleAddChange('age', e.target.value)}
                    placeholder="Возраст"
                  />
                  <p className={styles.ChildrenDataText}>лет</p>
                  <input
                    className={styles.InputFieldSmall}
                    type="text"
                    inputMode="numeric"
                    value={newChild.grade}
                    onChange={(e) => handleAddChange('grade', e.target.value)}
                    placeholder="Класс"
                  />
                  <p className={styles.ChildrenDataText}>класс</p>
                  <input
                    className={styles.InputFieldSchool}
                    type="text"
                    value={newChild.school}
                    onChange={(e) => handleAddChange('school', e.target.value)}
                    placeholder="Школа"
                  />
                </div>
                <div className={styles.EditActions}>
                  <button
                    type="button"
                    className={clsx(styles.Button, styles.Blue, styles.SmallButton)}
                    onClick={handleCancelAdd}
                    disabled={isSaving}
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    className={clsx(styles.Button, styles.Orange, styles.SmallButton)}
                    onClick={handleSaveNew}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Сохранение...' : 'Добавить'}
                  </button>
                </div>
              </div>
            )}

            {/* РЕЖИМ ПРОСМОТРА / РЕДАКТИРОВАНИЯ */}
            {!isAdding && children.map((child) => (
              <div key={child.id} className={styles.RedBlock}>
                {editingId === child.id ? (
                  <>
                    <input
                      type="text"
                      className={styles.InputField}
                      value={draftChild?.fio || ''}
                      onChange={(e) => handleEditChange('fio', e.target.value)}
                      placeholder="ФИО ребёнка"
                    />
                    <div className={styles.ChildrenDataLine}>
                      <input
                        className={styles.InputFieldSmall}
                        type="text"
                        inputMode="numeric"
                        value={draftChild?.age || ''}
                        onChange={(e) => handleEditChange('age', e.target.value)}
                      />
                      <p className={styles.ChildrenDataText}>лет *</p>
                      <input
                        className={styles.InputFieldSmall}
                        type="text"
                        inputMode="numeric"
                        value={draftChild?.grade || ''}
                        onChange={(e) => handleEditChange('grade', e.target.value)}
                      />
                      <p className={styles.ChildrenDataText}>класс *</p>
                      <input
                        className={styles.InputFieldSchool}
                        type="text"
                        value={draftChild?.school || ''}
                        onChange={(e) => handleEditChange('school', e.target.value)}
                        placeholder="Школа"
                      />
                    </div>
                    <div className={styles.EditActions}>
                      <button
                        type="button"
                        className={clsx(styles.Button, styles.Blue, styles.SmallButton)}
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                      >
                        Отмена
                      </button>
                      <button
                        type="button"
                        className={clsx(styles.Button, styles.Orange, styles.SmallButton)}
                        onClick={handleSaveEdit}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Сохранение...' : 'Сохранить'}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className={styles.ChildrenFIO}>{child.fio}</h4>
                    <div className={styles.ChildrenDataLine}>
                      <p className={styles.ChildrenDataText}>{child.age}</p>
                      <p className={styles.ChildrenDataText}>лет *</p>
                      <p className={styles.ChildrenDataText}>{child.grade}</p>
                      <p className={styles.ChildrenDataText}>класс *</p>
                      <p className={styles.ChildrenDataText}>{child.school}</p>
                    </div>
                    {/* Кнопка редактирования для каждого ребёнка (опционально) */}
                    <div className={styles.ChildEditLink}>
                      <span onClick={() => handleEdit(child)} className={styles.EditInline}>✎ Редактировать</span>
                    </div>
                  </>
                )}
              </div>
            ))}

            {saveMessage && <p className={styles.SaveMessage}>{saveMessage}</p>}
          </div>

          {/* Записи и уведомления (без изменений) */}
          <div className={clsx(styles.Block, styles.FlexList)}>
            <h3 className={styles.Records}>Записи</h3>
            <div className={styles.RedBlock}>
              <h4 className={styles.RecordTitle}>Роботехника</h4>
            </div>
          </div>
          <div className={clsx(styles.Block, styles.FlexList)}>
            <h3 className={styles.Records}>Уведомления</h3>
            <div className={clsx(styles.RedBlock, styles.FlexLine)}>
              <p className={clsx(styles.RecordTitle, styles.UnderLine)}>26.06.2026</p>
              <p className={styles.RecordTitle}>занятия по</p>
              <p className={styles.RecordTitle}>Робототехника</p>
            </div>
          </div>
        </section>

        {/* Кнопки действий (без изменений) */}
        <section className={clsx(styles.ButtonSection, styles.FlexList)}>
          <Link to="/AuthPage">
            <button className={clsx(styles.Button, styles.Orange)}>Записаться на курс</button>
          </Link>
          <Link to="/RegistPage">
            <button className={clsx(styles.Button, styles.Orange)}>Записаться на мероприятие</button>
          </Link>
          <button className={clsx(styles.Button, styles.Blue)}>Поддержка и помощь</button>
        </section>
      </div>
    </main>
  );
}

export default PersonalAccount;