import { FaPaw } from "react-icons/fa";
import styles from "../styles/Regolamento.module.scss";

const Regolamento = () => {
    return (
      <section className={styles.regolamentoSection}>
        <h2 className={styles.title}><FaPaw size={20} />Regolamento della Casa</h2>
        <p className={styles.subtitle}>Per il benessere di tutti, seguiamo queste semplici regole:</p>
        <ul className={styles.rulesList}>
          <li>Igienizzate le mani all'ingresso.</li>
          <li>Se siete in gruppo, il tempo massimo di permanenza è di 50 minuti.</li>
          <li>Se volete fermarvi a studiare o lavorare più a lungo, informate il personale.</li>
          <li>Aiutateci a mantenere un ambiente sereno: evitate schiamazzi e movimenti bruschi.</li>
          <li>Scattate foto e condividetele, ma senza flash.</li>
          <li>I bambini sono i benvenuti, ma devono rispettare le regole e essere sorvegliati.</li>
          <li>Interagite con noi con delicatezza e rispettate i nostri tempi di gioco.</li>
          <li>Non dateci da mangiare: ci pensa il nostro sponsor!</li>
          <li>Per offrirci dei premietti, chiedete al personale.</li>
          <li>Usate i giochi a disposizione per divertirci, evitando di usare le mani.</li>
          <li>È richiesta una consumazione minima di 5 euro a persona.</li>
        </ul>
        <p className={styles.thankYou}>Grazie, con affetto i vostri mici 🐾</p>
      </section>
    );
  };
  
  export default Regolamento;