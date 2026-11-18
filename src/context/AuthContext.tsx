import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, EmailSecurityNotification, ActiveDeviceSession } from '../types';
import { getClientDeviceInfo, ClientDeviceInfo } from '../utils/deviceHelper';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithGoogle: (customEmail?: string, customName?: string) => boolean;
  signInWithGithub: (customUsername?: string) => boolean;
  signInWithEmail: (email: string, name?: string) => boolean;
  signOut: () => void;

  // 3-Device Seat Limiter
  activeSeats: ActiveDeviceSession[];
  maxSeats: number;
  isSeatLimitExceeded: boolean;
  dismissSeatLimitModal: () => void;
  revokeSeat: (deviceId: string) => void;
  currentDeviceInfo: ClientDeviceInfo;

  // Security Email Notifications
  notifications: EmailSecurityNotification[];
  latestNotificationToast: EmailSecurityNotification | null;
  dismissNotificationToast: () => void;
  isSecurityInboxOpen: boolean;
  openSecurityInbox: () => void;
  closeSecurityInbox: () => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

const STORAGE_AUTH_KEY = 'clipfusion_auth_user_v2';
const STORAGE_SEATS_KEY = 'clipfusion_active_seats_v2';
const STORAGE_NOTIFICATIONS_KEY = 'clipfusion_email_notifications_v2';
export const MAX_ACTIVE_SEATS = 3;

