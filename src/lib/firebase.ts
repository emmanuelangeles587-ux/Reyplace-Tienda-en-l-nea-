import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

export const db = getFirestore(app);
export const messaging = getMessaging(app);
export const googleAuthProvider = new GoogleAuthProvider();

export const saveCart = async (userId: string, cart: Map<string, number>) => {
  const cartRef = doc(db, 'users', userId, 'cart', 'default');
  await setDoc(cartRef, { items: Object.fromEntries(cart) });
};

export const getCart = async (userId: string): Promise<Map<string, number>> => {
  const cartRef = doc(db, 'users', userId, 'cart', 'default');
  const snap = await getDoc(cartRef);
  if (snap.exists()) {
    return new Map(Object.entries(snap.data().items));
  }
  return new Map();
};
