
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testConnection() {
  console.log('Testing Supabase Connection...');
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  // Try to select from profiles (even if empty)
  const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
  
  if (error) {
    console.error('Connection Error:', error);
  } else {
    console.log('Connection Successful. Profiles count:', data);
  }

  // Try to insert a dummy profile? No, need a user ID that matches auth.
  // We can't easily test RLS bypass without a service role key.
  // But we can check if the table exists.
}

testConnection();
