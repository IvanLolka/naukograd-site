import { Card } from "../components/Card";
import styles from "../css/CourseCatalog.module.css";

function CourseCatalog() {

  return (
    <main className={styles.CourseCatalog}>
      <h1 className={styles.PageTitle}>Курсы</h1>
      <p className={`${styles.CourseDescription} margin5pxV`}>
        Практико-ориентированные курсы
      </p>
      <p className={`${styles.CourseDescription} margin5pxV`}>
        Детский технопарк МФЮА-МАСИ «Наукоград» - это отличная возможность для детей раскрыть свой потенциал, развить творческие способности и логическое мышление, а также подготовиться к будущим профессиональным вызовам.
      </p>
      <p className={`${styles.CourseDescription} margin5pxV`}>
        Образовательные программы курсов направлены на освоение детьми современных технологий, которые могут быть полезными как в повседневной жизни, так и в будущей профессиональной деятельности, а также формирование интереса к науке и технике и мотивированию детей к самостоятельному изучению новых тем и развитию своих талантов. 
      </p>
      <div className={styles.SiteCatalog}>
        <section className={styles.CoursesSection}>
          <h2 className={styles.SectionTitle}>Курсы</h2>

          <div className="CardsBlock">
            <Card icon={<img src="/icons/Brush.svg" alt="" />} title="Творчество и дизайн" />
            <Card icon={<img src="/icons/Brain.svg" alt="" />} title="Разностороннее развитие" />
            <Card icon={<img src="/icons/Brain.svg" alt="" />} title="Инженерия и Биотехнологии" />
            <Card icon={<img src="/icons/Gear.svg" alt="" />} title="Робототехника и нейротехнологии" />
            <Card icon={<img src="/icons/Screen.svg" alt="" />} title="Информационные технологии" />
            <Card icon={<img src="/icons/Photo.svg" alt="" />} title="Графический дизайн и видеопроизводство" />
            <Card icon={<img src="/icons/Earth.svg" alt="" />} title="Авиация и космонавтика" />
            <Card icon={<img src="/icons/Leaf.svg" alt="" />} title="Спортивная подготовка" />
          </div>
        </section>
      </div>
    </main>
  );
}

export default CourseCatalog;