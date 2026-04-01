import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/CookieBanner.module.scss";

export const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.banner}>
      <p>
        Questo sito utilizza cookie per migliorare l&apos;esperienza utente.{" "}
        <Link href="/cookie">Maggiori informazioni</Link>
      </p>
      <button onClick={acceptCookies}>Accetta</button>
    </div>
  );
};