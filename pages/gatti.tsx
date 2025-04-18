import "/styles/global.scss"
import { Navbar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import Hero from "../components/Hero";
import CatsSection from "../components/CatsSection";
import PrenotaButtonOverlay from "../components/PrenotaButtonOverlay";
import { motion } from "framer-motion";
import { createClient } from "@sanity/client";

const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-03-10",
  useCdn: true,
});

export default function Cats() {
    return (
        <div className="">

            {/* Navbar */}
            <div><Navbar /></div>

            <PrenotaButtonOverlay />

            {/* Hero Section */}
            <section><Hero imagePath={'/images/catsBanner.webp'} title={""} /></section>

            {/* Menu list */}
            <motion.div initial="hidden" whileInView="visible" variants={fadeIn} viewport={{ once: true }}>
              <CatsSection client={client} />
            </motion.div>

            {/* Footer */}
            <div> <Footer /> </div>
        </div>
    );
}