import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const getFormattedPrivateKey = () => {
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!rawKey) return undefined;

  // Handles double-escaped newlines and strips surrounding raw quotes if present
  return rawKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
};

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: getFormattedPrivateKey(),
    }),
  });
}

export const adminAuth = getAuth();