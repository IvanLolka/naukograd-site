import { Card } from "../components/Card";
import styles from "../css/MainPage.module.css";

function MainPage() {

  return (
    <main className={styles.MainPage}>
      <h1 className={styles.PageTitle}>Детский технопарк «Наукоград»</h1>
      <p className={styles.ProjectDescription}>
        Детский технопарк «Наукоград» — это уникальное образовательное пространство для развития творчества, исследовательской и проектной деятельности молодежи в прогрессивном техническом направлении. Технопарк входит в сеть детских образовательных учреждений, курируемых Департаментом предпринимательства и инновационного развития города Москвы.
      </p>
      <p className={styles.ProjectDescription}>
        Обучение проходит в аудиториях детского технопарка, полностью оборудованных необходимой современной техникой и программным обеспечением. Наша образовательная среда помогает обретать знания учащимся разных возрастов!
      </p>
      <div className={styles.SiteCatalog}>
        <section className={styles.EventsSection}>
          <h2 className={styles.SectionTitle}>Мероприятия</h2>
          
          <div className={styles.CardsBlock}>
            {/* Карточки теперь прямые потомки сетки */}
            <Card icon={<img src="/icons/Light bulb.svg" alt="" />} title="Учебный день" />
            <Card icon={<img src="/icons/Magnifier.svg" alt="" />} title="Обзорная экскурсия" />
          </div>
        </section>

        <section className={styles.CoursesSection}>
          <h2 className={styles.SectionTitle}>Курсы</h2>

          <div className={styles.CardsBlock}>
            <Card icon={<img src="/icons/Brush.svg" alt="" />} title="Учебный день" />
            <Card icon={<img src="/icons/Brain.svg" alt="" />} title="Обзорная экскурсия" />
            <Card icon={<img src="/icons/Brain.svg" alt="" />} title="Учебный день" />
            <Card icon={<img src="/icons/Gear.svg" alt="" />} title="Обзорная экскурсия" />
            <Card icon={<img src="/icons/Screen.svg" alt="" />} title="Учебный день" />
            <Card icon={<img src="/icons/Photo.svg" alt="" />} title="Обзорная экскурсия" />
            <Card icon={<img src="/icons/Earth.svg" alt="" />} title="Учебный день" />
            <Card icon={<img src="/icons/Leaf.svg" alt="" />} title="Обзорная экскурсия" />
          </div>
        </section>
      </div>
    </main>
  );
}

export default MainPage;