import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (emailOrPayload, password) => {
    const payload = typeof emailOrPayload === 'string' ? { email: emailOrPayload, password } : emailOrPayload;
    const response = await api.post('/auth/login/', payload);
    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    setUser(response.data.user);
    return response.data;
  };

  const register = async (payload) => {
    const response = await api.post('/auth/register/', payload);
    if (response.data?.access && response.data?.refresh) {
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
    }
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout/', { refresh: localStorage.getItem('refreshToken') });
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
