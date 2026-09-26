import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('clientscope_user');
    return saved ? JSON.parse(saved) : {
      _id: 'usr_1',
      name: 'Aashray Narang',
      email: 'admin@75way.com',
      role: 'admin',
      token: 'demo_token_admin'
    };
  });
  const [loading, setLoading] = useState(false);
  const [roleToast, setRoleToast] = useState(null);

  const showToast = (role) => {
    const toastData = role === 'admin'
      ? {
          title: 'Switched to Administrator 🛡️',
          description: 'Full administrative access activated. You can create, edit, and delete projects.',
          color: 'border-emerald-500/40 bg-slate-900/95 text-emerald-400'
        }
      : {
          title: 'Switched to Project Manager 👔',
          description: 'Project delivery view activated. Track sprints and update milestone completions.',
          color: 'border-sky-500/40 bg-slate-900/95 text-sky-400'
        };

    setRoleToast(toastData);
    setTimeout(() => {
      setRoleToast(null);
    }, 3200);
  };

  const loginAsDemo = async (role = 'admin') => {
    // 1. Instant optimistic state update for silky smooth animation
    const optimisticUser = {
      _id: role === 'admin' ? 'usr_1' : 'usr_2',
      name: role === 'admin' ? 'Aashray Narang' : 'Alex Mercer',
      email: role === 'admin' ? 'admin@75way.com' : 'pm@75way.com',
      role: role,
      token: role === 'admin' ? 'token_admin' : 'token_manager'
    };

    setUser(optimisticUser);
    localStorage.setItem('clientscope_user', JSON.stringify(optimisticUser));
    showToast(role);

    // 2. Perform background sync with backend
    try {
      const email = role === 'admin' ? 'admin@75way.com' : 'pm@75way.com';
      const password = 'admin123';
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.data) {
        localStorage.setItem('clientscope_token', res.data.token);
        localStorage.setItem('clientscope_user', JSON.stringify(res.data));
        setUser(res.data);
      }
    } catch (e) {
      // Optimistic user already set, no disruption
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.data) {
      localStorage.setItem('clientscope_token', res.data.token);
      localStorage.setItem('clientscope_user', JSON.stringify(res.data));
      setUser(res.data);
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('clientscope_token');
    localStorage.removeItem('clientscope_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        roleToast,
        isAuthenticated: !!user,
        login,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
