import React, { createContext, useState, useEffect } from 'react';
import { getAuthToken, getAuthUser, setAuthData, clearAuthData } from '../utils/tokenHelper';
import { authApi } from '../api/authApi';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Critical for initial app load

  // Rehydrate session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getAuthToken();
      const storedUser = getAuthUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        setIsAuthenticated(true);
        
        // Optional: Verify token silently in background
        try {
          await authApi.getProfile(); // Uses the interceptor injected token
        } catch (error) {
          console.error("Session expired or invalid");
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const { data, message } = await authApi.login(credentials);
      
      const { token, user } = data;
      
      // Update Context State
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      // Persist to localStorage
      setAuthData(token, user);
      
      toast.success(message || 'Login successful!');
      return user; // Return user so component can handle redirection
    } catch (error) {
      const errMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errMessage);
      throw new Error(errMessage);
    }
  };

  const register = async (userData) => {
    try {
      const { message } = await authApi.register(userData);
      toast.success(message || 'Registration successful! Please login.');
      return true;
    } catch (error) {
      const errMessage = error.response?.data?.message || 'Registration failed.';
      toast.error(errMessage);
      throw new Error(errMessage);
    }
  };

  const updateUser = (updatedUser) => {
    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    // Update localStorage
    const storedToken = getAuthToken();
    if (storedToken) {
      setAuthData(storedToken, newUser);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    clearAuthData();
    // Optional: redirect logic is usually handled by components or protected routes
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
