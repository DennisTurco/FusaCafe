// components/HeroSection.tsx
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

  // Definisci lo stile inline per l'immagine di sfondo
  const heroSectionStyle = {
    backgroundImage: 'url("/images/banner2.jpg")', // Inserisci qui il tuo URL immagine
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh', // Altezza della hero section
    backgroundAttachment: 'fixed', // Effetto parallax

  };

  return (
    <section className={styles.heroSection} style={heroSectionStyle}>
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
