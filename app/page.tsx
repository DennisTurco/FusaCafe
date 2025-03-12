"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import Hero from "../components/Hero4";
import WhySection from "../components/Why";
import AboutSection from "../components/AboutSection";
import styles from "../styles/Home.module.scss";
import MapsPosition from "../components/MapsPosition";
import sanityClient from "@sanity/client";

const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-10',
  useCdn: true,
});

export default function HomePage() {
  const [aboutData, setAboutData] = useState(null);
  const [whyData, setWhyData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const about = await client.fetch(`*[_type == "aboutSection"][0]{ title, description, data[] { title, description, image { asset -> { url } } } }`);
        console.log(about);
        setAboutData(about);

        const why = await client.fetch(`*[_type == "whyData"][0]{ title, description, data }`);
        setWhyData(why);
      } catch (error) {
        console.error("Error fetching data from Sanity:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      
      <motion.section initial="hidden" whileInView="visible" variants={fadeIn} viewport={{ once: true }}>
        <Hero />
      </motion.section>

      {aboutData && (
        <motion.section initial="hidden" whileInView="visible" variants={fadeIn} viewport={{ once: true }}>
          <AboutSection aboutData={aboutData} fadeIn={fadeIn} />
        </motion.section>
      )}

      {whyData && (
        <motion.section className={styles.why_container} initial="hidden" whileInView="visible" variants={fadeIn} viewport={{ once: true }}>
          <WhySection whyData={whyData} fadeIn={fadeIn} client={client} />
        </motion.section>
      )}

      <motion.div initial="hidden" whileInView="visible" variants={fadeIn} viewport={{ once: true }}>
        <MapsPosition />
      </motion.div>

      <Footer />
    </div>
  );
}
