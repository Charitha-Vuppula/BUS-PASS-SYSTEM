import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for user info on load
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const handleSetUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('userInfo', JSON.stringify(userData));
    } else {
      localStorage.removeItem('userInfo');
    }
  };

  const login = (userData) => {
    handleSetUser(userData);
  };

  const logout = () => {
    handleSetUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser: handleSetUser }}>
      {children}
    </AuthContext.Provider>
  );
};
