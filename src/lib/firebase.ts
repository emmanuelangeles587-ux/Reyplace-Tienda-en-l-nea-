import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const messaging = getMessaging(app);
export const googleAuthProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const saveCart = async (userId: string, cart: Map<string, number>) => {
  const path = `users/${userId}/cart/default`;
  try {
    const cartRef = doc(db, 'users', userId, 'cart', 'default');
    await setDoc(cartRef, { items: Object.fromEntries(cart) });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getCart = async (userId: string): Promise<Map<string, number>> => {
  const path = `users/${userId}/cart/default`;
  try {
    const cartRef = doc(db, 'users', userId, 'cart', 'default');
    const snap = await getDoc(cartRef);
    if (snap.exists() && snap.data()?.items) {
      return new Map(Object.entries(snap.data().items));
    }
    return new Map();
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return new Map();
  }
};
