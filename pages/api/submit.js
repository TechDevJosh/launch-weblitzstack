import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { fullName, email, contactNumber, tier, addOns } = req.body;

  const { error } = await supabase
    .from('leads')
    .insert([
      {
        full_name: fullName,
        email,
        contact_number: contactNumber,
        tier,
        add_ons: addOns,
      },
    ]);

  if (error) return res.status(500).json({ error });
  res.status(200).json({ message: 'Success' });
}
