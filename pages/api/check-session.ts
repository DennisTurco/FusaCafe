import type { NextApiRequest, NextApiResponse } from "next"
import { supabaseClient } from "@/lib/supabaseClient"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { token } = req.body

  if (!token) {
    return res.status(400).json({ valid: false, error: "Missing token" })
  }

  try {
    const { data, error } = await supabaseClient
      .rpc("check_valid_session", { p_token: token });

    if (error) {
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

  } catch {
    return res.status(500).json({ valid: false })
  }
}