export function generateInitialsAvatar(name: string): string {
  const cleanName = name.trim() || 'User';
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=8b5cf6,06b6d4,10b981,f59e0b`;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentDeviceInfo = getClientDeviceInfo();

  // 1. User Authentication State
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
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // 2. Active 3-Seat Device Manager State
  const [activeSeats, setActiveSeats] = useState<ActiveDeviceSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SEATS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [isSeatLimitExceeded, setIsSeatLimitExceeded] = useState<boolean>(false);

  // 3. Security Email Notifications State
  const [notifications, setNotifications] = useState<EmailSecurityNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_NOTIFICATIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [latestNotificationToast, setLatestNotificationToast] = useState<EmailSecurityNotification | null>(null);
  const [isSecurityInboxOpen, setIsSecurityInboxOpen] = useState<boolean>(false);

  // Sync state to localStorage
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SEATS_KEY, JSON.stringify(activeSeats));
    } catch {
      // ignore
    }
  }, [activeSeats]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const dismissSeatLimitModal = () => setIsSeatLimitExceeded(false);

  // Dispatch Transactional Security Email Notification
  const dispatchSecurityEmailNotification = (
    email: string,
    userName: string,
    method: 'Email OTP Verification' | 'Direct Email Auth' | 'Google OAuth 2.0' | 'GitHub OAuth'
  ) => {
    const newNotice: EmailSecurityNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      toEmail: email,
      userName: userName,
      subject: `🔐 Security Alert: Successful Sign-In to ClipFusion AI from ${currentDeviceInfo.name}`,
      timestamp: Date.now(),
      deviceInfo: currentDeviceInfo.name,
      browser: `${currentDeviceInfo.browser} (${currentDeviceInfo.os})`,
      ipAddress: currentDeviceInfo.ip,
      method: method,
      status: 'delivered',
      read: false
    };

    setNotifications((prev) => [newNotice, ...prev]);
    setLatestNotificationToast(newNotice);

    // Auto-dismiss floating toast after 8 seconds
    setTimeout(() => {
      setLatestNotificationToast((curr) => (curr?.id === newNotice.id ? null : curr));
    }, 8000);
  };

  // Register Device in 3-Seat Limiter Pool
  const registerDeviceSeat = (email: string, name: string): boolean => {
    const existingIndex = activeSeats.findIndex((s) => s.deviceId === currentDeviceInfo.id);

    if (existingIndex >= 0) {
      // Device already in pool; refresh timestamp and user
      setActiveSeats((prev) =>
        prev.map((s, idx) =>
          idx === existingIndex
            ? { ...s, lastActive: Date.now(), userEmail: email, userName: name }
            : s
        )
      );
      return true;
    }

    // New device: Check if 3-seat limit reached
    if (activeSeats.length >= MAX_ACTIVE_SEATS) {
      setIsSeatLimitExceeded(true);
      return false; // Block access!
    }

    // Under limit: Add device
    const newSeat: ActiveDeviceSession = {
      deviceId: currentDeviceInfo.id,
      userId: `usr_${Date.now()}`,
      userName: name,
      userEmail: email,
      deviceType: currentDeviceInfo.type,
      deviceName: currentDeviceInfo.name,
      browser: currentDeviceInfo.browser,
      lastActive: Date.now(),
      ipAddress: currentDeviceInfo.ip,
      isCurrentDevice: true
    };

    setActiveSeats((prev) => [...prev, newSeat]);
    return true;
  };

  // Revoke an active device seat
  const revokeSeat = (deviceId: string) => {
    setActiveSeats((prev) => prev.filter((s) => s.deviceId !== deviceId));
    if (deviceId === currentDeviceInfo.id) {
      signOut();
    }
  };

  // Dynamic Google Sign In
  const signInWithGoogle = (customEmail?: string, customName?: string): boolean => {
    const email = customEmail || prompt('Enter your Google Account Email:') || '';
    if (!email.trim()) return false;

    const name = customName || email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

    // 1. Strict 3-Seat Limit Check
    const seatGranted = registerDeviceSeat(email.trim().toLowerCase(), name);
    if (!seatGranted) {
      return false;
    }

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

    // 2. Dispatch Email Notification
    dispatchSecurityEmailNotification(newUser.email, newUser.name, 'Google OAuth 2.0');
    return true;
  };

  // Dynamic GitHub Sign In
  const signInWithGithub = (customUsername?: string): boolean => {
    const username = customUsername || prompt('Enter your GitHub Username / Handle:') || '';
    if (!username.trim()) return false;

    const cleanUsername = username.trim().replace(/^@/, '');
    const email = `${cleanUsername.toLowerCase()}@users.noreply.github.com`;

    // 1. Strict 3-Seat Limit Check
    const seatGranted = registerDeviceSeat(email, cleanUsername);
    if (!seatGranted) {
      return false;
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: cleanUsername,
      email: email,
      avatar: `https://avatars.githubusercontent.com/${cleanUsername}`,
      plan: 'Creator Pro',
      signedIn: true,
      memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    setUser(newUser);
    closeAuthModal();

    // 2. Dispatch Email Notification
    dispatchSecurityEmailNotification(newUser.email, newUser.name, 'GitHub OAuth');
    return true;
  };

  // Dynamic Email & OTP Sign In
  const signInWithEmail = (email: string, name?: string): boolean => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return false;
    }

    const cleanEmail = email.trim().toLowerCase();
    const derivedName = name?.trim() || cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

    // 1. Strict 3-Seat Limit Check
    const seatGranted = registerDeviceSeat(cleanEmail, derivedName);
    if (!seatGranted) {
      return false;
    }

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

    // 2. Dispatch Email Notification
    dispatchSecurityEmailNotification(newUser.email, newUser.name, 'Email OTP Verification');
    return true;
  };

  const signOut = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_AUTH_KEY);
      // Remove this device from active seats pool so someone else can sign in
      setActiveSeats((prev) => prev.filter((s) => s.deviceId !== currentDeviceInfo.id));
    } catch {
      // ignore
    }
  };

  const dismissNotificationToast = () => setLatestNotificationToast(null);
  const openSecurityInbox = () => setIsSecurityInboxOpen(true);
  const closeSecurityInbox = () => setIsSecurityInboxOpen(false);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
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
        signOut,
        activeSeats,
        maxSeats: MAX_ACTIVE_SEATS,
        isSeatLimitExceeded,
        dismissSeatLimitModal,
        revokeSeat,
        currentDeviceInfo,
        notifications,
        latestNotificationToast,
        dismissNotificationToast,
        isSecurityInboxOpen,
        openSecurityInbox,
        closeSecurityInbox,
        markNotificationRead,
        clearNotifications
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
