import { 
  collection, 
  addDoc, 
  getDocs, 
  setDoc,
  doc,
  getDoc,
  deleteDoc,
  orderBy, 
  query, 
  limit, 
  where
} from 'firebase/firestore';
import { db, signInAnonymousUser, getCurrentUser } from './firebase';

export const ensureAuthenticated = async () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    await signInAnonymousUser();
    return getCurrentUser();
  }
  return currentUser;
};

export const createPlayerProfile = async (playerName) => {
  const user = await ensureAuthenticated();
  if (!user) throw new Error('Authentication failed');

  const playerData = {
    playerName: playerName.trim().substring(0, 20),
    scores: [],
    stats: {
      gamesPlayed: 0,
      totalScore: 0,
      bestScore: 0,
      averageScore: 0
    },
    createdAt: new Date().toISOString(),
    lastPlayed: new Date().toISOString()
  };

  await setDoc(doc(db, 'players', user.uid), playerData);
  return { userId: user.uid, ...playerData };
};

export const initializePlayerForGame = async (playerName) => {
  const user = await ensureAuthenticated();
  if (!user) throw new Error('Authentication failed');

  let profile = await getPlayerProfile();
  
  if (!profile) {
    profile = await createPlayerProfile(playerName);
  }

  return profile;
};

export const getPlayerProfile = async () => {
  const user = await ensureAuthenticated();
  if (!user) throw new Error('Authentication failed');

  const playerDoc = await getDoc(doc(db, 'players', user.uid));
  
  if (playerDoc.exists()) {
    return { userId: user.uid, ...playerDoc.data() };
  } else {
    return null;
  }
};

export const updatePlayerProfile = async (updates) => {
  const user = await ensureAuthenticated();
  if (!user) throw new Error('Authentication failed');

  const playerRef = doc(db, 'players', user.uid);
  const currentData = await getDoc(playerRef);
  
  if (!currentData.exists()) {
    throw new Error('Player profile not found');
  }

  const updatedData = {
    ...currentData.data(),
    ...updates,
    lastPlayed: new Date().toISOString()
  };

  await setDoc(playerRef, updatedData);
  return updatedData;
};

// Score Management Service
export const saveScore = async (playerName, score, isWinner = false) => {
  const user = await ensureAuthenticated();
  if (!user) throw new Error('Authentication failed');

  if (!playerName || typeof playerName !== 'string' || playerName.trim().length === 0) {
    throw new Error('Invalid player name');
  }
  if (typeof score !== 'number' || score < 0 || !isFinite(score)) {
    throw new Error('Invalid score value');
  }

  let playerProfile = await getPlayerProfile();
  if (!playerProfile) {
    playerProfile = await createPlayerProfile(playerName);
  }

  const currentBestScore = playerProfile.stats?.bestScore || 0;
  const newScore = Math.floor(score);
  let leaderboardRef = null;

  // Only add to leaderboard if this is a new best score
  if (newScore > currentBestScore) {
    // First, remove any existing leaderboard entries for this user
    const existingEntriesQuery = query(
      collection(db, 'leaderboard'),
      where('userId', '==', user.uid)
    );
    const existingEntries = await getDocs(existingEntriesQuery);
    
    // Delete all existing entries for this user
    const deletePromises = existingEntries.docs.map(docSnap => 
      deleteDoc(doc(db, 'leaderboard', docSnap.id))
    );
    await Promise.all(deletePromises);

    // Now add the new best score
    const scoreData = {
      playerName: playerName.trim().substring(0, 20),
      score: newScore,
      timestamp: new Date().toISOString(),
      userId: user.uid,
      gameVersion: '1.0',
      isWinner: isWinner
    };

    leaderboardRef = await addDoc(collection(db, 'leaderboard'), scoreData);
  }

  await updatePlayerScoreHistory(score, playerName);

  return leaderboardRef ? leaderboardRef.id : 'personal_record_only';
};

const updatePlayerScoreHistory = async (score, playerName) => {
  try {
    const user = getCurrentUser();
    if (!user) return;

    let playerProfile = await getPlayerProfile();
    
    if (!playerProfile) {
      playerProfile = await createPlayerProfile(playerName);
    }

    const newScore = {
      score: Math.floor(score),
      timestamp: new Date().toISOString()
    };

    // Keep last 50 scores only
    const scores = [...(playerProfile.scores || []), newScore];
    if (scores.length > 50) {
      scores.splice(0, scores.length - 50);
    }

    // Calculate updated stats
    const gamesPlayed = (playerProfile.stats.gamesPlayed || 0) + 1;
    const totalScore = (playerProfile.stats.totalScore || 0) + score;
    const bestScore = Math.max(playerProfile.stats.bestScore || 0, score);
    const averageScore = totalScore / gamesPlayed;

    const updates = {
      playerName: playerName.trim().substring(0, 20),
      scores: scores,
      stats: {
        gamesPlayed,
        totalScore,
        bestScore,
        averageScore: Math.round(averageScore)
      }
    };

    await updatePlayerProfile(updates);
  } catch (error) {
    // Not throwing here - leaderboard save is more important
  }
};


export const getHighScores = async () => {
  const q = query(
    collection(db, 'leaderboard'),
    orderBy('score', 'desc'),
    limit(100)
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
};

export const getLeaderboard = async (limitCount = 10) => {
  try {
    const q = query(
      collection(db, 'leaderboard'),
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
        timestamp: data.timestamp || new Date().toISOString(),
        userId: data.userId || 'anonymous',
        isWinner: data.isWinner || false
      });
    });
    
    return scores;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw new Error('Failed to load leaderboard');
  }
};


export const checkPlayerNameExists = async (playerName) => {
  try {
    const q = query(
      collection(db, 'leaderboard'),
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
      
      existingScores.sort((a, b) => b.score - a.score);
      return {
        exists: true,
        bestScore: existingScores[0].score,
        totalEntries: existingScores.length
      };
    }
    
    return { exists: false };
  } catch (error) {
    return { exists: false };
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
        randomNum = 1;
        candidateName = `${cleanBaseName}${randomNum}`;
      } else {
        randomNum = Math.floor(Math.random() * 9999) + 1;
        candidateName = `${cleanBaseName}${randomNum}`;
      }
      
      if (candidateName.length > 15) {
        const maxBaseLength = 15 - String(randomNum).length;
        const truncatedBase = cleanBaseName.substring(0, maxBaseLength);
        candidateName = `${truncatedBase}${randomNum}`;
      }
      
      const nameCheck = await checkPlayerNameExists(candidateName);
      if (!nameCheck.exists) {
        return candidateName;
      }
      
      attempts++;
    }
    
    const timestamp = Date.now().toString().slice(-4);
    const fallbackBase = cleanBaseName.substring(0, 11);
    return `${fallbackBase}${timestamp}`;
  } catch (error) {
    return `Player${Math.floor(Math.random() * 9999)}`;
  }
};

export const getCurrentUserId = () => {
  const user = getCurrentUser();
  return user ? user.uid : null;
};

export const isUserAuthenticated = () => {
  return getCurrentUser() !== null;
};
