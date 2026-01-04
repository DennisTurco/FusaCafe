import type { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Metodo non consentito" })

  const { tableNumber, pin } = req.body
  if (!tableNumber || !pin)
    return res.status(400).json({ error: "Manca tavolo o PIN" })

  try {
    const today = new Date().toISOString().split("T")[0] // yyyy-mm-dd

    // 1️⃣ Recupera il PIN valido
    const { data: wpData, error: wpError } = await supabase
      .from("weekly_pins")
      .select("*")
      .eq("pin", pin)
      .lte("valid_from", today)
      .gte("valid_to", today)
      .maybeSingle()

    if (!wpData || wpError) {
      return res.status(401).json({ error: "PIN non valido o scaduto" })
    }

    // Genera token e scadenza
    const token = uuidv4()
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 ore

    // 2️⃣ Recupera la sessione del tavolo collegata a questo PIN
    const { data: sessionData, error: sessionError } = await supabase
      .from("table_sessions")
      .select("*")
      .eq("table_number", tableNumber)
      .eq("pin_id", wpData.id)
      .maybeSingle()

    if (sessionError) {
      console.error("Errore query table_sessions:", sessionError)
      return res.status(500).json({ error: "Errore server durante recupero sessione" })
    }

    if (!sessionData) {
      // 2a️⃣ Non esiste sessione → creane una nuova
      const { data: newSession, error: createError } = await supabase
        .from("table_sessions")
        .insert({
          table_number: tableNumber,
          pin_id: wpData.id,
          token,
          expires_at: expiresAt
        })
        .select("*")
        .maybeSingle()

      if (createError || !newSession) {
        console.error("Errore creazione nuova sessione:", createError)
        return res.status(500).json({ error: "Errore creazione sessione" })
      }

      console.log("Nuova sessione creata:", newSession)
      return res.status(200).json({ token: newSession.token })
    } else {
      // 2b️⃣ Sessione già esistente → aggiorna token
      const { error: updateError } = await supabase
        .from("table_sessions")
        .update({ token, expires_at: expiresAt })
        .eq("id", sessionData.id)

      if (updateError) {
        console.error("Errore aggiornamento sessione:", updateError)
        return res.status(500).json({ error: "Errore aggiornamento sessione" })
      }

      console.log("Sessione esistente aggiornata:", sessionData.id)
      return res.status(200).json({ token })
    }

  } catch (err) {
    console.error("Errore server inatteso:", err)
    return res.status(500).json({ error: "Errore server" })
  }
}
