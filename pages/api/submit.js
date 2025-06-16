import { createClient } from '@supabase/supabase-js';

// Ensure these environment variable names match your project's .env file
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  // --- FIX 1: Read 'consultation_timestamp' from the request body ---
  const {
    fullName,
    email,
    contactNumber,
    tier,
    addOns,
    consultation_timestamp,
  } = req.body;

  try {
    // --- FIX 2: Add 'consultation_timestamp' to the insert payload ---
    const { data, error } = await supabase
      .from('launch-weblitzstack')
      .insert([
        {
          full_name: fullName,
          email,
          contact_number: contactNumber,
          tier,
          add_ons: addOns,
          // Use `|| null` to gracefully handle empty/missing timestamps
          consultation_timestamp: consultation_timestamp || null,
        },
      ])
      .select(); // Using .select() is good practice to get the inserted data back

    if (error) {
      console.error('[API] Supabase insert error:', error.message);
      // Return the specific error message for easier debugging
      return res.status(400).json({ error: error.message });
    }

    console.log('[API] Data inserted successfully!', data);
    res.status(200).json({ message: 'Success', data: data });
  } catch (err) {
    console.error('[API] Server error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
