import { motion } from "framer-motion";
import styles from "../styles/Divider.module.scss";

const Divider = () => {
  return (
    <motion.div
      className={styles.divider}
      initial={{ width: 0 }}
      animate={{ width: "80%" }}
      transition={{ duration: 1 }}
    />
  );
};

export default Divider;