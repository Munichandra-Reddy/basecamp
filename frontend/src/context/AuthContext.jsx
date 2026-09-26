import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const getRegisteredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('teamflow_registered_users') || '[]');
  } catch (e) {
    return [];
  }
};

const saveRegisteredUser = (userObj) => {
  try {
    const existing = getRegisteredUsers();
    const updated = [userObj, ...existing.filter(u => u.email.toLowerCase() !== userObj.email.toLowerCase())];
    localStorage.setItem('teamflow_registered_users', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save registered user to localStorage:', e);
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const isLoggedOut = localStorage.getItem('teamflow_logged_out') === 'true';
    if (isLoggedOut) return null;
    const saved = localStorage.getItem('teamflow_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    const isLoggedOut = localStorage.getItem('teamflow_logged_out') === 'true';
    if (isLoggedOut) return null;
    return localStorage.getItem('teamflow_token') || null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && token !== 'demo_token_123') {
      api.get('/auth/me')
        .then(res => {
          if (res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('teamflow_user', JSON.stringify(res.data.user));
          }
        })
        .catch(() => {
          // Keep current saved user session
        });
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
      localStorage.removeItem('teamflow_logged_out');
      localStorage.setItem('teamflow_token', userToken);
      localStorage.setItem('teamflow_user', JSON.stringify(loggedUser));
      saveRegisteredUser({ ...loggedUser, password });
      return { success: true };
    } catch (err) {
      // Local registered accounts lookup (offline fallback or client-side created accounts)
      const registered = getRegisteredUsers();
      const match = registered.find(u => u.email.toLowerCase() === cleanEmail);

      if (match && match.password === password) {
        const loggedUser = {
          id: match.id || Date.now(),
          name: match.name,
          email: match.email,
          avatar_url: match.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(match.name)}`,
          role: match.role || 'Workspace Admin',
          status: match.status || 'Active'
        };
        setUser(loggedUser);
        setToken('demo_token_123');
        localStorage.removeItem('teamflow_logged_out');
        localStorage.setItem('teamflow_token', 'demo_token_123');
        localStorage.setItem('teamflow_user', JSON.stringify(loggedUser));
        return { success: true };
      }

      // Strictly fail login if account does not exist or credentials don't match
      return {
        success: false,
        error: err.response?.data?.error || 'Invalid email or password. Please create an account first.'
      };
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
      localStorage.removeItem('teamflow_logged_out');
      localStorage.setItem('teamflow_token', regToken);
      localStorage.setItem('teamflow_user', JSON.stringify(regUser));
      return { success: true };
    } catch (err) {
      setUser(newUser);
      setToken('demo_token_123');
      localStorage.removeItem('teamflow_logged_out');
      localStorage.setItem('teamflow_token', 'demo_token_123');
      localStorage.setItem('teamflow_user', JSON.stringify(newUser));
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
      localStorage.setItem('teamflow_user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } catch (err) {
      const updatedUser = { ...user, name, email };
      setUser(updatedUser);
      localStorage.setItem('teamflow_user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.setItem('teamflow_logged_out', 'true');
    setUser(null);
    setToken(null);
    localStorage.removeItem('teamflow_token');
    localStorage.removeItem('teamflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
