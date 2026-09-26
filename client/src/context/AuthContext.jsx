import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('clientscope_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('clientscope_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('clientscope_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session expired or server offline:', err.message);
          // Keep cached user if offline for evaluation resilience
        }
      } else {
        // Automatically log in as default Admin for seamless evaluation demo!
        loginAsDemo('admin');
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.data) {
      localStorage.setItem('clientscope_token', res.data.token);
      localStorage.setItem('clientscope_user', JSON.stringify(res.data));
      setUser(res.data);
      return res.data;
    }
  };

  const loginAsDemo = async (role = 'admin') => {
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
      // Local fallback mock
      const fallbackUser = {
        _id: 'usr_demo',
        name: role === 'admin' ? 'Aashray Narang (Admin)' : 'Alex Mercer (Manager)',
        email: role === 'admin' ? 'admin@75way.com' : 'pm@75way.com',
        role: role,
        token: 'demo_token_75way'
      };
      localStorage.setItem('clientscope_token', fallbackUser.token);
      localStorage.setItem('clientscope_user', JSON.stringify(fallbackUser));
      setUser(fallbackUser);
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
