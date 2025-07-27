import { collection, addDoc, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from './firebase';

export const saveScore = async (playerName, score) => {
  try {
    const docRef = await addDoc(collection(db, 'scores'), {
      playerName,
      score,
      timestamp: new Date().toISOString()
    });
    console.log('Score saved with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving score: ', error);
    throw error;
  }
};

export const getHighScores = async (limitCount = 10) => {
  try {
    const q = query(
      collection(db, 'scores'),
      orderBy('score', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const scores = [];
    querySnapshot.forEach((doc) => {
      scores.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return scores;
  } catch (error) {
    console.error('Error getting high scores: ', error);
    throw error;
  }
};
