const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Singleton pattern - create only one instance
let supabaseClient: any = null;

const createSupabaseClient = async () => {
  if (!supabaseClient && supabaseUrl && supabaseAnonKey) {
    const { createClient } = await import('@supabase/supabase-js');
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized');
  } else if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are not set. Authentication features will be disabled.');
  }
  return supabaseClient;
};

// Export a function to get the client dynamically
export const getSupabaseClient = async () => {
  if (!supabaseClient) {
    await createSupabaseClient();
  }
  return supabaseClient;
};

// Create a lazy proxy for backward compatibility
const supabaseProxy = {
  get auth() {
    return {
      signUp: async (...args: any[]) => {
        const client = await getSupabaseClient();
        return client?.auth?.signUp(...args);
      },
      signInWithPassword: async (...args: any[]) => {
        const client = await getSupabaseClient();
        return client?.auth?.signInWithPassword(...args);
      },
      signOut: async (...args: any[]) => {
        const client = await getSupabaseClient();
        return client?.auth?.signOut(...args);
      },
      getUser: async (...args: any[]) => {
        const client = await getSupabaseClient();
        return client?.auth?.getUser(...args);
      },
      getSession: async (...args: any[]) => {
        const client = await getSupabaseClient();
        return client?.auth?.getSession(...args);
      },
      onAuthStateChange: (...args: any[]) => {
        return getSupabaseClient().then(client => client?.auth?.onAuthStateChange(...args) || { unsubscribe: () => {} });
      }
    };
  },
  from: async (table: string) => {
    const client = await getSupabaseClient();
    return client?.from(table);
  },
  get storage() {
    return {
      from: async (...args: any[]) => {
        const client = await getSupabaseClient();
        return client?.storage?.from(...args);
      }
    };
  }
};

export const supabase = supabaseProxy as any;

// Auth helper functions
export const signUp = async (email: string, password: string, name: string) => {
  const client = await getSupabaseClient();
  if (!client) {
    return { data: null, error: new Error('Supabase not initialized') };
  }
  
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
  
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const client = await getSupabaseClient();
  if (!client) {
    return { data: null, error: new Error('Supabase not initialized') };
  }
  
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const signOut = async () => {
  const client = await getSupabaseClient();
  if (!client) {
    return { error: new Error('Supabase not initialized') };
  }
  
  const { error } = await client.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const client = await getSupabaseClient();
  if (!client) {
    return { user: null, error: new Error('Supabase not initialized') };
  }
  
  const { data: { user }, error } = await client.auth.getUser();
  return { user, error };
};

export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  getSupabaseClient().then(client => {
    if (!client) {
      return { unsubscribe: () => {} };
    }
    
    return client.auth.onAuthStateChange(callback);
  }).catch(() => {
    return { unsubscribe: () => {} };
  });
  
  // Return empty unsubscribe for immediate return
  return { unsubscribe: () => {} };
};
