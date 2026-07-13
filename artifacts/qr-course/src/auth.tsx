import { type ComponentType } from "react";
import { Redirect } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Landing from "@/pages/Landing";

export interface AuthUser {
  id: number;
  username: string;
  email: string | null;
  displayName: string | null;
}

interface AuthState {
  authenticated: boolean;
  user: AuthUser | null;
}

export function useAuth() {
  const { data, isLoading } = useQuery<AuthState>({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const res = await fetch("/api/auth/user");
      if (!res.ok) throw new Error("Failed to fetch auth state");
      return res.json() as Promise<AuthState>;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    user: data?.user ?? null,
    isAuthenticated: data?.authenticated ?? false,
    isLoading,
  };
}

export function useLogout() {
  const qc = useQueryClient();
  return async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    qc.clear();
    window.location.href = "/";
  };
}

export function HomeRedirect() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (isAuthenticated) return <Redirect to="/dashboard" />;
  return <Landing />;
}

const ADMIN_EMAIL = "johnmichaelkuczynski@gmail.com";

export function useIsAdmin() {
  const { user, isLoading } = useAuth();
  return {
    isAdmin: user?.email?.toLowerCase() === ADMIN_EMAIL,
    isLoading,
  };
}

export function protectedComponent(Component: ComponentType<any>) {
  return function Guarded(props: any) {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) return null;
    if (!isAuthenticated) return <Redirect to="/" />;
    return <Component {...props} />;
  };
}
