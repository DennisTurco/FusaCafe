import type { NextApiRequest, NextApiResponse } from "next"
import { supabaseServer } from "@/lib/supabaseServer"

function generatePin() {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const pin = generatePin()

    const validFrom = new Date()
    const validTo = new Date()
    validTo.setDate(validFrom.getDate() + 7)

    const { error } = await supabaseServer
      .from("weekly_pins")
      .insert({
        pin,
        valid_from: validFrom.toISOString(),
        valid_to: validTo.toISOString(),
      })

    if (error) {
      console.error(error)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({
      pin,
      valid_from: validFrom,
      valid_to: validTo,
    })
  } catch (err) {
    console.error("Generate pin error:", err)
    return res.status(500).json({ error: "Server error" })
  }
}
