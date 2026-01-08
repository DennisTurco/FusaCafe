import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const {data, error} = await supabaseClient.rpc("get_new_active_pin");

        if (error) {
            console.error(error);
            return res.status(500).json({ valid: false });
        }

        if (!data || data.length === 0) {
            return res.status(200).json({ valid: false });
        }

        const pin = data[0];

        return res.status(200).json({
            valid: true,
            pin: pin.pin,
            valid_from: pin.valid_from,
            valid_to: pin.valid_to,
            created_at: pin.created_at
        });
    } catch (err) {
        console.error("Obtaining pin server error: ", err);
        return res.status(500).json({ valid: false });
    }
}