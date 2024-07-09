'use client';
import React, {createContext, useState, useEffect, useContext} from 'react';
import {authService} from '../data/firestore';
import {User, updateProfile} from 'firebase/auth';

export const AuthStateContext = createContext<User | null>(null);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    authService.onAuthStateChanged(authuser => {
      if (authuser) {
        const displayName = authuser.email?.split('@')[0];
        if (displayName) {
          updateCurrentUserProfile(displayName);
        }
      }
      setUser(authuser);
    });
  }, []);

  const updateCurrentUserProfile = async (newDisplayName: string) => {
    const currentUser = authService.currentUser;
    if (currentUser) {
      try {
        await updateProfile(currentUser, {
          displayName: newDisplayName,
        });
        console.log('프로필 업데이트 성공');
      } catch (error) {
        console.error('프로필 업데이트 실패:', error);
      }
    }
  };

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
