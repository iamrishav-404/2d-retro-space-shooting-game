import React, { useState } from 'react';
import '../styles/MainMenu.css';

const MainMenu = ({ onStartGame, onShowHighScores }) => {
  const [playerName, setPlayerName] = useState('');

  const handleStartGame = () => {
    if (playerName.trim()) {
      onStartGame(playerName.trim());
    }
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
              disabled={!playerName.trim()}
              className="menu-button start-button"
            >
              START MISSION
            </button>
            
            <button 
              onClick={onShowHighScores}
              className="menu-button scores-button"
            >
              HIGH SCORES
            </button>
          </div>

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
