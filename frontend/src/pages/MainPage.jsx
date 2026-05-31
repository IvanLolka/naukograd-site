import { useState, useEffect } from "react";
import { Card } from "../components/Card";
import styles from "../css/MainPage.module.css";

// 📦 Структура данных, которую обычно возвращает БД/API
const MOCK_EVENTS = [
  { id: "evt-1", title: "Учебный день", icon: "/icons/Light bulb.svg", slug: "uchebnyy-den" },
  { id: "evt-2", title: "Обзорная экскурсия", icon: "/icons/Magnifier.svg", slug: "obzorovaya-ekskursiya" },
];

const MOCK_COURSES = [
  { id: "crs-1", title: "Творчество и дизайн", icon: "/icons/Brush.svg", slug: "tvorchestvo-i-dizayn" },
  { id: "crs-2", title: "Разностороннее развитие", icon: "/icons/Brain.svg", slug: "raznostoronnee-razvitie" },
  { id: "crs-3", title: "Инженерия и Биотехнологии", icon: "/icons/Brain.svg", slug: "inzheneriya-i-biotekhnologii" },
  { id: "crs-4", title: "Робототехника и нейротехнологии", icon: "/icons/Gear.svg", slug: "robototekhnika-i-neyrotekhnologii" },
  { id: "crs-5", title: "Информационные технологии", icon: "/icons/Screen.svg", slug: "informatsionnye-tekhnologii" },
  { id: "crs-6", title: "Графический дизайн и видеопроизводство", icon: "/icons/Photo.svg", slug: "graficheskiy-dizayn-i-videoproizvodstvo" },
  { id: "crs-7", title: "Авиация и космонавтика", icon: "/icons/Earth.svg", slug: "aviatsiya-i-kosmonavtika" },
  { id: "crs-8", title: "Спортивная подготовка", icon: "/icons/Leaf.svg", slug: "sportivnaya-podgotovka" },
];

function MainPage() {
  const [events, setEvents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCardsData = async () => {
      try {
        setLoading(true);
        
        // 🔌 ЗДЕСЬ ПОДКЛЮЧАЕТСЯ РЕАЛЬНЫЙ ЗАПРОС К СЕРВЕРУ/БД
        // const res = await fetch("/api/main-page/cards");
        // if (!res.ok) throw new Error("Ошибка сети");
        // const data = await res.json();
        // setEvents(data.events);
        // setCourses(data.courses);

        // Имитация задержки (удалите при подключении реального API)
        await new Promise((resolve) => setTimeout(resolve, 600));
        setEvents(MOCK_EVENTS);
        setCourses(MOCK_COURSES);
      } catch (err) {
        setError("Не удалось загрузить данные. Попробуйте обновить страницу.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCardsData();
  }, []);

  if (loading) return <main className={styles.MainPage}><p>Загрузка данных...</p></main>;
  if (error) return <main className={styles.MainPage}><p className="error">{error}</p></main>;

  return (
    <main className={styles.MainPage}>
      <h1 className={styles.PageTitle}>Детский технопарк «Наукоград»</h1>
      <p className={`${styles.ProjectDescription} margin5pxV`}>
        Детский технопарк «Наукоград» — это уникальное образовательное пространство для развития творчества, исследовательской и проектной деятельности молодежи в прогрессивном техническом направлении. Технопарк входит в сеть детских образовательных учреждений, курируемых Департаментом предпрининательства и инновационного развития города Москвы.
      </p>
      <p className={`${styles.ProjectDescription} margin5pxV`}>
        Обучение проходит в аудиториях детского технопарка, полностью оборудованных необходимой современной техникой и программным обеспечением. Наша образовательная среда помогает обретать знания учащимся разных возрастов!
      </p>

      <div className={styles.SiteCatalog}>
        <section className={styles.EventsSection}>
          <h2 className={styles.SectionTitle}>Мероприятия</h2>
          <div className="CardsBlock">
            {events.map((evt) => (
              <Card
                key={evt.id}
                icon={<img src={evt.icon} alt="" />}
                title={evt.title}
                link={`/events/${evt.slug}`} // 📌 передаём ссылку или onClick в зависимости от API вашего Card
              />
            ))}
          </div>
        </section>

        <section className={styles.CoursesSection}>
          <h2 className={styles.SectionTitle}>Курсы</h2>
          <div className="CardsBlock">
            {courses.map((crs) => (
              <Card
                key={crs.id}
                icon={<img src={crs.icon} alt="" />}
                title={crs.title}
                link={`/courses/${crs.slug}`}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default MainPage;