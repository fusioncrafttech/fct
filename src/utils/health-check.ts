import { supabase } from '../services/supabase';

export const performHealthCheck = async () => {
  try {
    console.log('Performing health check...');
    
    // Check environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Environment variables missing');
    }
    
    // Test database connection with a simple query
    const { error } = await (await supabase
      .from('services'))
      .select('count')
      .limit(1);
    
    if (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }
    
    console.log('Health check passed - Database connection successful');
    return { status: 'healthy', message: 'Database connection working' };
    
  } catch (error) {
    console.error('Health check failed:', error);
    return { 
      status: 'unhealthy', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

export const logEnvironmentInfo = () => {
  console.log('Environment Info:', {
    isProduction: import.meta.env.PROD,
    supabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
    supabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    emailjsServiceId: !!import.meta.env.VITE_EMAILJS_SERVICE_ID,
    emailjsTemplateId: !!import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    emailjsPublicKey: !!import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  });
};
