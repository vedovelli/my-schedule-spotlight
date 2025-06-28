import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User, auth } from "@/lib/supabase";

interface AuthError {
  message: string;
  status?: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
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

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data, error } = await auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
        } else if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
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
    setLoading(true);
    try {
      const { data, error } = await auth.signIn(email, password);
      if (error) {
        console.error("Sign in error:", error);
        return { error: error as AuthError };
      }
      return { error: null };
    } catch (error) {
      console.error("Sign in exception:", error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await auth.signUp(email, password);
      if (error) {
        console.error("Sign up error:", error);
        return { error: error as AuthError };
      }
      return { error: null };
    } catch (error) {
      console.error("Sign up exception:", error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        return { error: error as AuthError };
      }
      return { error: null };
    } catch (error) {
      console.error("Sign out exception:", error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await auth.resetPassword(email);
      if (error) {
        console.error("Reset password error:", error);
        return { error: error as AuthError };
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
