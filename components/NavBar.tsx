import { useState } from "react";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrFormClose } from "react-icons/gr";
import Image from "next/image";
import styles from "../styles/Navbar.module.scss";
import ChiamamiButton from "./ChiamamiButton";

export const Navbar: React.FC = () => {
    const [hamburgerClicked, setHamburgerClicked] = useState(false);

    return (
        <header className={styles.container}>
            <Link href="/" className={styles.logoContainer}>
                <Image 
                    src="/images/logo.png" 
                    alt="logo"
                    width={150} 
                    height={50} 
                    className={styles.logo} 
                />
                <span className={styles.logoText}>Fusa & Caffè</span>
            </Link>

            <div className={styles.link_container}>
                <Link href="/"> Home </Link>
                <Link href="/menu"> Menu </Link>
                <Link href="/gatti"> Gatti </Link>
                <ChiamamiButton />
            </div>

            {hamburgerClicked ? (
                <GrFormClose
                    className={styles.hamburger}
                    onClick={() => setHamburgerClicked(!hamburgerClicked)}
                />
            ) : (
                <GiHamburgerMenu
                    className={styles.hamburger}
                    onClick={() => setHamburgerClicked(!hamburgerClicked)}
                />
            )}

            <div
                className={`${styles.menu_container} ${hamburgerClicked ? styles.showMenu : ''}`}
            >
                <div className={styles.menu_links_container}>
                    <ChiamamiButton />
                    <Link href="/" onClick={() => setHamburgerClicked(false)}> Home </Link>
                    <Link href="/menu" onClick={() => setHamburgerClicked(false)}> Menu </Link>
                    <Link href="/gatti" onClick={() => setHamburgerClicked(false)}> Gatti </Link>
                </div>
            </div>
        </header>
    );
};
