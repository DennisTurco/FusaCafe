import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function generatePin() {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export async function POST() {
  const pin = generatePin()

  const validFrom = new Date()
  const validTo = new Date()
  validTo.setDate(validFrom.getDate() + 7)

  // opzionale: disattiva PIN precedenti
  await supabase
    .from('weekly_pins')
    .delete()
    .lt('valid_to', validFrom.toISOString())

  const { error } = await supabase
    .from('weekly_pins')
    .insert({
      pin,
      valid_from: validFrom,
      valid_to: validTo
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    pin,
    validFrom,
    validTo
  })
}
