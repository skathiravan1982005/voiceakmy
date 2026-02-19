import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User as FirebaseUser, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: (role: UserRole, userId?: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, role: UserRole, displayName: string, userId?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserRole: (role: UserRole, userId?: string) => Promise<void>;
  setDummyUser: (role: UserRole, userId?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      
      if (fbUser) {
        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: userData.displayName || fbUser.displayName || '',
            photoURL: fbUser.photoURL,
            role: userData.role as UserRole,
            userId: userData.userId,
            createdAt: userData.createdAt?.toDate() || new Date(),
          });
        } else {
          // User authenticated but not in Firestore (needs role selection)
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (role: UserRole, userId?: string) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      
      // Create or update user in Firestore
      await setDoc(doc(db, 'users', fbUser.uid), {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        photoURL: fbUser.photoURL,
        role,
        userId: role !== 'student' ? userId : null,
        createdAt: serverTimestamp(),
      });

      setUser({
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName: fbUser.displayName || '',
        photoURL: fbUser.photoURL,
        role,
        userId: role !== 'student' ? userId : undefined,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (
    email: string, 
    password: string, 
    role: UserRole, 
    displayName: string,
    userId?: string
  ) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = result.user;
      
      await setDoc(doc(db, 'users', fbUser.uid), {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName,
        photoURL: null,
        role,
        userId: role !== 'student' ? userId : null,
        createdAt: serverTimestamp(),
      });

      setUser({
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName,
        photoURL: null,
        role,
        userId: role !== 'student' ? userId : undefined,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error signing up with email:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateUserRole = async (role: UserRole, userId?: string) => {
    if (!firebaseUser) return;
    
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      role,
      userId: role !== 'student' ? userId : null,
      createdAt: serverTimestamp(),
    });

    setUser({
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL,
      role,
      userId: role !== 'student' ? userId : undefined,
      createdAt: new Date(),
    });
  };

  // Dummy user for development/testing - bypasses Firebase auth
  const setDummyUser = (role: UserRole, userId?: string) => {
    setUser({
      uid: 'dummy-user-' + Date.now(),
      email: 'dummy@example.com',
      displayName: 'Demo User',
      photoURL: null,
      role,
      userId: role !== 'student' ? userId : undefined,
      createdAt: new Date(),
    });
  };

  const value = {
    user,
    firebaseUser,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    updateUserRole,
    setDummyUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
