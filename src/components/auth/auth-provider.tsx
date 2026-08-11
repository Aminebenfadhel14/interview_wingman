"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export type AuthUser = {
  email: string;
  name: string;
  provider: "google" | "email" | "mock";
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string, isSignup?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const MOCK_STORAGE_KEY = "iw_mock_user";

function toAuthUser(session: Session | null): AuthUser | null {
  const u = session?.user;
  if (!u) return null;
  return {
    email: u.email ?? "user@example.com",
    name: (u.user_metadata?.full_name as string) ?? u.email?.split("@")[0] ?? "User",
    provider: "google",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      try {
        const stored = localStorage.getItem(MOCK_STORAGE_KEY);
        if (stored) setUser(JSON.parse(stored) as AuthUser);
      } catch {}
      setLoading(false);
      return;
    }

    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(toAuthUser(data.session));
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toAuthUser(session));
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const signInWithGoogle = useCallback(async () => {
    if (supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) toast.error(error.message);
      return;
    }

    const mockUser: AuthUser = {
      email: "demo@interviewwingman.app",
      name: "Demo User",
      provider: "mock",
    };
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    toast.success("Signed in with Google (demo mode)");
    router.push("/dashboard");
  }, [supabase, router]);

  const signInWithEmail = useCallback(
    async (email: string, password: string, isSignup = false) => {
      if (!email || !password) {
        toast.error("Please enter your email and password");
        return;
      }

      if (supabase) {
        const { error } = isSignup
          ? await supabase.auth.signUp({ email, password })
          : await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast.error(error.message);
          return;
        }
        if (isSignup) {
          toast.success("Check your email to confirm your account");
        } else {
          router.push("/dashboard");
        }
        return;
      }

      const mockUser: AuthUser = {
        email,
        name: email.split("@")[0] || "User",
        provider: "mock",
      };
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      toast.success(isSignup ? "Account created (demo mode)" : "Signed in (demo mode)");
      router.push("/dashboard");
    },
    [supabase, router]
  );

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(MOCK_STORAGE_KEY);
    setUser(null);
    toast.success("Signed out");
    router.push("/");
  }, [supabase, router]);

  const value = useMemo(
    () => ({ user, loading, signInWithGoogle, signInWithEmail, signOut }),
    [user, loading, signInWithGoogle, signInWithEmail, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
