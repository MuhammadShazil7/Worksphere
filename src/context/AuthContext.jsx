// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      const userData = response.data.user;
      
      const userDataWithId = {
        ...userData,
        id: userData.id || userData._id,
        _id: userData._id || userData.id
      };
      
      setUser(userDataWithId);
      localStorage.setItem('user', JSON.stringify(userDataWithId));
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email); // Debug log
      
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data); // Debug log
      
      const { token, user } = response.data;
      
      const userData = {
        ...user,
        id: user.id || user._id,
        _id: user._id || user.id
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(token);
      setUser(userData);
      
      console.log('User logged in:', userData); // Debug log
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Login error response:', error.response?.data); // Debug log
      throw error.response?.data || { message: 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      const userDataWithId = {
        ...user,
        id: user.id || user._id,
        _id: user._id || user.id
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userDataWithId));
      setToken(token);
      setUser(userDataWithId);
      
      return { success: true, user: userDataWithId };
    } catch (error) {
      console.error('Register error:', error);
      throw error.response?.data || { message: 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    const userData = {
      ...updatedUser,
      id: updatedUser.id || updatedUser._id,
      _id: updatedUser._id || updatedUser.id
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    token,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};