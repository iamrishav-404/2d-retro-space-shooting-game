import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

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

export default app;
