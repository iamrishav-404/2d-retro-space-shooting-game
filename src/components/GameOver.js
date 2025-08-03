import React, { useState } from 'react';
import { saveScore } from '../services/scoreService';
import '../styles/GameOver.css';

const GameOver = ({ score, playerName, onBackToMenu, onShowHighScores }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handleSaveScore = async () => {
    if (saved || isSaving) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      await saveScore(playerName, score);
      setSaved(true);
    } catch (error) {
      console.error('Failed to save score:', error);
      setSaveError('Failed to save score. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewHighScores = () => {
    onShowHighScores(true); 
  };


  return (
    <div className="game-over">
      <div className="game-over-container">
        <h1 className="game-over-title">MISSION FAILED</h1>
        
        <div className="final-stats">
          <h2>FINAL REPORT</h2>
          <div className="stat-line">
            <span className="stat-label">PILOT:</span>
            <span className="stat-value">{playerName}</span>
          </div>
          <div className="stat-line">
            <span className="stat-label">SCORE:</span>
            <span className="stat-value score-highlight">{score.toLocaleString()}</span>
          </div>
        </div>

        <div className="score-actions">
          {!saved && !saveError && (
            <button 
              onClick={handleSaveScore}
              disabled={isSaving}
              className="save-score-button"
            >
              {isSaving ? 'SAVING...' : 'SAVE SCORE'}
            </button>
          )}

          {saved && (
            <div className="save-success">
              ✓ SCORE SAVED TO GALACTIC RECORDS
            </div>
          )}

          {saveError && (
            <div className="save-error">
              {saveError}
              <button 
                onClick={handleSaveScore}
                className="retry-button"
              >
                RETRY
              </button>
            </div>
          )}
        </div>

        <div className="game-over-buttons">
          <button 
            onClick={onBackToMenu}
            className="menu-button back-button"
          >
            RETURN TO BASE
          </button>
          
          <button 
            onClick={handleViewHighScores}
            className="menu-button scores-button"
          >
            VIEW RECORDS
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
