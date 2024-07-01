'use client'
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../data/firestore'

const AuthStateContext = createContext<string>('');  

export const AuthContextProvider = ({ children }: {children: React.ReactNode;}) => {
  const [userName, setUserName] = useState<string>('');
  
  useEffect(() => {
      authService.onAuthStateChanged((user) => {
        if (user && user.email) {
          setUserName(user.email);
        } else {
          setUserName('');
        }
      });
    }, []);
  
    return (
      <AuthStateContext.Provider value={userName}>
        {children}
      </AuthStateContext.Provider>
    );
};

export const useAuthState = () => {
  const authState = useContext(AuthStateContext);
  console.log("authState: " + authState);
  return authState;
};