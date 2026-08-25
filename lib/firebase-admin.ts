import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export async function getAdminAuth() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }

  // Forces native CJS module loading at runtime on Vercel
  const firebaseAdmin = require('firebase-admin');
  return firebaseAdmin.auth();
}