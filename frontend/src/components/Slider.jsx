import { useRef, useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from '../css/Slider.module.css';

// 📌 Компонент принимает данные снаружи → работает на любой странице
export function ServiceSlider({ slides = [], slidesPerView = 1.08, spaceBetween = 16 }) {
  const swiperRef = useRef(null);
  const [current, setCurrent] = useState(1);
  const total = slides.length;

  // 🔹 Синхронизация высот (вызывается строго через события Swiper, без утечек)
  const syncHeights = useCallback(() => {
    const swiper = swiperRef.current;
    if (!swiper?.slides?.length) return;

    // 1. Сброс
    swiper.slides.forEach(slide => slide.style.height = 'auto');
    
    // 2. Поиск максимума
    let maxH = 0;
    swiper.slides.forEach(slide => {
      const h = slide.offsetHeight;
      if (h > maxH) maxH = h;
    });

    // 3. Применение
    if (maxH > 0) {
      swiper.slides.forEach(slide => slide.style.height = `${maxH}px`);
    }
  }, []);

  return (
    <div className={styles.SliderWrapper}>
      <div className={styles.Controls}>
        {/* Кнопка "Назад" — используем класс для селектора Swiper */}
        <button className={`${styles.SliderButton} ${styles.PrevButton}`} aria-label="Предыдущий слайд">
          <img src="/buttons/Arrow.svg" alt="prev" />
        </button>

        <Swiper
          ref={swiperRef}
          modules={[Navigation]}
          navigation={{
            prevEl: `.${styles.PrevButton}`,  // ✅ Селектор вместо ref
            nextEl: `.${styles.NextButton}`,
          }}
          spaceBetween={spaceBetween}
          slidesPerView={slidesPerView}
          centeredSlides={true}
          loop={false}
          slidesPerGroup={1}
          observer={true}
          observeParents={true}
          onSwiper={(sw) => (swiperRef.current = sw)}
          onInit={() => setTimeout(syncHeights, 50)}
          onResize={syncHeights}
          onSlideChange={(sw) => setCurrent(sw.realIndex + 1)}
          className={styles.Swiper}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className={styles.Slide}>
              <article className={styles.Card}>
                <h2 className={styles.Title}>{slide.title}</h2>
                <ul className={styles.CardDescription}>
                  {slide.points.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
                <div className={styles.PriceLine}>
                  <span className={styles.Price}>{slide.price} ₽/чел</span>
                  <button className={styles.ApplyButton}>Записаться</button>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Кнопка "Вперёд" — используем класс для селектора Swiper */}
        <button className={`${styles.SliderButton} ${styles.NextButton}`} aria-label="Следующий слайд">
          <img className={styles.Mirror} src="/buttons/Arrow.svg" alt="next" />
        </button>
      </div>

      <div className={styles.Counter}>
        {current} / {total}
      </div>
    </div>
  );
}