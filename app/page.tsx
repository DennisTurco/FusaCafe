'use client'
import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Navbar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import Hero from "../components/HeroSection2";
import WhySection from "../components/Why";
import AboutSection from "../components/AboutSection";
import styles from "../styles/Home.module.scss";
import MapsPosition from "../components/MapsPosition";
import Regolamento from "../components/Regolamento";
import { createClient } from "@sanity/client";
import { WhyData } from "../components/types";
import ContactSection from "../components/ContactSection";
import PrenotaButtonOverlay from "../components/PrenotaButtonOverlay";

interface AboutRow {
  title: string;
  description: string;
  image?: {
    asset?: {
      url: string;
    };
  };
}

interface AboutData {
  title: string;
  description: string;
  data: AboutRow[];
}

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-03-10",
  useCdn: true,
});

export default function HomePage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [whyData, setWhyData] = useState<WhyData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const about = await client.fetch<AboutData>(
          `*[_type == "aboutSection"][0]{ title, description, data[] { title, description, image { asset -> { url } } } }`
        );
        setAboutData(about);
  
        const why = await client.fetch<WhyData>(
          `*[_type == "whyData"][0]{ title, description, data }`
        );
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

      <PrenotaButtonOverlay />

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
        <Regolamento />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" variants={fadeIn} viewport={{ once: true }}>
        <ContactSection />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" variants={fadeIn} viewport={{ once: true }}>
        <MapsPosition />
        <Footer />
      </motion.div>

      
    </div>
  );
}
