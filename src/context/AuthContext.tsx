import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type UserRole = 'guest' | 'user' | 'superadmin';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'guest',
  isAuthenticated: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>('guest');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) {
        setRole('user');
      } else {
        setRole('guest');
      }
    });
    return unsubscribe;
  }, []);

  const signIn = async () => {
    await signInWithPopup(auth, googleAuthProvider);
  };

  const signUp = async (email: string, password: string) => {
    const validation = registerSchema.safeParse({ email, password });
    if (!validation.success) {
      throw new Error(validation.error.errors[0].message);
    }
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated: !!user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
