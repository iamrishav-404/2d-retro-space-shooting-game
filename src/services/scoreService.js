import { collection, addDoc, getDocs, orderBy, query, limit, where } from 'firebase/firestore';
import { db } from './firebase';

export const checkPlayerNameExists = async (playerName) => {
  try {
    const q = query(
      collection(db, 'scores'),
      where('playerName', '==', playerName.trim())
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const existingScores = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        existingScores.push({
          score: data.score || 0,
          timestamp: data.timestamp || new Date().toISOString()
        });
      });
      
      // Sort by score descending to get the best score
      existingScores.sort((a, b) => b.score - a.score);
      return {
        exists: true,
        bestScore: existingScores[0].score,
        totalEntries: existingScores.length
      };
    }
    
    return { exists: false };
  } catch (error) {
    console.error('Error checking player name:', error);
    throw new Error('Failed to check player name availability.');
  }
};

export const generateUniquePlayerName = async (baseName) => {
  try {
    const cleanBaseName = baseName.trim();
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      let candidateName;
      let randomNum;
      
      if (attempts === 0) {
        // First try with a simple number suffix
        randomNum = 1;
        candidateName = `${cleanBaseName}${randomNum}`;
      } else {
        // Generate random variations
        randomNum = Math.floor(Math.random() * 9999) + 1;
        candidateName = `${cleanBaseName}${randomNum}`;
      }
      
      // Ensure name doesn't exceed length limit
      if (candidateName.length > 15) {
        const maxBaseLength = 15 - String(randomNum).length;
        const truncatedBase = cleanBaseName.substring(0, maxBaseLength);
        candidateName = `${truncatedBase}${randomNum}`;
      }
      
      // Check if this candidate name is available
      const nameCheck = await checkPlayerNameExists(candidateName);
      if (!nameCheck.exists) {
        return candidateName;
      }
      
      attempts++;
    }
    
    // Fallback: use timestamp-based name
    const timestamp = Date.now().toString().slice(-4);
    let fallbackName = `${cleanBaseName.substring(0, 10)}${timestamp}`;
    if (fallbackName.length > 15) {
      fallbackName = `Player${timestamp}`;
    }
    
    return fallbackName;
  } catch (error) {
    console.error('Error generating unique name:', error);
    // Ultimate fallback
    return `Player${Math.floor(Math.random() * 9999)}`;
  }
};

export const saveScore = async (playerName, score) => {
  try {
    // Validate input data
    if (!playerName || typeof playerName !== 'string' || playerName.trim().length === 0) {
      throw new Error('Invalid player name: ' + playerName);
    }
    
    if (typeof score !== 'number' || score < 0 || !isFinite(score)) {
      throw new Error('Invalid score value: ' + score);
    }

    const scoreData = {
      playerName: playerName.trim().substring(0, 20), // Limit name length
      score: Math.floor(score), // Ensure integer
      timestamp: new Date().toISOString(),
      gameVersion: '1.0'
    };

    console.log('Attempting to save score:', scoreData);
    
    const docRef = await addDoc(collection(db, 'scores'), scoreData);
    console.log('Score saved successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving score:', {
      message: error.message,
      code: error.code,
      details: error
    });
    
    // Provide user-friendly error messages
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check Firestore security rules.');
    } else if (error.code === 'unavailable') {
      throw new Error('Service temporarily unavailable. Please try again later.');
    } else if (error.message.includes('Invalid')) {
      throw error;
    } else {
      throw new Error('Failed to save score. Please check your internet connection.');
    }
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
      const data = doc.data();
      scores.push({
        id: doc.id,
        playerName: data.playerName || 'Unknown',
        score: data.score || 0,
        timestamp: data.timestamp || new Date().toISOString()
      });
    });
    return scores;
  } catch (error) {
    console.error('Error getting high scores:', {
      message: error.message,
      code: error.code,
      details: error
    });
    
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check Firestore security rules.');
    } else {
      throw new Error('Failed to load high scores. Please check your internet connection.');
    }
  }
};
