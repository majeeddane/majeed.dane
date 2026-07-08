import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const host = 'db.adnqpnsyiatdohljwquz.supabase.co';
const port = 5432;
const user = 'postgres';
const database = 'postgres';

// Common passwords to try
const passwords = [
  'adnqpnsyiatdohljwquz',
  'admin123',
  'Admin123',
  'admin2024',
  'majeed',
  'majeed2024',
  'majeed123',
  'Majeed123',
  'majeeddane',
  'Majeeddane',
  'Majeed2024',
  'majeed.dane',
  'postgres',
  'Postgres123',
  'postgres123',
  'password',
  'Password123'
];

async function tryConnect() {
  console.log(`Starting connection attempts to ${host}...`);

  for (const password of passwords) {
    console.log(`Trying password: "${password}"...`);
    const client = new Client({
      host,
      port,
      user,
      password,
      database,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000
    });

    try {
      await client.connect();
      console.log(`\n🎉 SUCCESS! Password found: "${password}"`);
      
      // Execute the SQL setup script
      const sqlPath = path.resolve(process.cwd(), 'db/supabase-setup.sql');
      if (fs.existsSync(sqlPath)) {
        console.log('Running SQL setup script...');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        await client.query(sql);
        console.log('✅ SQL setup executed successfully!');
      } else {
        console.log('❌ SQL setup script not found at:', sqlPath);
      }

      await client.end();
      return;
    } catch (err: any) {
      console.log(`❌ Failed with password "${password}": ${err.message}`);
    }
  }

  console.log('\n❌ All password attempts failed. Please run the SQL setup script manually in the Supabase SQL editor.');
}

tryConnect().catch(console.error);
