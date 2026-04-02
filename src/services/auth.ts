import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'team_member' | 'viewer';
  avatar?: string;
  is_active: boolean;
}

export interface AuthResult {
  user: UserProfile;
  redirectTo: string;
}

// Get user profile from team_members table based on email
export const getUserProfile = async (email: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      console.error('User not found or inactive:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: data.avatar,
      is_active: data.is_active
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Enhanced sign in with role-based routing
export const signInWithRole = async (email: string, password: string) => {
  try {
    console.log('Attempting sign in for:', email);
    
    // Step 1: Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      throw new Error('Invalid email or password');
    }

    if (!authData.user) {
      console.error('No user data returned from auth');
      throw new Error('Authentication failed');
    }

    console.log('Auth successful for user ID:', authData.user.id);

    // Step 2: Get user profile from team_members table
    const profile = await getUserProfile(authData.user.email);
    
    if (!profile) {
      console.error('No profile found for email:', authData.user.email);
      throw new Error('User profile not found. Please contact administrator.');
    }

    console.log('Profile found:', profile);

    // Step 3: Store user profile
    storeUserProfile(profile);

    // Step 4: Get redirect path based on role
    const redirectTo = getRedirectPath(profile.role);

    return {
      user: profile,
      redirectTo,
    };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

// Create new user profile for first-time users
export const createNewUserProfile = async (email: string, name?: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .insert({
        name: name || email.split('@')[0],
        email: email,
        role: 'team_member', // Default role for new users
        is_active: true,
        joined_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error || !data) {
      console.error('Error creating user profile:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: data.avatar,
      is_active: data.is_active
    };
  } catch (error) {
    console.error('Error creating new user profile:', error);
    return null;
  }
};

// Determine redirect path based on user role
export const getRedirectPath = (role: string): string => {
  switch (role) {
    case 'super_admin':
    case 'admin':
      return '/admin/dashboard';
    case 'team_member':
      return '/dashboard'; // CRM dashboard
    case 'viewer':
      return '/dashboard'; // CRM dashboard with limited access
    default:
      return '/dashboard'; // Default to CRM
  }
};

// Check if user has permission for specific routes
export const hasPermission = (userRole: string, requiredRole: string): boolean => {
  const roleHierarchy = {
    'viewer': 0,
    'team_member': 1,
    'admin': 2,
    'super_admin': 3
  };

  return roleHierarchy[userRole as keyof typeof roleHierarchy] >= 
         roleHierarchy[requiredRole as keyof typeof roleHierarchy];
};

// Get current authenticated user with profile
export const getCurrentUserWithProfile = async (): Promise<{ user: UserProfile; session: any } | null> => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return null;
    }

    const userProfile = await getUserProfile(session.user.email || '');
    
    if (!userProfile) {
      return null;
    }

    return {
      user: userProfile,
      session
    };
  } catch (error) {
    console.error('Error getting current user with profile:', error);
    return null;
  }
};

// Sign out and clear local storage
export const signOut = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_email');
    localStorage.removeItem('user_profile');
    // Note: Navigation should be handled by the component calling this function
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

// Store user profile in localStorage for quick access
export const storeUserProfile = (user: UserProfile): void => {
  localStorage.setItem('user_profile', JSON.stringify(user));
  localStorage.setItem('admin_authenticated', 'true');
  localStorage.setItem('admin_email', user.email);
};

// Get user profile from localStorage
export const getStoredUserProfile = (): UserProfile | null => {
  try {
    const stored = localStorage.getItem('user_profile');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};
