import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User, auth, AuthError } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authLoading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const result = await auth.getSession();
        if (result.error) {
          console.error("Error getting session:", result.error);
        } else if (result.data?.session) {
          setSession(result.data.session);
          setUser(result.data.session.user);
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      const result = await auth.signIn(email, password);
      if (result.error) {
        console.error("Sign in error:", result.error);
        return { error: result.error };
      }
      return { error: null };
    } catch (error) {
      console.error("Sign in exception:", error);
      return { error: error as AuthError };
    } finally {
      setAuthLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      const result = await auth.signUp(email, password);
      if (result.error) {
        console.error("Sign up error:", result.error);
        return { error: result.error };
      }
      return { error: null };
    } catch (error) {
      console.error("Sign up exception:", error);
      return { error: error as AuthError };
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    setAuthLoading(true);
    try {
      const result = await auth.signOut();
      if (result.error) {
        console.error("Sign out error:", result.error);
        return { error: result.error };
      }
      return { error: null };
    } catch (error) {
      console.error("Sign out exception:", error);
      return { error: error as AuthError };
    } finally {
      setAuthLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const result = await auth.resetPassword(email);
      if (result.error) {
        console.error("Reset password error:", result.error);
        return { error: result.error };
      }
      return { error: null };
    } catch (error) {
      console.error("Reset password exception:", error);
      return { error: error as AuthError };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    authLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
