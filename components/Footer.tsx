import React from "react";
import Link from "next/link";
import Copyright from "./Copyright";
import { RiFacebookCircleLine, RiInstagramLine } from "react-icons/ri";
import { FaMobileAlt, FaLocationArrow } from "react-icons/fa";
import styles from "../styles/Footer.module.scss";
import Image from "next/image";

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <Link href="/" className="flex flex-col items-center"> 
                Fusa & Caffè
                <Image 
                    src="/images/logo.png" 
                    alt="logo" 
                    width={80} 
                    height={80}
                    className="max-w-[80px] mb-4" 
                    loading="lazy"
                    />
            </Link>

            <div className={styles.links_container}>
                <Link href="/">HOME</Link>
                <Link href="/menu">MENU</Link>
                <Link href="/gatti">GATTI</Link>
            </div>

            <div className={styles.social_container}>
                <Link href="/"><RiFacebookCircleLine size={32} className={styles.social_link} /></Link>
                <Link href="/"><RiInstagramLine size={32} className={styles.social_link} /></Link>
            </div>

            {/* Aggiunta del numero di telefono */}
            <div className="flex items-center gap-3 mt-3">
                <FaMobileAlt size={20} />
                <p className="text-lg">+39 123 456 7890</p>
            </div>

            {/* Aggiunta indirizzo */}
            <div className="flex items-center gap-3 mt-3">
                <FaLocationArrow size={20} />
                <p className="text-lg">Strada Massimo D&apos;Azeglio 72/E, 43125 Parma</p>
            </div>

            <div className={styles.copyright_wrapper}>
                <Copyright />
            </div>
        </footer>
    );
};
