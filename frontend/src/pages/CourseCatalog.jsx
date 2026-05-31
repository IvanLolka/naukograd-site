import { Link } from "react-router-dom";
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

      <section className="CatalogSection">
        <h2 className="CatalogSectionTitle">Творчество и дизайн</h2> {/*берётся из бд*/}
        <p className="CatalogSectionContent"> {/*берётся из бд*/}
          Длительность 4 академических часов
          Экскурсия по музею “Авиация и космонавтика”
          Профориантационный мастер-класс
          2 профильных мастер-класса по 45 минут а выбор (экспериментальная химия/биологгический практикум/робототехника/беспилотные летательные аппараты/авиамоделирование/программирование/графический дизайн/живопись/мультипликация/финансовая грамотность)</p>
        <div className="PriceButtonBlock">
          <div className="PriceLine">
            <p>1000</p> {/*берётся из бд*/}
            <p>рублей</p>
          </div>
          <Link to="/BookingPage" className="CatalogSectionButton">Записаться</Link>
        </div>
      </section>
    </main>
  );
}

export default CourseCatalog;