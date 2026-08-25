import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin safely
const apps = getApps();

if (!apps.length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const adminAuth = getAuth();

/**
 * Creates a user in Firebase Auth without a password (they will set it via email link)
 */
export async function createFirebaseUser(email: string, displayName: string) {
  try {
    const userRecord = await adminAuth.createUser({
      email,
      displayName,
      emailVerified: false,
    });
    return userRecord;
  } catch (error: any) {
    throw new Error(error.message || 'Error creating user in Firebase.');
  }
}

/**
 * Finds a user by email and updates their password in Firebase Auth
 */
export async function updateFirebasePassword(email: string, newPassword: string) {
  try {
    // 1. Look up the user by email to get their correct Firebase UID
    const userRecord = await adminAuth.getUserByEmail(email);
    
    if (!userRecord || !userRecord.uid) {
      throw new Error('User not found in Firebase Auth.');
    }

    // 2. Update the user's password using their UID
    await adminAuth.updateUser(userRecord.uid, {
      password: newPassword,
    });

    return { success: true, uid: userRecord.uid };
  } catch (error: any) {
    console.error('Firebase password update error:', error);
    throw new Error(error.message || 'User not found in Firebase Auth.');
  }
}