import { createClient } from "@supabase/supabase-js";
import { randomInt } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

// genera PIN a 4 cifre
function generatePin() {
  return randomInt(1000, 9999).toString();
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
