// Test Firebase connection
import { db } from './services/firebase';
import { collection, addDoc } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    
    // Test basic connection
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Connection test'
    };
    
    const docRef = await addDoc(collection(db, 'test'), testData);
    console.log('✅ Firebase connection successful! Test document ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return { success: false, error: error.message };
  }
};

// Run test if this file is imported
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase test module loaded. Call testFirebaseConnection() to test.');
}
