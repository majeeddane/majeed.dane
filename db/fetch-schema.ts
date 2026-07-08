import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function fetchSchema() {
  const url = `${supabaseUrl}/rest/v1/?apikey=${serviceRoleKey}`;
  console.log('Fetching schema from:', url);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    console.log('Available tables/paths:', Object.keys(data.paths || {}));
  } catch (err) {
    console.error('Error fetching schema:', err);
  }
}

fetchSchema();
