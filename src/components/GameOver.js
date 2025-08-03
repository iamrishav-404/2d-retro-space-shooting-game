import React, { useState } from 'react';
import { saveScore } from '../services/authScoreService';
import '../styles/GameOver.css';

const GameOver = ({ score, playerName, onBackToMenu, onShowHighScores, isWinner = false }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handleSaveScore = async () => {
    if (saved || isSaving) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      await saveScore(playerName, score, isWinner);
      setSaved(true);
    } catch (error) {
      setSaveError(`Failed to save score: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewHighScores = () => {
    onShowHighScores(true); 
  };

  // Different content based on winner status
  const getTitle = () => {
    return isWinner ? "VICTORY" : "MISSION FAILED";
  };

  const getTitleClass = () => {
    return isWinner ? "game-over-title winner" : "game-over-title";
  };

  const getSubtitle = () => {
    return isWinner ? "MISSION COMPLETE" : "FINAL REPORT";
  };

  const getSaveSuccessMessage = () => {
    return isWinner 
      ? "✓ RECORDED IN HALL OF FAME" 
      : "✓ SCORE SAVED TO GALACTIC RECORDS";
  };

  const getReturnButtonText = () => {
    return isWinner ? "CONTINUE" : "RETURN TO BASE";
  };

  const getRecordsButtonText = () => {
    return isWinner ? "HALL OF FAME" : "VIEW RECORDS";
  };


  return (
    <div className={`game-over ${isWinner ? 'winner' : ''}`}>
      <div className={`game-over-container ${isWinner ? 'winner' : ''}`}>
        <h1 className={getTitleClass()}>{getTitle()}</h1>
        
        {isWinner && (
          <div className="victory-message">
            <p>🏆 GALAXY SAVED 🏆</p>
          </div>
        )}
        
        <div className="final-stats">
          <h2>{getSubtitle()}</h2>
          <div className="stat-line">
            <span className="stat-label">PILOT:</span>
            <span className="stat-value">{playerName}</span>
          </div>
          <div className="stat-line">
            <span className="stat-label">SCORE:</span>
            <span className={`stat-value ${isWinner ? 'score-highlight winner-score' : 'score-highlight'}`}>
              {score.toLocaleString()}
            </span>
          </div>
          {isWinner && (
            <div className="stat-line">
              <span className="stat-label">STATUS:</span>
              <span className="stat-value winner-status">GALACTIC HERO</span>
            </div>
          )}
        </div>

        <div className="score-actions">
          {!saved && !saveError && (
            <button 
              onClick={handleSaveScore}
              disabled={isSaving}
              className={`save-score-button ${isWinner ? 'winner-button' : ''}`}
            >
              {isSaving ? 'SAVING...' : (isWinner ? 'SAVE VICTORY' : 'SAVE SCORE')}
            </button>
          )}

          {saved && (
            <div className={`save-success ${isWinner ? 'winner-success' : ''}`}>
              {getSaveSuccessMessage()}
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
            className={`menu-button back-button ${isWinner ? 'winner-button' : ''}`}
          >
            {getReturnButtonText()}
          </button>
          
          <button 
            onClick={handleViewHighScores}
            className={`menu-button scores-button ${isWinner ? 'winner-button' : ''}`}
          >
            {getRecordsButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
