import React from "react";
import Link from "next/link";
import { FaMobileAlt } from "react-icons/fa";
import styles from "../styles/HeroSection.module.scss";
import { FaChevronDown } from "react-icons/fa";

export const HeroSection = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        {/* Aggiungi la gif sopra la scritta principale */}
        <div className={styles.gifContainer}>
          <img src="/gifs/gattoCaffe.gif" alt="Gatto che beve caffè" className={styles.gifImage} />
        </div>

        {/* Testo centrato */}
        <div className={styles.textContainer}>
          <h1 className={styles.title}>Fusa & Caffè</h1>
          <div className={styles.phoneContainer}>
            <FaMobileAlt size={20} />
            <p className="text-lg">+39 1234567890</p>
          </div>
          <p className={styles.description}>
            Un angolo accogliente dove gustare il miglior caffè e rilassarti in compagnia dei nostri gatti.
          </p>
          <div className={styles.buttonsContainer}>
            <Link href="/Menu">
              <button className={styles.button}>Menu</button>
            </Link>
            <Link href="/Cats">
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
