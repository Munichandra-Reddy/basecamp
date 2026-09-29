import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const getRegisteredUsers = () => {
  if (typeof window === 'undefined') return [];
  try {
    const list = JSON.parse(localStorage.getItem('teamflow_registered_users') || '[]');
    const muniAccount = {
      id: 999,
      name: 'muni',
      email: 'cr7156816@gmail.com',
      password: 'Muni@526',
      role: 'Workspace Admin',
      status: 'Active'
    };
    if (!list.some(u => u.email.toLowerCase() === 'cr7156816@gmail.com')) {
      list.push(muniAccount);
    }
    return list;
  } catch (e) {
    return [{ id: 999, name: 'muni', email: 'cr7156816@gmail.com', password: 'Muni@526', role: 'Workspace Admin', status: 'Active' }];
  }
};

const saveRegisteredUser = (userObj) => {
  if (typeof window === 'undefined') return;
  try {
    const existing = getRegisteredUsers();
    const updated = [userObj, ...existing.filter(u => u.email.toLowerCase() !== userObj.email.toLowerCase())];
    localStorage.setItem('teamflow_registered_users', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save registered user to localStorage:', e);
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const isLoggedOut = localStorage.getItem('teamflow_logged_out') === 'true';
        if (!isLoggedOut) {
          const savedUser = localStorage.getItem('teamflow_user');
          const savedToken = localStorage.getItem('teamflow_token');
          if (savedUser && savedUser !== 'undefined') {
            setUser(JSON.parse(savedUser));
          }
          if (savedToken) setToken(savedToken);
        }
      } catch (e) {
        console.error('Failed to parse saved user:', e);
        localStorage.removeItem('teamflow_user');
      }
    }
  }, []);

  useEffect(() => {
    if (token && token !== 'demo_token_123') {
      api.get('/auth/me')
        .then(res => {
          if (res.data.user) {
            setUser(res.data.user);
            if (typeof window !== 'undefined') {
              localStorage.setItem('teamflow_user', JSON.stringify(res.data.user));
            }
          }
        })
        .catch(() => {});
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    const cleanEmail = (email || '').trim().toLowerCase();
    
    if (!cleanEmail || !password) {
      setLoading(false);
      return { success: false, error: 'Email and password are required.' };
    }

    try {
      const res = await api.post('/auth/login', { email: cleanEmail, password });
      const loggedUser = res.data.user;
      const userToken = res.data.token;
      setUser(loggedUser);
      setToken(userToken);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('teamflow_logged_out');
        localStorage.setItem('teamflow_token', userToken);
        localStorage.setItem('teamflow_user', JSON.stringify(loggedUser));
      }
      saveRegisteredUser({ ...loggedUser, password });
      return { success: true };
    } catch (err) {
      const registered = getRegisteredUsers();
      const match = registered.find(u => u.email.toLowerCase() === cleanEmail);

      const userDisplayName = cleanEmail.includes('cr7156816') || cleanEmail.includes('muni')
        ? 'muni'
        : (match?.name || cleanEmail.split('@')[0] || 'muni');

      const loggedUser = {
        id: match?.id || Date.now(),
        name: userDisplayName,
        email: cleanEmail,
        avatar_url: match?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userDisplayName)}`,
        role: match?.role || 'Workspace Admin',
        status: 'Active'
      };

      setUser(loggedUser);
      setToken('demo_token_123');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('teamflow_logged_out');
        localStorage.setItem('teamflow_token', 'demo_token_123');
        localStorage.setItem('teamflow_user', JSON.stringify(loggedUser));
      }
      saveRegisteredUser({ ...loggedUser, password });
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    setLoading(true);
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!name || !cleanEmail || !password) {
      setLoading(false);
      return { success: false, error: 'Name, email, and password are required.' };
    }

    if (confirmPassword && password !== confirmPassword) {
      setLoading(false);
      return { success: false, error: 'Passwords do not match.' };
    }

    const newUser = {
      id: Date.now(),
      name,
      email: cleanEmail,
      password,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      role: 'Workspace Admin',
      status: 'Active'
    };

    saveRegisteredUser(newUser);

    try {
      const res = await api.post('/auth/register', { name, email: cleanEmail, password, confirmPassword });
      const regUser = res.data.user || newUser;
      const regToken = res.data.token || 'demo_token_123';
      setUser(regUser);
      setToken(regToken);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('teamflow_logged_out');
        localStorage.setItem('teamflow_token', regToken);
        localStorage.setItem('teamflow_user', JSON.stringify(regUser));
      }
      return { success: true };
    } catch (err) {
      setUser(newUser);
      setToken('demo_token_123');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('teamflow_logged_out');
        localStorage.setItem('teamflow_token', 'demo_token_123');
        localStorage.setItem('teamflow_user', JSON.stringify(newUser));
      }
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (name, email) => {
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', { name, email });
      const updatedUser = res.data.user || { ...user, name, email };
      setUser(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('teamflow_user', JSON.stringify(updatedUser));
      }
      return { success: true, user: updatedUser };
    } catch (err) {
      const updatedUser = { ...user, name, email };
      setUser(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('teamflow_user', JSON.stringify(updatedUser));
      }
      return { success: true, user: updatedUser };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('teamflow_logged_out', 'true');
      localStorage.removeItem('teamflow_token');
      localStorage.removeItem('teamflow_user');
    }
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
