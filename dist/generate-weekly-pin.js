"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const crypto_1 = require("crypto");
const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY);
// genera PIN a 4 cifre
function generatePin() {
    return (0, crypto_1.randomInt)(1000, 9999).toString();
}
(async () => {
    const pin = generatePin();
    const today = new Date();
    const validFrom = today.toISOString().split("T")[0];
    const validTo = new Date(today);
    validTo.setDate(today.getDate() + 7);
    const validToISO = validTo.toISOString().split("T")[0];
    const { error } = await supabase.from("pins").insert({
        pin,
        valid_from: validFrom,
        valid_to: validToISO,
    });
    if (error) {
        process.exit(1);
    }
})();
