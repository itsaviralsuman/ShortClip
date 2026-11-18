import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithGoogle: (customEmail?: string, customName?: string) => void;
  signInWithGithub: (customUsername?: string) => void;
  signInWithEmail: (email: string, name?: string) => void;
  signOut: () => void;
}

const STORAGE_AUTH_KEY = 'clipfusion_auth_user_v2';

export function generateInitialsAvatar(name: string): string {
  const cleanName = name.trim() || 'User';
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=8b5cf6,06b6d4,10b981,f59e0b`;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // STRICT: By default user is NOT logged in on any new device or phone!
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_AUTH_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.signedIn && parsed.email) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return null; // Start cleanly as guest/logged out on every new device
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (user && user.signedIn) {
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

  // Dynamic Google Sign In with whatever account email is provided
  const signInWithGoogle = (customEmail?: string, customName?: string) => {
    const email = customEmail || prompt('Enter your Google Account Email:') || '';
    if (!email.trim()) return;

    const name = customName || email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name,
      email: email.trim().toLowerCase(),
      avatar: generateInitialsAvatar(name),
      plan: 'Creator Pro',
      signedIn: true,
      memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };
    setUser(newUser);
    closeAuthModal();
  };

  // Dynamic GitHub Sign In
  const signInWithGithub = (customUsername?: string) => {
    const username = customUsername || prompt('Enter your GitHub Username / Handle:') || '';
    if (!username.trim()) return;

    const cleanUsername = username.trim().replace(/^@/, '');
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: cleanUsername,
      email: `${cleanUsername.toLowerCase()}@users.noreply.github.com`,
      avatar: `https://avatars.githubusercontent.com/${cleanUsername}`,
      plan: 'Creator Pro',
      signedIn: true,
      memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };
    setUser(newUser);
    closeAuthModal();
  };

  // Dynamic Email Sign In with user's actual email address
  const signInWithEmail = (email: string, name?: string) => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const derivedName = name?.trim() || cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: derivedName,
      email: cleanEmail,
      avatar: generateInitialsAvatar(derivedName),
      plan: 'Creator Pro',
      signedIn: true,
      memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };
    setUser(newUser);
    closeAuthModal();
  };

  const signOut = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_AUTH_KEY);
    } catch {
      // ignore
    }
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
