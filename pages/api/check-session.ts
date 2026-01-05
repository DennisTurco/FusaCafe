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

    const { data, error } = await supabase
      .rpc("check_valid_session", { p_token: token });

    if (error) {
      console.error(error);
      return res.status(500).json({ valid: false });
    }

    if (!data || data.length === 0) {
      return res.status(200).json({ valid: false });
    }

    const session = data[0];

    return res.status(200).json({
      valid: true,
      session: {
        id: session.id,
        tableNumber: session.table_number,
        expiresAt: session.expires_at,
      },
    });

  } catch (err) {
    console.error("Errore server check-session:", err)
    return res.status(500).json({ valid: false })
  }
}
