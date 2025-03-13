import React from "react";
import Link from "next/link";
import Copyright from "./Copyright";
import { RiFacebookCircleLine, RiInstagramLine, RiTwitterLine } from "react-icons/ri";
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
                    priority
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
                <Link href="/"><RiTwitterLine size={32} className={styles.social_link} /></Link>
            </div>

            {/* Aggiunta del numero di telefono */}
            <div className="flex items-center gap-3 mt-3">
                <FaMobileAlt size={20} />
                <p className="text-lg">+39 1234567890</p>  {/* Modifica il numero con quello reale */}
            </div>

            {/* Aggiunta indirizzo */}
            <div className="flex items-center gap-3 mt-3">
                <FaLocationArrow size={20} />
                <p className="text-lg">Massimo D&apos;Azeglio 72/e Parma cap 43125</p>
            </div>

            <div className={styles.copyright_wrapper}>
                <Copyright />
            </div>
        </footer>
    );
};
