"use client";

import styles from "/styles/Hero3.module.scss";
import { FaChevronDown } from "react-icons/fa";

const Hero = () => {
    return (
        <section
            className={styles.heroSection}>
            <div className={styles.overlay}></div>

            <div className={styles.heroContent}>
                <div className={styles.imageContainer}>
                    {/* L'immagine si trova qui, a sinistra */}
                    <img src="/gifs/catAnim.gif" alt="Hero Image" />
                </div>

                <div className={styles.description}>
                    <h1>Benvenuto nel nostro sito!</h1>
                    <p>
                        Scopri contenuti straordinari e goditi l'esperienza unica che ti offriamo.
                    </p>
                    <button className={styles.ctaButton}>Scopri di più</button>
                </div>
            </div>

            <div className={styles.scrollDown}>
                <FaChevronDown />
            </div>

        </section>
    );
};

export default Hero;
