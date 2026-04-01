import type { NextApiRequest, NextApiResponse } from "next"
import { supabaseServer } from "@/lib/supabaseServer"
import { v4 as uuidv4 } from "uuid"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" })
  }

  const { tableNumber, pin } = req.body
  if (!tableNumber || !pin) {
    return res.status(400).json({ error: "Manca tavolo o PIN" })
  }

  try {
    const today = new Date().toISOString().split("T")[0]

    // Verifica PIN valido
    const { data: weeklyPin } = await supabaseServer
      .from("pins")
      .select("*")
      .eq("pin", String(pin))
      .lte("valid_from", today)
      .gte("valid_to", today)
      .maybeSingle()

    if (!weeklyPin) {
      return res.status(401).json({ error: "PIN non valido o scaduto" })
    }

    if (tableNumber < 1 || tableNumber > 100) {
      return res.status(400).json({ error: "Numero tavolo non valido" })
    }

    // Cerca sessione ESISTENTE per tavolo (indipendente dal PIN)
    const { data: existingSession } = await supabaseServer
      .from("table_sessions")
      .select("*")
      .eq("table_number", tableNumber)
      .maybeSingle()

    const token = uuidv4()
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()

    // Se NON esiste → crea
    if (!existingSession) {
      const { data: newSession, error } = await supabaseServer
        .from("table_sessions")
        .insert({
          table_number: tableNumber,
          pin_id: weeklyPin.id,
          token,
          expires_at: expiresAt
        })
        .select("*")
        .single()

      if (error) {
        return res.status(500).json({ error: "Errore creazione sessione" })
      }

      return res.status(200).json({ token: newSession.token })
    }

    // Se ESISTE → aggiorna SEMPRE
    const { error: updateError } = await supabaseServer
      .from("table_sessions")
      .update({
        pin_id: weeklyPin.id,
        token,
        expires_at: expiresAt
      })
      .eq("id", existingSession.id)

    if (updateError) {
      return res.status(500).json({ error: "Errore aggiornamento sessione" })
    }

    return res.status(200).json({ token })

  } catch {
    return res.status(500).json({ error: "Errore server" })
  }
}
