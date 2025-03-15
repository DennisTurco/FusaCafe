import { motion, Variants } from "framer-motion";
import Image from "next/image";
import styles from "../styles/Why.module.scss";
import imageUrlBuilder from "@sanity/image-url";
import { SanityClient } from "@sanity/client";
import { WhyData } from "../components/types";

interface WhyCardProps {
  title: string;
  image?: {
    asset?: { 
      _ref?: string;
      url?: string;
    };
  };
  description: string;
  altText?: string; 
  client: SanityClient;
}

const WhyCard: React.FC<WhyCardProps> = ({ title, image, description, altText, client }) => {
  const builder = imageUrlBuilder(client);

  const urlFor = (source: { asset?: { _ref?: string; url?: string } }) => {
    if (source.asset?._ref) {
      const imageUrl = builder.image(source).url();
      return imageUrl;
    }
    console.log("No URL or _ref found in the asset");
    return "";  
  };

  const imageUrl = image ? urlFor(image) : "";

  console.log("Image URL in WhyCard: ", imageUrl);  // Log the image URL for debugging

  return (
    <div className={styles.container}>
      <div className={styles.image_box}>
        {imageUrl ? (
          <Image src={imageUrl} alt={altText || "Image"} width={250} height={170} className={styles.image} loading="lazy" />
        ) : (
          <div>No Image Available</div>
        )}
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
