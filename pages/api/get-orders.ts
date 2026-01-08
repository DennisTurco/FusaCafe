import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Data di 24 ore fa
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayISO = yesterday.toISOString();

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
          quantity
        )
      `)
      .or(
        `status.not.in.(pronto,consegnato),created_at.gte.${yesterdayISO}`
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Errore get-orders:", error);
      return res.status(500).json({ error: "Errore recupero ordini" });
    }

    return res.status(200).json(orders);
  } catch (err) {
    console.error("Errore server:", err);
    return res.status(500).json({ error: "Errore server" });
  }
}
