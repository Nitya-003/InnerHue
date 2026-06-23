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

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    if (!isFirebaseConfigured || !auth) return;
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return { user, loading, signOut };
}