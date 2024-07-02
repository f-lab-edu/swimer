'use client'
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../data/firestore'

interface AuthContextType {
  userEmail: string | null;
  displayName: string | null;
}

const AuthStateContext = createContext<AuthContextType>({userEmail: null, displayName: null});

export const AuthContextProvider = ({ children }: {children: React.ReactNode;}) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  
  useEffect(() => {
      authService.onAuthStateChanged((user) => {
        if (user) {
          setUserEmail(user.email);
          setDisplayName(user.email ? user.email.split('@')[0] : null);
        } else {
          setUserEmail(null);
          setDisplayName(null);
        }
      });
    }, []);
  
    return (
      <AuthStateContext.Provider value={{ userEmail, displayName }}>
        {children}
      </AuthStateContext.Provider>
    );
};

export const useAuthState = () => {
  const authState = useContext(AuthStateContext);
  return authState;
};