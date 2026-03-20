import type { NextApiRequest, NextApiResponse } from "next"
import { supabaseServer } from "@/lib/supabaseServer"
import { supabaseClient } from "@/lib/supabaseClient"

interface IncomingItem {
  _key: string;
  name: string;
  price: string;
  quantity: number;
  selectedOptions?: { name: string; price: string }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" })
  }

  const { token, items, notes } = req.body

  if (!token || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Token o ordine non valido" })
  }

  if (notes && typeof notes !== "string") {
    return res.status(400).json({ error: "Note non valide" })
  }

  if (notes && notes.length > 100) {
    return res.status(400).json({ error: "Note troppo lunghe (max 100 caratteri)" })
  }

  try {
    const now = new Date().toISOString()

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
        status: "ricevuto",
        notes: notes?.trim() || null
      })
      .select("*")
      .maybeSingle()

    if (!order || orderError) {
      return res.status(500).json({ error: "Errore creazione ordine" })
    }

    // Inseriamo anche le opzioni selezionate
    const orderItems = (items as IncomingItem[]).map((item) => ({
      order_id: order.id,
      sanity_item_id: item._key,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      selected_options: item.selectedOptions || []
    }))

    const { error: itemsError } = await supabaseServer
      .from("order_items")
      .insert(orderItems)

    if (itemsError) {
      return res.status(500).json({ error: "Errore inserimento articoli" })
    }

    return res.status(200).json({
      success: true,
      orderId: order.id
    })
  } catch {
    return res.status(500).json({ error: "Errore server" })
  }
}