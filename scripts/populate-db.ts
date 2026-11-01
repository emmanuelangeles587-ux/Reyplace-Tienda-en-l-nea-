
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { PRODUCTS } from '../src/data/products';

// Initialize Firebase Admin
const app = initializeApp({
  projectId: 'gen-lang-client-0775139818'
});
const db = getFirestore(app, 'ai-studio-reyplacemxsmarth-ca424c5e-302a-4cce-a4f4-a35700c779df');

async function populate() {
  try {
    const batch = db.batch();
    PRODUCTS.forEach(product => {
      const docRef = db.collection('products').doc(product.id);
      batch.set(docRef, product);
    });
    await batch.commit();
    console.log('Products populated successfully');
  } catch (error) {
    console.error('Error populating products:', error);
  }
}

populate();
