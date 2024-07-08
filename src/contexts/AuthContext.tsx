'use client';
import React, {createContext, useState, useEffect, useContext} from 'react';
import {authService} from '../data/firestore';
import {User} from 'firebase/auth';

export const AuthStateContext = createContext<User | null>(null);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    authService.onAuthStateChanged(authuser => {
      setUser(authuser);
    });
  }, []);

  return (
    <AuthStateContext.Provider value={user}>
      {children}
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => {
  const authState = useContext(AuthStateContext);
  return authState;
};
