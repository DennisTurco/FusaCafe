import type { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "@/lib/supabase"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" })
  }

  const { token } = req.body

  if (!token) {
    return res.status(400).json({ valid: false, error: "Token mancante" })
  }

  try {
    const now = new Date().toISOString()

    const { data: session, error } = await supabase
      .from("table_sessions")
      .select("*")
      .eq("token", token)
      .gt("expires_at", now)
      .maybeSingle()

    if (error) {
      console.error("Errore query check-session:", error)
      return res.status(500).json({ valid: false })
    }

    if (!session) {
      return res.status(200).json({ valid: false })
    }

    return res.status(200).json({
      valid: true,
      session: {
        id: session.id,
        tableNumber: session.table_number,
        expiresAt: session.expires_at
      }
    })
  } catch (err) {
    console.error("Errore server check-session:", err)
    return res.status(500).json({ valid: false })
  }
}
