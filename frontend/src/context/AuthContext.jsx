import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate auth state from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // Corrupted storage — clear it
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Sign in — accepts (email, password) or a pre-built payload object.
   * Returns the full response data so callers can read `user.role`.
   */
  const login = async (emailOrPayload, password) => {
    const payload =
      typeof emailOrPayload === 'string'
        ? { email: emailOrPayload, password }
        : emailOrPayload;

    const response = await api.post('/auth/login/', payload);
    const { access, refresh, user: userData } = response.data;

    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    return response.data;
  };

  /**
   * Register a new account.
   * Returns the full response data (includes `user.role` and tokens if issued).
   */
  const register = async (payload) => {
    const response = await api.post('/auth/register/', payload);
    const { access, refresh, user: userData } = response.data;

    if (access && refresh && userData) {
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }

    return response.data;
  };

  /**
   * Sign out — blacklists the refresh token on the server then clears state.
   */
  const logout = async () => {
    try {
      await api.post('/auth/logout/', { refresh: localStorage.getItem('refreshToken') });
    } catch {
      // Ignore errors — we always clear locally
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
