import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  );
}

// Create Supabase client for authentication only
// All database operations are handled through Edge Functions
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configure auth settings
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types for the application schema
export type Database = {
  public: {
    Tables: {
      event_types: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          duration_minutes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          duration_minutes: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          duration_minutes?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_availabilities: {
        Row: {
          id: string;
          event_type_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_type_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_type_id?: string;
          day_of_week?: number;
          start_time?: string;
          end_time?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_bookings: {
        Row: {
          id: string;
          event_type_id: string;
          user_email: string;
          scheduled_for: string;
          created_at: string;
          updated_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          event_type_id: string;
          user_email: string;
          scheduled_for: string;
          created_at?: string;
          updated_at?: string;
          status?: string;
        };
        Update: {
          id?: string;
          event_type_id?: string;
          user_email?: string;
          scheduled_for?: string;
          created_at?: string;
          updated_at?: string;
          status?: string;
        };
      };
    };
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
      success: !error,
    };
  } catch (error) {
    return {
      data: null,
      error: error as AuthError,
      success: false,
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

// Database helper types
export type EventType = Database['public']['Tables']['event_types']['Row'];
export type EventTypeInsert =
  Database['public']['Tables']['event_types']['Insert'];
export type EventTypeUpdate =
  Database['public']['Tables']['event_types']['Update'];

export type EventAvailability =
  Database['public']['Tables']['event_availabilities']['Row'];
export type EventAvailabilityInsert =
  Database['public']['Tables']['event_availabilities']['Insert'];
export type EventAvailabilityUpdate =
  Database['public']['Tables']['event_availabilities']['Update'];

export type EventBooking =
  Database['public']['Tables']['event_bookings']['Row'];
export type EventBookingInsert =
  Database['public']['Tables']['event_bookings']['Insert'];
export type EventBookingUpdate =
  Database['public']['Tables']['event_bookings']['Update'];

// Enums for type safety
export const BookingStatus = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

export type BookingStatusType =
  (typeof BookingStatus)[keyof typeof BookingStatus];

// Days of week enum (0 = Sunday, 6 = Saturday)
export const DayOfWeek = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const;

export type DayOfWeekType = (typeof DayOfWeek)[keyof typeof DayOfWeek];

// Helper function to get day name from number
export const getDayName = (day: number): string => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return days[day] || 'Unknown';
};

// Helper function to format time for display
export const formatTime = (time: string): string => {
  return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export default supabase;
