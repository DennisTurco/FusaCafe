import React from "react";
import Link from "next/link"
import { FaChevronDown } from "react-icons/fa";
import Image from "next/image";
import styles from "../styles/HeroSection.module.scss";

export const HeroSection = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        {/* Aggiungi la gif sopra la scritta principale */}
        <div className={styles.gifContainer}>
          <Image
            src="/gifs/gattoCaffe.gif"
            alt="Gatto che beve caffè"
            className={styles.gifImage}
            width={400} 
            height={400} 
            loading="lazy"
          />
        </div>

        {/* Testo centrato */}
        <div className={styles.textContainer}>
          <h1 className={styles.title}>Fusa & Caffè</h1>
          <div className={styles.phoneContainer}>            
          </div>
          <p className={styles.description}>
            Un angolo accogliente dove gustare un buon caffè e rilassarti in compagnia dei nostri gatti.
          </p>
          <div className={styles.buttonsContainer}>
            <Link href="/menu">
              <button className={styles.button}>Menu</button>
            </Link>
            <Link href="/gatti">
              <button className={styles.button}>Gatti</button>
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.scrollDown}>
        <FaChevronDown />
      </div>
    </section>
  );
};

export default HeroSection;
