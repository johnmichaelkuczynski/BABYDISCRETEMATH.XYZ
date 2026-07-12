import { useQuery, useQueryClient } from "@tanstack/react-query";

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
