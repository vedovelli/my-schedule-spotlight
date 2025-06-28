import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set."
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configure auth settings
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types (will be expanded as we create the schema)
export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

// Helper types for auth
export type User = {
  id: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
};

export type Session = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
};

export type AuthError = {
  message: string;
  status?: number;
};

export type AuthResult<T = unknown> = {
  data: T | null;
  error: AuthError | null;
  success: boolean;
};

// Common error handling pattern for auth operations
const handleAuthOperation = async <T>(
  operation: () => Promise<{ data: T; error: AuthError | null }>
): Promise<AuthResult<T>> => {
  try {
    const { data, error } = await operation();
    return { 
      data, 
      error: error ? { message: error.message, status: error.status } : null, 
      success: !error 
    };
  } catch (error) {
    return { 
      data: null, 
      error: error as AuthError, 
      success: false 
    };
  }
};

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    return handleAuthOperation(() =>
      supabase.auth.signUp({
        email,
        password,
      })
    );
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    return handleAuthOperation(() =>
      supabase.auth.signInWithPassword({
        email,
        password,
      })
    );
  },

  // Sign out
  signOut: async () => {
    return handleAuthOperation(() => supabase.auth.signOut());
  },

  // Reset password
  resetPassword: async (email: string) => {
    return handleAuthOperation(() =>
      supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
    );
  },

  // Get current session
  getSession: async () => {
    return handleAuthOperation(() => supabase.auth.getSession());
  },

  // Get current user
  getUser: async () => {
    return handleAuthOperation(() => supabase.auth.getUser());
  },

  // Listen to auth changes
  onAuthStateChange: (
    callback: (event: string, session: Session | null) => void
  ) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

export default supabase;
