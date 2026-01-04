"use client"
import { useState } from "react"
import styles from "../styles/PinModal.module.scss"
import { setSessionToken } from "@/lib/session"

export default function PinModal({
  onSuccess,
  onClose, // nuova prop per chiudere il modal
}: {
  onSuccess: () => void
  onClose: () => void
}) {
  const [pin, setPin] = useState("")
  const [table, setTable] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit() {
    setError("")

    const res = await fetch("/api/verify-pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin, tableNumber: Number(table) }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "PIN non valido")
      return
    }

    setSessionToken(data.token)
    onSuccess()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Inserisci PIN</h2>

        <input
          placeholder="Numero tavolo"
          value={table}
          onChange={(e) => setTable(e.target.value)}
        />
        <input
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        {error && <p className={styles.error}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
          <button onClick={handleSubmit} className={styles.orderButton}>
            Sblocca
          </button>
          <button onClick={onClose} className={styles.orderButton}>
            Annulla
          </button>
        </div>
      </div>
    </div>
  )
}
