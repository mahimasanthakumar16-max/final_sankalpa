// Connectivity test — run with: node --env-file=.env.local src/utils/supabase/test-connection.mjs
import { createClient } from '@supabase/supabase-js';

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key  = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local');
  process.exit(1);
}

console.log('🔍 Testing Supabase connectivity...');
console.log('   URL :', url);
console.log('   KEY :', key.slice(0, 30) + '...');

const supabase = createClient(url, key);

// 1. Health check — just call any lightweight RPC
try {
  const start = Date.now();
  // A simple SELECT 1 via rpc (works on all projects)
  const { data, error } = await supabase.rpc('version');
  const ms = Date.now() - start;

  if (error) {
    // 'version' function may not exist — try listing schemas instead
    const { data: d2, error: e2 } = await supabase.from('_pgsodium_global').select('*').limit(1);
    if (e2) {
      // Expected for anon — just means connection works but table doesn't exist
      if (e2.code === 'PGRST116' || e2.code === '42P01' || e2.message?.includes('relation') || e2.message?.includes('does not exist')) {
        console.log(`✅ Connected successfully (${Date.now() - start}ms)`);
        console.log('   (No tables found — database is empty or anon access is restricted, which is normal.)');
      } else {
        console.error('❌ Connection error:', e2.message, '| code:', e2.code);
      }
    } else {
      console.log(`✅ Connected successfully (${Date.now() - start}ms)`);
    }
  } else {
    console.log(`✅ Connected successfully (${ms}ms)`);
    console.log('   Postgres version:', data);
  }
} catch (err) {
  console.error('❌ Unexpected error:', err.message);
  process.exit(1);
}

// 2. Check auth endpoint
try {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('❌ Auth endpoint error:', error.message);
  } else {
    console.log('✅ Auth endpoint reachable (no active session — expected)');
  }
} catch (err) {
  console.error('❌ Auth endpoint error:', err.message);
}

console.log('\n🎉 Supabase connectivity check complete!');
