import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  try {
    if (process.env.FIREBASE_PROJECT_ID) {
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };

      initializeApp({
        credential: cert(serviceAccount),
      });
      console.log('Firebase Admin initialized successfully');
    } else {
      console.warn('Firebase Admin skipped: missing FIREBASE_PROJECT_ID (expected during build)');
    }
  } catch (error) {
    console.error('Firebase Admin initialization error', error);
  }
}

export const adminDb = getApps().length ? getFirestore() : ({} as any);
export const adminAuth = getApps().length ? getAuth() : ({} as any);
