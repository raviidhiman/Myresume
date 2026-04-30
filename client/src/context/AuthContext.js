import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('resume_token');
    if (!token) {
      setLoading(false);
      return;
    }
    // Verify token validity
    API.get('/auth/verify-token')
      .then((res) => {
        if (res.data.valid) setIsAuthenticated(true);
        else logout();
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  const login = (token) => {
    localStorage.setItem('resume_token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('resume_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
