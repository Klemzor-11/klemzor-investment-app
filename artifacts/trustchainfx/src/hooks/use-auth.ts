import { useEffect, useState } from "react";

export interface User {
  email: string;
  name?: string;
  loggedIn: boolean;
}

const REDIRECT_KEY = "trustchain_redirect";

export function setLoginRedirect(path: string) {
  localStorage.setItem(REDIRECT_KEY, path);
}

export function consumeLoginRedirect(): string {
  const path = localStorage.getItem(REDIRECT_KEY);
  localStorage.removeItem(REDIRECT_KEY);
  return path || "/dashboard";
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("trustchain_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  const login = (email: string, name?: string) => {
    const u: User = { email, name, loggedIn: true };
    localStorage.setItem("trustchain_user", JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("trustchain_user");
    setUser(null);
  };

  return { user, login, logout };
}
