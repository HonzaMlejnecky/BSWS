import { createContext, useContext, useMemo, useState } from 'react';
import { authApi } from '../api/generatedClient';

const AuthContext = createContext(null);

const TOKEN_KEY = 'hc_jwt';
const USER_ID_KEY = 'hc_user_id';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [userId, setUserId] = useState(() => Number(localStorage.getItem(USER_ID_KEY) || 1));

  const login = async (credentials) => {
    const jwt = await authApi.login(credentials);
    localStorage.setItem(TOKEN_KEY, jwt);
    setToken(jwt);
    return jwt;
  };

  const register = (payload) => authApi.register(payload);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  const value = useMemo(() => ({ token, userId, setUserId, isAuthenticated: !!token, login, register, logout }), [token, userId]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
