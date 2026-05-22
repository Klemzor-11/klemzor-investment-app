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

// Lazy initializer — reads localStorage once on mount with no flash
function loadUser(): User | null {
  try {
    const s = localStorage.getItem("trustchain_user");
    if (s) return JSON.parse(s) as User;
  } catch { /* ignore */ }
  return null;
}

import { useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<User | null>(loadUser);

  const login = (email: string, name?: string) => {
    const u: User = { email, name, loggedIn: true };
    localStorage.setItem("trustchain_user", JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("trustchain_user");
    localStorage.removeItem("trustchain_balance");
    localStorage.removeItem("trustchain_transactions");
    setUser(null);
  };

  return { user, login, logout };
}
