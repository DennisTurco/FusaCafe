import React from "react";
import styles from "../styles/Footer.module.scss";

const Copyright = () => {
  return (
    <div className={styles.copyright}>
      &copy; {new Date().getFullYear()} Tutti i diritti riservati |  
      <a href="https://www.shardpc.it/" target="blank" className={styles.copyrightLink}> Shard </a>
    </div>
  );
};

export default Copyright;
