// Script to verify environment variables
const verifyEnv = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('Environment Check:');
  console.log('URL:', url ? 'SET' : 'MISSING');
  console.log('Key Length:', key ? key.length : 'MISSING');
  console.log('Key Format:', key?.startsWith('eyJhbGciOiJIUzI1NiIs') ? 'CORRECT' : 'INCORRECT');
  
  if (!key || key.length < 100) {
    console.error('Supabase anon key appears incomplete');
    return false;
  }
  
  return true;
};

verifyEnv();
