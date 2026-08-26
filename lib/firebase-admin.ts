import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

let firebaseApp: App;

function initializeFirebaseAdmin(): App {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase Admin environment variables.');
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });
}

firebaseApp = initializeFirebaseAdmin();
const adminAuth: Auth = getAuth(firebaseApp);

export async function createFirebaseUser(email: string, displayName: string) {
  try {
    const userRecord = await adminAuth.createUser({
      email,
      displayName,
      emailVerified: false,
    });
    return userRecord;
  } catch (error: any) {
    console.error('Firebase create user error:', error);
    throw new Error(error?.message || 'Error creating user in Firebase.');
  }
}

export async function updateFirebasePassword(email: string, newPassword: string) {
  try {
    const userRecord = await adminAuth.getUserByEmail(email);
    if (!userRecord?.uid) {
      throw new Error('User not found in Firebase Auth.');
    }

    await adminAuth.updateUser(userRecord.uid, {
      password: newPassword,
    });

    return { success: true, uid: userRecord.uid };
  } catch (error: any) {
    console.error('Firebase password update error:', error);
    throw new Error(error?.message || 'Unable to update Firebase password.');
  }
}