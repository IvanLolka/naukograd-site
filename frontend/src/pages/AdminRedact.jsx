// AdminRedact.jsx
import { useState, useEffect } from 'react';
import styles from '../css/AdminRedact.module.css';

// === КОНСТАНТЫ: ИКОНКИ ===
const ICON_OPTIONS = [
  { label: 'мозг', value: '/icons/Brain.svg' },
  { label: 'кисточка', value: '/icons/Brush.svg' },
  { label: 'земля', value: '/icons/Earth.svg' },
  { label: 'шестерня', value: '/icons/Gear.svg' },
  { label: 'лист', value: '/icons/Leaf.svg' },
  { label: 'лампочка', value: '/icons/Light bulb.svg' },
  { label: 'лупа', value: '/icons/Magnifier.svg' },
  { label: 'фото', value: '/icons/Photo.svg' },
  { label: 'монитор', value: '/icons/Screen.svg' }
];

// === MOCK API (имитация бэкенда) ===
const mockAPI = {
  fetchData: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          events: [
            {
              id: 1,
              title: 'Учебный день',
              description: `· Длительность 4 академических часа\n\n· Экскурсия по музею "Авиация и космонавтика"\n\n· Профориентационный мастер-класс\n\n• 2 профильных мастер-класса по 45 минут на выбор`,
              icon: '/icons/Brain.svg'  // ← путь из БД
            },
            {
              id: 2,
              title: 'Открытая лекция',
              description: '· Введение в IT-профессии\n· Практикум по основам программирования',
              icon: '/icons/Light bulb.svg'
            }
          ],
          courses: [
            {
              id: 101,
              title: 'Основы аэродинамики',
              description: 'Курс для начинающих: теория полёта, расчёт траекторий, практические задачи',
              icon: '/icons/Earth.svg'
            }
          ]
        });
      }, 800);
    });
  },

  saveData: async (type, items) => {
    console.log(`[API] Сохраняем ${type} в БД:`, items);
    return new Promise(resolve => setTimeout(resolve, 500));
  },

  deleteItem: async (type, id) => {
    console.log(`[API] Удаляем ${type} с id=${id}`);
    return new Promise(resolve => setTimeout(resolve, 300));
  }
};

function AdminRedact() {
  const [events, setEvents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Загрузка данных
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await mockAPI.fetchData();
        setEvents(data.events);
        setCourses(data.courses);
        setError(null);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Обработчики изменений
  const handleEventChange = (id, field, value) => {
    setEvents(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleCourseChange = (id, field, value) => {
    setCourses(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // CRUD операции
  const handleAddEvent = () => {
    const newEvent = {
      id: Date.now(),
      title: '',
      description: '',
      icon: ICON_OPTIONS[0].value  // ← дефолтная иконка
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const handleAddCourse = () => {
    const newCourse = {
      id: Date.now(),
      title: '',
      description: '',
      icon: ICON_OPTIONS[0].value  // ← дефолтная иконка
    };
    setCourses(prev => [...prev, newCourse]);
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Удалить мероприятие?')) return;
    try {
      await mockAPI.deleteItem('event', id);
      setEvents(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Удалить курс?')) return;
    try {
      await mockAPI.deleteItem('course', id);
      setCourses(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await Promise.all([
        mockAPI.saveData('events', events),
        mockAPI.saveData('courses', courses)
      ]);
      alert('✅ Изменения сохранены!');
    } catch (err) {
      alert('❌ Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  // Loading / Error UI
  if (loading) {
    return (
      <main className={styles.AdminRedact}>
        <div className={styles.Loading}>Загрузка данных...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.AdminRedact}>
        <div className={styles.Error}>{error}</div>
      </main>
    );
  }

  // Render
  return (
    <main className={styles.AdminRedact}>
      <div className={styles.AdminRedactWrapper}>
        <h1 className={styles.AdminRedactTitle}>Админ редактирование</h1>
        
        <form className={styles.Form} onSubmit={handleSubmit}>
          
          {/* БЛОК: МЕРОПРИЯТИЯ */}
          <section className={styles.Block}>
            <div>
              <div className={styles.FlexLine}>
                <h2 className={styles.SectionTitle}>Мероприятия</h2>
                <p className={styles.Addbutton} onClick={handleAddEvent}>+ Добавить</p>
              </div>
              
              <div className={styles.OneBlock}>
                {events.map(event => (
                  <div key={event.id} className={styles.Fields}>
                    {/* ← ВЫБОР ИКОНКИ */}
                    <select
                      value={event.icon}
                      onChange={(e) => handleEventChange(event.id, 'icon', e.target.value)}
                      className={styles.Select}
                    >
                      {ICON_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={event.title}
                      onChange={(e) => handleEventChange(event.id, 'title', e.target.value)}
                      placeholder="Название мероприятия"
                      className={styles.Input}
                    />
                    <textarea
                      value={event.description}
                      onChange={(e) => handleEventChange(event.id, 'description', e.target.value)}
                      placeholder="Описание мероприятия"
                      className={styles.Textarea}
                      rows={6}
                    />
                    <div className={styles.Actions}>
                      <button 
                        type="button"
                        className={styles.DeleteSaveButton}
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
                {events.length === 0 && (
                  <p className={styles.Empty}>Нет мероприятий</p>
                )}
              </div>
            </div>
          </section>

          {/* БЛОК: КУРСЫ */}
          <section className={styles.Block}>
            <div>
              <div className={styles.FlexLine}>
                <h2 className={styles.SectionTitle}>Курсы</h2>
                <p className={styles.Addbutton} onClick={handleAddCourse}>+ Добавить</p>
              </div>
              
              <div className={styles.OneBlock}>
                {courses.map(course => (
                  <div key={course.id} className={styles.Fields}>
                    {/* ← ВЫБОР ИКОНКИ */}
                    <select
                      value={course.icon}
                      onChange={(e) => handleCourseChange(course.id, 'icon', e.target.value)}
                      className={styles.Select}
                    >
                      {ICON_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={course.title}
                      onChange={(e) => handleCourseChange(course.id, 'title', e.target.value)}
                      placeholder="Название курса"
                      className={styles.Input}
                    />
                    <textarea
                      value={course.description}
                      onChange={(e) => handleCourseChange(course.id, 'description', e.target.value)}
                      placeholder="Описание курса"
                      className={styles.Textarea}
                      rows={6}
                    />
                    <div className={styles.Actions}>
                      <button 
                        type="button"
                        className={styles.DeleteSaveButton}
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
                {courses.length === 0 && (
                  <p className={styles.Empty}>Нет курсов</p>
                )}
              </div>
            </div>
          </section>

          {/* КНОПКА СОХРАНЕНИЯ */}
          <button 
            type="submit" 
            className={styles.SaveAllButton}
            disabled={saving}
          >
            {saving ? 'Сохранение...' : 'Сохранить все изменения'}
          </button>

        </form>
      </div>
    </main>
  );
}

export default AdminRedact;