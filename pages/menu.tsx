"use client"
import { useState } from "react"
import "/styles/global.scss"
import { Navbar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import Hero from "../components/Hero";
import MenuSection from "../components/MenuSection";
import PrenotaButtonOverlay from "../components/PrenotaButtonOverlay";
import PinModal from "../components/PinModal"
import styles from "../styles/MenuPage.module.scss"
import { motion } from "framer-motion";
import { getSessionToken } from "../lib/session"

const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function Menu() {
    const [showPinModal, setShowPinModal] = useState(false)
    const [canOrder, setCanOrder] = useState(!!getSessionToken())

      function handleOrderClick() {
        if (!canOrder) {
          setShowPinModal(true)
        } else {
          // Ordine già sbloccato, qui potresti aprire carrello avanzato o checkout
        }
      }

    return (
        <div className="">

            {/* Navbar e overlay prenotazioni */}
            <div><Navbar /></div>
            <PrenotaButtonOverlay />


            {/* Hero Section */}
            <section><Hero imagePath={'/images/menuBanner.webp'} title={""} /></section>

            {/* Bottone per iniziare ordine / sbloccare PIN */}
            <div style={{ textAlign: "center", margin: "30px 0" }}>
              <button
                onClick={handleOrderClick}
                className={styles.orderButton}
              >
                {canOrder ? "Inizia Ordine" : "Ordina al Tavolo"}
              </button>
            </div>

            {/* Menu list */}
            <motion.div initial="hidden" whileInView="visible" variants={fadeIn} viewport={{ once: true }}>
              <MenuSection canOrder={canOrder}/>
            </motion.div>

            {/* Modal PIN */}
            {showPinModal && (
              <PinModal
                onSuccess={() => {
                  setCanOrder(true)
                  setShowPinModal(false)
                }}
                onClose={() => setShowPinModal(false)} // chiude modal senza PIN
              />
            )}

            {/* Footer */}
            <div> <Footer /> </div>
        </div>
    );
}




// "use client"
// import { useState } from "react"
// // 

// export default function Menu() {
//   return (
//     <div className="">
//       {/* Navbar e overlay prenotazioni */}
//       <Navbar />
//       <PrenotaButtonOverlay />

//       {/* Hero Section */}
//       <Hero imagePath="/images/menuBanner.webp" title="" />

//       {/* Bottone per iniziare ordine / sbloccare PIN */}
//       {/* <div style={{ textAlign: "center", margin: "30px 0" }}>
//         <button
//           onClick={handleOrderClick}
//           className={styles.orderButton}
//         >
//           {canOrder ? "Inizia Ordine" : "Sblocca Ordine"}
//         </button>
//       </div> */}

//       {/* Menù sempre visibile */}
//       {/* <MenuSection canOrder={canOrder} /> */}

//       {/* Modal PIN */}
//       {/* {showPinModal && (
//         <PinModal
//           onSuccess={() => {
//             setCanOrder(true)
//             setShowPinModal(false)
//           }}
//           onClose={() => setShowPinModal(false)} // chiude modal senza PIN
//         />
//       )} */}

//       <Footer />
//     </div>
//   )
// }
