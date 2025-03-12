"use client";

import { useState, useEffect } from "react";
import styles from "/styles/Hero.module.scss";

const Hero = () => {
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);

    useEffect(() => {
        let frameId: number;

        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth - 0.5) * 30; // Più fluido, modifica "30" per più/meno movimento
            const y = (e.clientY / innerHeight - 0.5) * 30;

            // Utilizzo di requestAnimationFrame per un movimento più fluido
            frameId = requestAnimationFrame(() => {
                setOffsetX(x);
                setOffsetY(y);
            });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            // Cancella il frame attivo quando il componente viene smontato
            cancelAnimationFrame(frameId);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <section
            className={styles.heroSection}
            style={{
                backgroundImage: "url('/images/bannerv2.png')",
                backgroundPosition: `calc(50% + ${offsetX}px) calc(50% + ${offsetY}px)`,
            }}
        >
            <div className={styles.overlay}></div>
            <div className={styles.content}></div>
            <div className={styles.arrow} ><img src="/gifs/animation1.gif"></img></div>
        </section>
    );
};

export default Hero;
