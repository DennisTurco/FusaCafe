import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayISO = yesterday.toISOString();

    // Recupera ordini non rifiutati o consegnati negli ultimi 24h
    const { data: orders, error } = await supabaseClient
      .from("orders")
      .select(`
        id,
        table_number,
        status,
        created_at,
        order_items (
          id,
          sanity_item_id,
          name,
          price,
          quantity,
          selected_options
        ),
        notes
      `)
      .or(`status.eq.ricevuto,status.eq.ricevuto,created_at.gte.${yesterdayISO}`)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: "Errore recupero ordini" });
    }

    return res.status(200).json(orders);
  } catch {
    return res.status(500).json({ error: "Errore server" });
  }
}