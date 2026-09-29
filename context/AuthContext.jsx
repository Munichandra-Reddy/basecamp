import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const initialUsers = [
  {
    id: 1,
    name: 'muni',
    email: 'cr7156816@gmail.com',
    password: 'Muni@526',
    role: 'Workspace Admin',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Karthik Raja',
    email: 'karthik@workorbit.io',
    password: 'demo1234',
    role: 'Lead PM & Admin',
    status: 'Active'
  }
];

const getRegisteredUsers = () => {
  if (typeof window === 'undefined') return initialUsers;
  try {
    const list = JSON.parse(localStorage.getItem('teamflow_registered_users') || '[]');
    const map = new Map();
    initialUsers.forEach(u => map.set(u.email.toLowerCase(), u));
    list.forEach(u => map.set(u.email.toLowerCase(), u));
    return Array.from(map.values());
  } catch (e) {
    return initialUsers;
  }
};

const saveRegisteredUser = (userObj) => {
  if (typeof window === 'undefined') return;
  try {
    const existing = getRegisteredUsers();
    const updated = [userObj, ...existing.filter(u => u.email.toLowerCase() !== userObj.email.toLowerCase())];
    localStorage.setItem('teamflow_registered_users', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save registered user:', e);
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

  const login = async (email, password) => {
    setLoading(true);
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !password) {
      setLoading(false);
      return { success: false, error: 'Email and password are required.' };
    }

    const registered = getRegisteredUsers();
    const match = registered.find(u => u.email.toLowerCase() === cleanEmail);

    if (!match) {
      setLoading(false);
      return { success: false, error: 'Invalid email or password. Please check your credentials.' };
    }

    if (match.password && match.password !== password) {
      setLoading(false);
      return { success: false, error: 'Invalid email or password. Please check your credentials.' };
    }

    const loggedUser = {
      id: match.id || Date.now(),
      name: match.name || 'muni',
      email: match.email,
      avatar_url: match.avatar_url || '',
      role: match.role || 'Workspace Admin',
      status: 'Active'
    };

    setUser(loggedUser);
    setToken('demo_token_123');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('teamflow_logged_out');
      localStorage.setItem('teamflow_token', 'demo_token_123');
      localStorage.setItem('teamflow_user', JSON.stringify(loggedUser));
    }
    setLoading(false);
    return { success: true };
  };

  const register = async (name, email, password, confirmPassword) => {
    setLoading(true);
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim();

    if (!cleanName || cleanName.length < 2) {
      setLoading(false);
      return { success: false, error: 'Please enter your full name (minimum 2 characters).' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setLoading(false);
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!password || password.length < 6) {
      setLoading(false);
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    if (confirmPassword && password !== confirmPassword) {
      setLoading(false);
      return { success: false, error: 'Passwords do not match. Please re-enter.' };
    }

    const registered = getRegisteredUsers();
    if (registered.some(u => u.email.toLowerCase() === cleanEmail)) {
      setLoading(false);
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    const newUser = {
      id: Date.now(),
      name: cleanName,
      email: cleanEmail,
      password: password,
      avatar_url: '',
      role: 'Workspace Admin',
      status: 'Active'
    };

    saveRegisteredUser(newUser);

    setUser(newUser);
    setToken('demo_token_123');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('teamflow_logged_out');
      localStorage.setItem('teamflow_token', 'demo_token_123');
      localStorage.setItem('teamflow_user', JSON.stringify(newUser));
    }
    setLoading(false);
    return { success: true };
  };

  const updateProfile = async (name, email) => {
    setLoading(true);
    const updatedUser = { ...user, name, email };
    setUser(updatedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('teamflow_user', JSON.stringify(updatedUser));
    }
    setLoading(false);
    return { success: true, user: updatedUser };
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
