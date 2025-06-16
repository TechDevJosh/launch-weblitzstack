import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { fullName, email, contactNumber, tier, addOns } = req.body;

  console.log('[API] Received data:', {
    fullName,
    email,
    contactNumber,
    tier,
    addOns,
  });

  const { error } = await supabase.from('launch-weblitzstack').insert([
    {
      full_name: fullName,
      email,
      contact_number: contactNumber,
      tier,
      add_ons: addOns,
    },
  ]);

  if (error) {
    console.error('[API] Supabase insert error:', error.message);
    return res.status(500).json({ error });
  }

  console.log('[API] Data inserted successfully!');
  res.status(200).json({ message: 'Success' });
}
