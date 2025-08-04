import  { useState, useEffect } from 'react';
import { 
  checkPlayerNameExists, 
  generateUniquePlayerName,
  ensureAuthenticated,
  getPlayerProfile,
  initializePlayerForGame,
} from '../services/authScoreService';
import { onAuthChange } from '../services/firebase';
import '../styles/MainMenu.css';

const MainMenu = ({ onStartGame, onShowHighScores }) => {
  const [playerName, setPlayerName] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [nameConflict, setNameConflict] = useState(null);
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [generatingName, setGeneratingName] = useState(false);
  const [authStatus, setAuthStatus] = useState('checking'); 
  const [userProfile, setUserProfile] = useState(null);
  const [showAuthStatus, setShowAuthStatus] = useState(true);


  useEffect(() => {
    let unsubscribe = null;
    
    const initAuth = async () => {
      try {
        // Set up auth state listener
        unsubscribe = onAuthChange(async (user) => {
          if (user) {
            setAuthStatus('authenticated');
 
            try {
              const profile = await getPlayerProfile();
              if (profile) {
                setUserProfile(profile);
                setPlayerName(profile.playerName || '');
              }
            } catch (error) {
              // No existing profile found, ignore
            }
          } else {
            setAuthStatus('ready'); 
          }
        });
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setAuthStatus('error');
      }
    };

    initAuth();

    const timer = setTimeout(() => {
      setShowAuthStatus(false);
    }, 3000);

    // Cleanup subscription and timer on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      clearTimeout(timer);
    };
  }, []);

  const handleStartGame = async () => {
    if (!playerName.trim()) return;
    
    setIsChecking(true);
    try {
      const nameCheck = await checkPlayerNameExists(playerName.trim());
      
      if (nameCheck.exists) {
        setNameConflict({
          name: playerName.trim()
        });
        setShowConflictDialog(true);
        setIsChecking(false);
        return;
      }


      if (authStatus === 'ready') {
        await ensureAuthenticated();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      await initializePlayerForGame(playerName.trim());

      onStartGame(playerName.trim());
      
    } catch (error) {
      console.error('Error during game start process:', error);
      setAuthStatus('error');
    } finally {
      setIsChecking(false);
    }
  };

  const handleForceStart = async () => {
    setGeneratingName(true);
    try {
      const uniqueName = await generateUniquePlayerName(nameConflict.name);
      
      setShowConflictDialog(false);
      setNameConflict(null);

      if (authStatus === 'ready') {
        await ensureAuthenticated();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      await initializePlayerForGame(uniqueName);
      
      onStartGame(uniqueName);
    } catch (error) {
      // Fallback: use a session-based random name
      const fallbackName = `Player${Math.floor(Math.random() * 9999)}`;
      
      if (authStatus === 'ready') {
        try {
          await ensureAuthenticated();
          await new Promise(resolve => setTimeout(resolve, 1000));
          await initializePlayerForGame(fallbackName);
        } catch (authError) {
          // Continue with fallback name even if auth fails
        }
      }
      
      onStartGame(fallbackName);
    } finally {
      setGeneratingName(false);
    }
  };

  const handleModifyName = () => {
    setShowConflictDialog(false);
    setNameConflict(null);
    const input = document.getElementById('playerName');
    if (input) input.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && playerName.trim()) {
      handleStartGame();
    }
  };

  return (
    <div className="main-menu">
      <div className="menu-container">
        <h1 className="game-title">
          <span className="title-line">RETRO</span>
          <span className="title-line">SPACE</span>
          <span className="title-line">SHOOTER</span>
        </h1>
        
        {/* Authentication Status */}
        {showAuthStatus && (
          <div className="auth-status">
            {authStatus === 'checking' && (
              <div className="auth-indicator checking">
                🔄 Initializing...
              </div>
            )}
            {authStatus === 'ready' && (
              <div className="auth-indicator ready">
                ✨ Ready for new player
              </div>
            )}
            {authStatus === 'authenticated' && (
              <div className="auth-indicator authenticated">
                🔒 Player session active
                {userProfile ? (
                  <span className="profile-info">
                    Returning Player: {userProfile.playerName}
                  </span>
                ) : (
                  <span className="profile-info">
                    | Session ready for game
                  </span>
                )}
              </div>
            )}
            {authStatus === 'error' && (
              <div className="auth-indicator error">
                ⚠️ Please enable Anonymous Auth in Firebase Console
              </div>
            )}
          </div>
        )}
        
        <div className="menu-content">
          {/* Welcome Message for Existing Players */}
          {userProfile && (
            <div className="welcome-back">
              <h2 className="welcome-title">🚀 Welcome Back, {userProfile.playerName}!</h2>
              <div className="pilot-badge">
                <div className="badge-icon">👨‍🚀</div>
                <div className="badge-info">
                  <div className="best-score">
                    <span className="score-label">⭐ BEST SCORE : </span>
                    <span className="score-value">{(userProfile.stats?.bestScore || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Name Input for New Players */}
          {!userProfile && (
            <div className="player-input-section">
              <label htmlFor="playerName" className="input-label">
                CHOOSE YOUR PILOT NAME:
              </label>
              <input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="PLAYER"
                maxLength={15}
                className="player-input"
                autoFocus
                disabled={authStatus === 'checking'}
              />
              <div className="name-hint">
                🔐 Anonymous but secure - your scores are tied to this browser session only
              </div>
            </div>
          )}

          <div className="menu-buttons">
            <button 
              onClick={userProfile ? () => onStartGame(userProfile.playerName) : handleStartGame}
              disabled={(!userProfile && !playerName.trim()) || isChecking || (authStatus !== 'authenticated' && authStatus !== 'ready')}
              className="menu-button start-button"
            >
              {isChecking ? 'CHECKING NAME...' : 
               authStatus === 'checking' ? 'INITIALIZING...' : 
               authStatus === 'error' ? 'SETUP REQUIRED' : 
               userProfile ? 'START MISSION' : 'START NEW MISSION'}
            </button>
            
            <button 
              onClick={onShowHighScores}
              className="menu-button scores-button"
            >
              HIGH SCORES
            </button>
          </div>

          {showConflictDialog && nameConflict && (
            <div className="name-conflict-dialog">
              <div className="conflict-content">
                <h3>⚠️ NAME UNAVAILABLE</h3>
                <p>The name <strong>"{nameConflict.name}"</strong> is already taken!</p>
                
                <div className="conflict-buttons">
                  <button 
                    onClick={handleModifyName}
                    className="menu-button modify-button"
                  >
                    CHOOSE DIFFERENT NAME
                  </button>
                  <button 
                    onClick={handleForceStart}
                    disabled={generatingName}
                    className="menu-button force-button"
                  >
                    {generatingName ? 'GENERATING...' : 'AUTO-GENERATE UNIQUE NAME'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="controls-info">
            <h3>CONTROLS:</h3>
            <p>ARROW KEYS or WASD - Move Ship</p>
            <p>SPACEBAR - Fire Lasers</p>
            <p>ESC - Pause Game</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
