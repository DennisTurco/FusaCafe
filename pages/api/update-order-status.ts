import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Metodo non consentito" });

  const { orderId, status } = req.body;

  if (!orderId || !status) return res.status(400).json({ error: "Manca orderId o status" });

  try {
    const { error } = await supabaseServer
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      return res.status(500).json({ error: "Errore aggiornamento stato" });
    }

    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ error: "Errore server" });
  }
}
