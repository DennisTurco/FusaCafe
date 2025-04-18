import React from 'react';
import { FaMobileAlt } from "react-icons/fa";
import styles from "../styles/Buttons.module.scss";

const ContattamiButton = () => {
  const numeroTelefono = "+393276357910";

  return (
    <a href={`tel:${numeroTelefono}`} className={styles.button}>
      <FaMobileAlt size={15} style={{ marginRight: '8px' }} /> Chiamaci
    </a>
  );
};

export default ContattamiButton;