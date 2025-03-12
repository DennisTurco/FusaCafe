import { motion, Variants } from "framer-motion";
import Image from "next/image";
import styles from "../styles/Why.module.scss";
import imageUrlBuilder from "@sanity/image-url";
import { SanityClient } from "@sanity/client";

interface WhyRow {
  title: string;
  description: string;
  image: {
    asset: {
      _ref?: string;
      url?: string;
    };
  };
  altText: string;
}

interface WhyData {
  title: string;
  description: string;
  data: WhyRow[];
}

interface WhyCardProps {
  title: string;
  image: {
    asset: {
      _ref?: string;
      url?: string;
    };
  };
  description: string;
  altText: string;
  client: SanityClient;
}

const WhyCard: React.FC<WhyCardProps> = ({ title, image, description, altText, client }) => {
  const builder = imageUrlBuilder(client);
  const urlFor = (source: { asset: { _ref?: string; url?: string } }) => builder.image(source).url();
  const imageUrl = urlFor(image);

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

interface WhyProps {
  whyData: WhyData;
  fadeIn: Variants;
  client: SanityClient;
}

const Why: React.FC<WhyProps> = ({ whyData, fadeIn, client }) => {
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
