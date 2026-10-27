import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to parse JWT and check if it is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      return true;
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        if (isTokenExpired(token)) {
          // Token expired, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        } else {
          setUser(JSON.parse(savedUser));
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (usernameOrEmail, password) => {
    try {
      const response = await api.post('/api/auth/login', { usernameOrEmail, password });
      const { token, id, username, email, role } = response.data;
      
      const userData = { id, username, email, role };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed. Please check credentials.';
    }
  };

  const register = async (username, email, password) => {
    try {
      await api.post('/api/auth/register', { username, email, password });
    } catch (error) {
      throw error.response?.data?.validationErrors || error.response?.data?.message || 'Registration failed.';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = (newToken, updatedUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, isAuthenticated: !!user }}>
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
