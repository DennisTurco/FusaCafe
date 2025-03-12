import styles from "../styles/Navbar.module.scss";
import React, { useState } from "react";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrFormClose } from "react-icons/gr";

export const Navbar: React.FC = () => {
    const [hamburgerClicked, setHamburgerClicked] = useState(false);

    return (
        <header className={styles.container}>
            <Link href="/" className={styles.logoContainer}>
                <img src="/images/logo.png" alt="logo" className={styles.logo} />
                <span className={styles.logoText}>Fusa & Caffè</span>
            </Link>

            <div className={styles.link_container}>
                <Link href="/"> Home </Link>
                <Link href="/Menu"> Menu </Link>
                <Link href="/Cats"> Gatti </Link>
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
                    <Link href="/" onClick={() => setHamburgerClicked(false)}> Home </Link>
                    <Link href="/Menu" onClick={() => setHamburgerClicked(false)}> Menu </Link>
                    <Link href="/Cats" onClick={() => setHamburgerClicked(false)}> Gatti </Link>
                </div>
            </div>
        </header>
    );
};
