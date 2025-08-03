import React, { useState } from 'react';
import { checkPlayerNameExists, generateUniquePlayerName } from '../services/scoreService';
import '../styles/MainMenu.css';

const MainMenu = ({ onStartGame, onShowHighScores }) => {
  const [playerName, setPlayerName] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [nameConflict, setNameConflict] = useState(null);
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [generatingName, setGeneratingName] = useState(false);

  const handleStartGame = async () => {
    if (!playerName.trim()) return;
    
    setIsChecking(true);
    try {
      const nameCheck = await checkPlayerNameExists(playerName.trim());
      
      if (nameCheck.exists) {
        setNameConflict({
          name: playerName.trim(),
          bestScore: nameCheck.bestScore,
          totalEntries: nameCheck.totalEntries
        });
        setShowConflictDialog(true);
      } else {
        // Name is unique, start the game
        onStartGame(playerName.trim());
      }
    } catch (error) {
      console.error('Error checking name:', error);
      // If check fails, allow the game to start anyway
      onStartGame(playerName.trim());
    } finally {
      setIsChecking(false);
    }
  };

  const handleForceStart = async () => {
    setGeneratingName(true);
    try {
      // Generate a unique name based on the original name
      const uniqueName = await generateUniquePlayerName(nameConflict.name);
      setShowConflictDialog(false);
      setNameConflict(null);
      
      // Start the game with the unique name
      onStartGame(uniqueName);
    } catch (error) {
      console.error('Error generating unique name:', error);
      // Fallback: use a random name
      const fallbackName = `Player${Math.floor(Math.random() * 9999)}`;
      onStartGame(fallbackName);
    } finally {
      setGeneratingName(false);
    }
  };

  const handleModifyName = () => {
    setShowConflictDialog(false);
    setNameConflict(null);
    // Focus back to input for user to modify
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
        
        <div className="menu-content">
          <div className="player-input-section">
            <label htmlFor="playerName" className="input-label">
              ENTER PILOT NAME:
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
            />
          </div>

          <div className="menu-buttons">
            <button 
              onClick={handleStartGame}
              disabled={!playerName.trim() || isChecking}
              className="menu-button start-button"
            >
              {isChecking ? 'CHECKING...' : 'START MISSION'}
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
                <h3>⚠️ PILOT NAME CONFLICT</h3>
                <p>The name <strong>"{nameConflict.name}"</strong> is already registered!</p>
                <p>Best Score: <span className="conflict-score">{nameConflict.bestScore.toLocaleString()}</span></p>
                <p>Total Missions: {nameConflict.totalEntries}</p>
                
                <div className="conflict-warning">
                  We'll generate a unique name variant for you!
                </div>
                
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
                    {generatingName ? 'GENERATING...' : 'AUTO-GENERATE NAME'}
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
