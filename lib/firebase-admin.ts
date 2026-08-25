import { getApps, initializeApp, cert } from 'firebase-admin/app';

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

  // Bypass Turbopack static analysis by evaluating the import at runtime
  const { getAuth } = await (eval(`import('firebase-admin/auth')`) as Promise<
    typeof import('firebase-admin/auth')
  >);

  return getAuth();
}