import { motion } from "framer-motion";
import Image from "next/image";
import styles from "../styles/Why.module.scss";
import imageUrlBuilder from '@sanity/image-url';


const WhyCard = ({ title, image, description, altText, client }) => {
  const builder = imageUrlBuilder(client);
  const urlFor = (source) => builder.image(source).url();
  const imageUrl = urlFor(image.asset); // Ottieni la URL dell'immagine dal riferimento
  
  return (
    <div className={styles.container}>
      <div className={styles.image_box}>
        <Image src={imageUrl} alt={altText} width={300} height={200} className={styles.image} />
      </div>
      <div className={styles.text_content}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

const Why = ({ whyData, fadeIn, client }) => {
  return (
    <motion.section
      className={styles.why_container}
      initial="hidden"
      whileInView="visible"
      variants={fadeIn}
      viewport={{ once: true }}
    >
      <div className={styles.why_text_content}>
        <h2 className={styles.title}>{whyData.title}</h2>
        <p className={styles.text}>{whyData.description}</p>
      </div>
      <div className={styles.why_card_container}>
        {whyData.data.map((data, key) => (
          <WhyCard key={key} {...data} client={client} />
        ))}
      </div>
    </motion.section>
  );
};

export default Why;
