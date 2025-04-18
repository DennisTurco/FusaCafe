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
                    src="/images/logo.webp" 
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
                <Link href="https://www.facebook.com/share/1BZ7GFqEjj/?mibextid=wwXIfr" target="blank">
                    <RiFacebookCircleLine size={32} className={styles.social_link} />
                </Link>
                <Link href="https://www.instagram.com/fusa_e_caffe/" target="blank">
                    <RiInstagramLine size={32} className={styles.social_link} />
                </Link>
            </div>

            <div className="flex items-center gap-3 mt-3">
                <FaMobileAlt size={20} />
                <p className="text-lg">+39 327 635 7910</p>
            </div>

            <div className="flex items-center gap-3 mt-3">
                <FaLocationArrow size={20} />
                <p className="text-lg">Strada Massimo D&apos;Azeglio 72/E, 43125 Parma</p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8 mt-6">
                <a href="https://www.caffevergnano.com" target="_blank" rel="noopener noreferrer">
                    <img 
                        src="https://caffevergnano-static.kxscdn.com/wp-content/uploads/2021/04/logo_vergnano.png" 
                        alt="Caffè Vergnano" 
                        className="h-12 md:h-16 transition-transform hover:scale-110"
                        loading="lazy"
                    />
                </a>
                <a href="https://www.exclusion.it" target="_blank" rel="noopener noreferrer">
                    <img 
                        src="https://exclusion.it/wp-content/uploads/2017/07/exclusion_logo_bianco.png" 
                        alt="Exclusion Pet Food" 
                        className="h-12 md:h-16 transition-transform hover:scale-110"
                        loading="lazy"
                    />
                </a>
            </div>

            <div className={styles.copyright_wrapper}>
                <Copyright />
            </div>
        </footer>
    );
};

export default Footer;