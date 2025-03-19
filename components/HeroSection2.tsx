import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import styles from '../styles/HeroSection2.module.scss';
import { FaChevronDown } from "react-icons/fa";
import Link from 'next/link';

const HeroSection = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <section className={styles.heroSection}>
      {/* Div separato per lo sfondo */}
      <div className={styles.heroBackground}></div>

      <h1
        data-aos="slide-up"
        data-aos-offset="120"
        data-aos-delay="0"
        data-aos-duration="400"
        data-aos-easing="ease-in-out"
        data-aos-once="true"
        className={styles.title}
      >
        Fusa & Caffè
      </h1>

      <div
        data-aos="slide-up"
        data-aos-offset="120"
        data-aos-delay="50"
        data-aos-duration="400"
        data-aos-easing="ease-in-out"
        data-aos-once="true"
        className={styles.subtitle}
      >
        Un angolo accogliente dove gustare un buon caffè e rilassarti in compagnia dei nostri gatti.
      </div>

      <div className={styles.ctaWrapper}>
        <span
          data-aos="slide-up"
          data-aos-offset="120"
          data-aos-delay="150"
          data-aos-duration="400"
          data-aos-easing="ease-in-out"
          data-aos-once="true"
        >
          <Link href="/menu">
            <button className={styles.button}>Menu</button>
          </Link>
          <Link href="/gatti">
            <button className={styles.button}>Gatti</button>
          </Link>
        </span>
      </div>

      <div className={styles.scrollDown}>
        <FaChevronDown />
      </div>
    </section>
  );
};

export default HeroSection;
