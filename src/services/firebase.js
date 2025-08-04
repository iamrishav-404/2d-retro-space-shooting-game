import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA078X8R_cK5n39KM-YnnZ_6VODVo4M04E",
  authDomain: "retro-shooting-game.firebaseapp.com",
  databaseURL: "https://retro-shooting-game-default-rtdb.firebaseio.com",
  projectId: "retro-shooting-game",
  storageBucket: "retro-shooting-game.firebasestorage.app",
  messagingSenderId: "785496370691",
  appId: "1:785496370691:web:5187328b6efec247bfe836"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);


export const signInAnonymousUser = async () => {
  try {
    const result = await signInAnonymously(auth);
    console.log('Anonymous user signed in:', result.user.uid);
    return result.user;
  } catch (error) {
    console.error('Error signing in anonymously:', error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export default app;
