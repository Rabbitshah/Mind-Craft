import { createContext, useEffect, useState } from "react";
import {
  forgotPassword as forgotPasswordRequest,
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from "../api/authApi";

export const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  forgotPassword: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("mindcraft_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser(token);
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem("mindcraft_token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, [token]);

  async function login(payload) {
    const data = await loginRequest(payload);
    localStorage.setItem("mindcraft_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  }

  async function register(payload) {
    const data = await registerRequest(payload);
    localStorage.setItem("mindcraft_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  }

  async function logout() {
    await logoutRequest();
    localStorage.removeItem("mindcraft_token");
    setToken(null);
    setUser(null);
  }

  async function forgotPassword(payload) {
    return forgotPasswordRequest(payload);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
