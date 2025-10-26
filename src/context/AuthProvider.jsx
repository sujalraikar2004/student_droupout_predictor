import { createContext, useState, useEffect } from "react";
import React from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
   
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      setToken(storedToken); 
    }
  }, []); 

  

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
