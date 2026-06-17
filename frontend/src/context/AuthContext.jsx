import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate session token on app mount
  useEffect(() => {
    const verifyUserSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.getProfile();
          setUser(res.user);
        } catch (err) {
          console.error('Session validation failed:', err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifyUserSession();
  }, []);

  const loginUser = async (credentials) => {
    setLoading(true);
    try {
      const res = await api.login(credentials);
      localStorage.setItem('token', res.token);
      setUser(res.user);
      return res.user;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (userData) => {
    setLoading(true);
    try {
      const res = await api.register(userData);
      localStorage.setItem('token', res.token);
      setUser(res.user);
      return res.user;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
