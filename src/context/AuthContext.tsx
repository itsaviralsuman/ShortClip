import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => void;
  signInWithGithub: () => void;
  signInWithEmail: (email: string, name?: string) => void;
  signOut: () => void;
}

const STORAGE_AUTH_KEY = 'clipfusion_auth_user_v1';

const DEFAULT_USER: UserProfile = {
  id: 'usr_aviral_1',
  name: 'Aviral Suman',
  email: 'itsaviralsuman@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  plan: 'Creator Pro',
  signedIn: true,
  memberSince: 'November 2026'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_AUTH_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_USER; // Default logged in as creator pro
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_AUTH_KEY);
      }
    } catch {
      // ignore
    }
  }, [user]);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const signInWithGoogle = () => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: 'Aviral Suman (Google)',
      email: 'itsaviralsuman@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      plan: 'Creator Pro',
      signedIn: true,
      memberSince: 'November 2026'
    };
    setUser(newUser);
    closeAuthModal();
  };

  const signInWithGithub = () => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: 'itsaviralsuman',
      email: 'itsaviralsuman@github.com',
      avatar: 'https://avatars.githubusercontent.com/u/itsaviralsuman?v=4',
      plan: 'Creator Pro',
      signedIn: true,
      memberSince: 'November 2026'
    };
    setUser(newUser);
    closeAuthModal();
  };

  const signInWithEmail = (email: string, name?: string) => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name || email.split('@')[0],
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      plan: 'Creator Pro',
      signedIn: true,
      memberSince: 'November 2026'
    };
    setUser(newUser);
    closeAuthModal();
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user?.signedIn,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        signInWithGithub,
        signInWithEmail,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
