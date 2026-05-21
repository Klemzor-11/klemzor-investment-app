import { useEffect, useState } from "react";

export interface User {
  email: string;
  loggedIn: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("trustchain_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const login = (email: string) => {
    const u = { email, loggedIn: true };
    localStorage.setItem("trustchain_user", JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("trustchain_user");
    setUser(null);
  };

  return { user, login, logout };
}