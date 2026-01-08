import type { NextApiRequest, NextApiResponse } from "next"
import { supabaseServer } from "@/lib/supabaseServer"
import { supabaseClient } from "@/lib/supabaseClient"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" })
  }

  const { token, items } = req.body

  if (!token || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Token o ordine non valido" })
  }

  try {
    const now = new Date().toISOString()

    const { data: all } = await supabaseServer
    .from("table_sessions")
    .select("*")

    console.log("SESSIONI DB:", all)

    console.log("TOKEN RICEVUTO:", token)
    console.log("NOW:", now)

    const { data: session, error: sessionError } = await supabaseClient
      .from("table_sessions")
      .select("*")
      .eq("token", token)
      .gte("expires_at", now)
      .maybeSingle()

    if (!session || sessionError) {
      return res.status(401).json({ error: "Sessione non valida o scaduta" })
    }

    const { data: order, error: orderError } = await supabaseServer
      .from("orders")
      .insert({
        table_number: session.table_number,
        session_id: session.id,
        status: "ricevuto"
      })
      .select("*")
      .maybeSingle()

    if (!order || orderError) {
      console.error(orderError)
      return res.status(500).json({ error: "Errore creazione ordine" })
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      sanity_item_id: item._key,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }))

    const { error: itemsError } = await supabaseServer
      .from("order_items")
      .insert(orderItems)

    if (itemsError) {
      console.error(itemsError)
      return res.status(500).json({ error: "Errore inserimento articoli" })
    }

    return res.status(200).json({
      success: true,
      orderId: order.id
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Errore server" })
  }
}
