/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react';
import { authApi, ordersApi } from '../api/generatedClient';

const AuthContext = createContext(null);

const TOKEN_KEY = 'hc_jwt';
const USER_ID_KEY = 'hc_user_id';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [userId, setUserId] = useState(() => Number(localStorage.getItem(USER_ID_KEY) || 0));

  const login = async (credentials) => {
    const jwt = await authApi.login(credentials);
    localStorage.setItem(TOKEN_KEY, jwt);
    setToken(jwt);

    try {
      const subs = await ordersApi.getMine();
      const resolvedUserId = subs?.[0]?.userId;
      if (resolvedUserId) {
        localStorage.setItem(USER_ID_KEY, String(resolvedUserId));
        setUserId(resolvedUserId);
      }
    } catch {
      // user can still continue (e.g., no subscription yet)
    }

    return jwt;
  };

  const register = (payload) => authApi.register(payload);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    setToken(null);
    setUserId(0);
  };

  const persistUserId = (nextUserId) => {
    localStorage.setItem(USER_ID_KEY, String(nextUserId));
    setUserId(nextUserId);
  };

  const value = useMemo(() => ({
    token,
    userId,
    setUserId: persistUserId,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  }), [token, userId]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
