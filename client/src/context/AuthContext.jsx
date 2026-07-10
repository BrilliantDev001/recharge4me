import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("r4m_user");
    const storedToken = localStorage.getItem("r4m_token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    const data = await loginUser({ email, password });
    localStorage.setItem("r4m_token", data.token);
    localStorage.setItem("r4m_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const data = await registerUser(payload);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("r4m_token");
    localStorage.removeItem("r4m_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
