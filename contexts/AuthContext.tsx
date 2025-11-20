
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../firebase';
import firebase from 'firebase/compat/app';

interface LoginResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<LoginResult>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false, error: 'Login function not initialized.' }),
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<LoginResult> => {
    try {
      await auth.signInWithEmailAndPassword(email, pass);
      window.location.hash = '#admin';
      return { success: true };
    } catch (error: any) {
      console.error("Firebase login error:", error);
      if (error.code === 'auth/invalid-login-credentials' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        return { success: false, error: 'Invalid email or password. Please double-check your credentials.' };
      }
      return { success: false, error: 'An unexpected error occurred during login. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      window.location.hash = '#home';
    } catch (error) {
      console.error("Firebase logout error:", error);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
