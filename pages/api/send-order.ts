import type { NextApiRequest, NextApiResponse } from "next"
import { supabaseServer } from "@/lib/supabaseServer"
import { createClient } from "@sanity/client";

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-03-10",
  useCdn: false, // SERVER
});

interface IncomingItem {
  _key: string
  quantity: number
  selectedOptions?: { name: string }[]
}

interface SanityOption {
  name: string
  price: number
}

interface SanityItem {
  _key: string
  name: string
  price: string
  options?: SanityOption[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" })
  }

  const { token, items, notes } = req.body

  if (!token || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Dati non validi" })
  }

  if (notes && typeof notes !== "string") {
    return res.status(400).json({ error: "Note non valide" })
  }

  if (notes && notes.length > 100) {
    return res.status(400).json({ error: "Note troppo lunghe (max 100 caratteri)" })
  }

  if (!items.every(i => i.name && i.quantity > 0)) {
    return res.status(400).json({ error: "Dati non validi" })
  }

  const safeNotes = notes?.trim().slice(0, 100) || null

  try {
    const now = new Date().toISOString()

    // session
    const { data: session, error: sessionError } = await supabaseServer
      .from("table_sessions")
      .select("*")
      .eq("token", token)
      .gte("expires_at", now)
      .maybeSingle()

    if (!session || sessionError) {
      return res.status(401).json({ error: "Sessione non valida o scaduta, ricarica la pagina" })
    }

    // prevenire lo spam di ordini
    const tenSecondsAgo = new Date(Date.now() - 10000).toISOString()

    const { data: recentOrders } = await supabaseServer
      .from("orders")
      .select("id")
      .eq("session_id", session.id)
      .gte("created_at", tenSecondsAgo)

    if (recentOrders && recentOrders.length > 0) {
      return res.status(429).json({ error: "Attendi prima di inviare un nuovo ordine" })
    }

    // BLOCCO ORDINE IN SOSPESO
    const { data: pendingOrders } = await supabaseServer
      .from("orders")
      .select("id")
      .eq("session_id", session.id)
      .eq("status", "ricevuto")

    if (pendingOrders && pendingOrders.length > 3) {
      return res.status(429).json({ error: "Troppi ordini in corso" })
    }

    // FETCH DATI REALI DA SANITY
    const sanityItems: SanityItem[] = await sanity.fetch(
      `*[_type == "menuItem"][0].data[_key in $keys]`,
      { keys: items.map((i: IncomingItem) => i._key) }
    )

    if (!sanityItems || sanityItems.length === 0) {
      return res.status(400).json({ error: "Items non validi" })
    }

    // crea ordine
    const { data: order, error: orderError } = await supabaseServer
      .from("orders")
      .insert({
        table_number: session.table_number,
        session_id: session.id,
        status: "ricevuto",
        notes: safeNotes
      })
      .select("*")
      .maybeSingle()

    if (!order || orderError) {
      return res.status(500).json({ error: "Errore creazione ordine" })
    }

    // COSTRUZIONE SICURA ITEMS
    const orderItems = items.map((item: IncomingItem) => {
      const realItem = sanityItems.find((i) => i._key === item._key)

      if (!realItem) {
        throw new Error("Item non valido")
      }

      // quantità valida
      if (item.quantity <= 0 || item.quantity > 10) {
        throw new Error("Quantità non valida")
      }

      // valida opzioni
      const validOptions = (item.selectedOptions || []).filter(opt =>
        realItem.options?.some((o) => o.name === opt.name)
      )

      return {
        order_id: order.id,
        sanity_item_id: realItem._key,
        name: realItem.name,
        price: parseFloat(realItem.price.replace(",", ".")),
        quantity: item.quantity,
        selected_options: validOptions.map(o => {
          const realOption = realItem.options?.find(ro => ro.name === o.name)
          return {
            name: o.name,
            price: realOption?.price || 0
          }
        })
      }
    })

    // INSERT ITEMS
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