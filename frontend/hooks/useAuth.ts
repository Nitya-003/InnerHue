import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Firebase isn't configured, skip auth entirely
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

  const unsubscribe = onAuthStateChanged(
  auth,
  (currentUser) => {
    setUser(currentUser);
    setLoading(false);
  },
  (error) => {
    console.error('Auth state change error:', error);
    setUser(null);
    setLoading(false);
  }
);

    return () => unsubscribe();
  }, []);


  const signOut = async (): Promise<{ success: boolean; error?: unknown }> => {
    if (!isFirebaseConfigured || !auth) return { success: false };
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Error signing out: ', error);
      return { success: false, error };
    }
  };

  return { user, loading, signOut };
}