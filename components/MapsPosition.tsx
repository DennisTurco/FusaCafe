import styles from "../styles/MapsPosition.module.scss";

const MapsPosition = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <h3 className={styles.title}>Vieni a trovarci!</h3>
        <p className={styles.text}>Il nostro CatCaffè è situato in Strada Massimo D&apos;Azeglio 72/e, 43125 Parma PR.</p>
        <div className={styles.mapContainer}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d210.40739024735052!2d10.317619564944055!3d44.803366708887864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47806afa6fa652e3%3A0xa0b70bc95f985623!2sStrada%20Massimo%20D&#39;Azeglio%2C%2072%2C%2043125%20Parma%20PR!5e0!3m2!1sit!2sit!4v1741605278447!5m2!1sit!2sit"
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
            className={styles.mapIframe}
          ></iframe>
        </div>
      </div>
    </footer>
  );
};

export default MapsPosition;
