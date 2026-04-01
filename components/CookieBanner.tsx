"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/CookieBanner.module.scss";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "accepted");

    window.dispatchEvent(new Event("cookieAccepted"));

    setVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("cookie_consent", "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.banner}>
      <p>
        Questo sito utilizza cookie tecnici e analitici previo consenso.
        <Link href="/cookie"> Cookie Policy</Link>
      </p>

      <div className={styles.buttons}>
        <button onClick={acceptCookies}>Accetta</button>
        <button onClick={rejectCookies}>Rifiuta</button>
      </div>
    </div>
  );
}