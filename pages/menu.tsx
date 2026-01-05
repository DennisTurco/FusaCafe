"use client"

import { useEffect, useState } from "react"
import "/styles/global.scss"
import { Navbar } from "../components/NavBar"
import { Footer } from "../components/Footer"
import Hero from "../components/Hero"
import MenuSection from "../components/MenuSection"
import PrenotaButtonOverlay from "../components/PrenotaButtonOverlay"
import PinModal from "../components/PinModal"
import styles from "../styles/MenuPage.module.scss"
import { motion } from "framer-motion"
import { getSessionToken, clearSessionToken } from "../lib/session"

export default function Menu() {
  const [showPinModal, setShowPinModal] = useState(false)
  const [canOrder, setCanOrder] = useState(false)

  useEffect(() => {
  async function checkSession() {
    const token = getSessionToken()

    if (!token) {
      setCanOrder(false)
      return
    }

    try {
      const res = await fetch("/api/check-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      })

      const data = await res.json()

      if (res.ok && data.valid) {
        setCanOrder(true)
      } else {
        clearSessionToken()
        setCanOrder(false)
      }
    } catch (err) {
      console.error("Errore verifica sessione:", err)
      setCanOrder(false)
    }
  }

  checkSession()
}, [])

  function handleOrderClick() {
    if (!canOrder) {
      setShowPinModal(true)
    }
  }

  return (
    <div>
      <Navbar />
      <PrenotaButtonOverlay />

      <section>
        <Hero imagePath="/images/menuBanner.webp" title="" />
      </section>

      <div style={{ textAlign: "center", margin: "30px 0" }}>
        {!canOrder && (
          <button
            onClick={handleOrderClick}
            className={styles.orderButton}
          >
            Ordina al Tavolo
          </button>
        )}
      </div>

      <motion.div initial="hidden" whileInView="visible">
        <MenuSection canOrder={canOrder} />
      </motion.div>

      {showPinModal && (
        <PinModal
          onSuccess={() => {
            setCanOrder(true)
            setShowPinModal(false)
          }}
          onClose={() => setShowPinModal(false)}
        />
      )}

      <Footer />
    </div>
  )
}
