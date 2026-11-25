import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api.js';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('hh_token'));

  useEffect(() => {
    if (!localStorage.getItem('hh_token')) return;
    api('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem('hh_token'))
      .finally(() => setLoading(false));
  }, []);

  const start = ({ token, user }) => { localStorage.setItem('hh_token', token); setUser(user); return user; };
  const login = async (email, password) => start(await api('/auth/login', { method: 'POST', body: { email, password } }));
  const register = async (form) => start(await api('/auth/register', { method: 'POST', body: form }));
  const logout = () => { localStorage.removeItem('hh_token'); setUser(null); };

  return <Ctx.Provider value={{ user, setUser, loading, login, register, logout }}>{children}</Ctx.Provider>;
}
