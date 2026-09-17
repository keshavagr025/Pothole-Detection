import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getAuthProfile, updateAuthProfile } from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'marg_auth_token';
const USER_KEY = 'marg_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem(USER_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [isLoading, setIsLoading] = useState(true);
  const [authModalState, setAuthModalState] = useState({
    isOpen: false,
    initialTab: 'login', // 'login' | 'register'
    initialRole: 'citizen' // 'citizen' | 'officer'
  });

  // Verify and sync token on initial mount
  useEffect(() => {
    async function syncSession() {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        try {
          const res = await getAuthProfile();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem(USER_KEY, JSON.stringify(res.user));
          } else {
            logout();
          }
        } catch (err) {
          console.warn('[AuthContext] Session verification failed, falling back to cached profile:', err.message);
        }
      }
      setIsLoading(false);
    }

    syncSession();
  }, []);

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    if (res.success && res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      setAuthModalState(prev => ({ ...prev, isOpen: false }));
      return res.user;
    }
    throw new Error(res.error || 'Authentication failed');
  };

  const register = async (userData) => {
    const res = await registerUser(userData);
    if (res.success && res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      setAuthModalState(prev => ({ ...prev, isOpen: false }));
      return res.user;
    }
    throw new Error(res.error || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = async (profileData) => {
    const res = await updateAuthProfile(profileData);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      return res.user;
    }
    throw new Error(res.error || 'Profile update failed');
  };

  const openAuthModal = (initialTab = 'login', initialRole = 'citizen') => {
    setAuthModalState({
      isOpen: true,
      initialTab,
      initialRole
    });
  };

  const closeAuthModal = () => {
    setAuthModalState(prev => ({ ...prev, isOpen: false }));
  };

  const isOfficer = user?.role === 'officer' || user?.role === 'admin';
  const isCitizen = user?.role === 'citizen';

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isOfficer,
    isCitizen,
    isLoading,
    authModalState,
    login,
    register,
    logout,
    updateUserProfile,
    openAuthModal,
    closeAuthModal
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
