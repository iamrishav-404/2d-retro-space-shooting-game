import React, { useState, useEffect } from 'react';
import { getHighScores } from '../services/scoreService';
import '../styles/HighScores.css';

const HighScores = ({ onBackToMenu }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHighScores();
  }, []);

  const loadHighScores = async () => {
    try {
      setLoading(true);
      setError(null);
      const highScores = await getHighScores(10);
      setScores(highScores);
    } catch (err) {
      console.error('Failed to load high scores:', err);
      setError('Failed to load galactic records. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="high-scores">
      <div className="high-scores-container">
        <h1 className="high-scores-title">GALACTIC RECORDS</h1>
        
        <div className="scores-content">
          {loading && (
            <div className="loading">
              <div className="loading-text">ACCESSING GALACTIC DATABASE...</div>
            </div>
          )}

          {error && (
            <div className="error">
              <div className="error-message">{error}</div>
              <button 
                onClick={loadHighScores}
                className="retry-button"
              >
                RETRY CONNECTION
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {scores.length === 0 ? (
                <div className="no-scores">
                  <p>NO RECORDS FOUND</p>
                  <p>BE THE FIRST PILOT TO MAKE HISTORY!</p>
                </div>
              ) : (
                <div className="scores-table">
                  <div className="table-header">
                    <span className="rank-col">RANK</span>
                    <span className="name-col">PILOT</span>
                    <span className="score-col">SCORE</span>
                    <span className="date-col">DATE</span>
                  </div>
                  
                  {scores.map((score, index) => (
                    <div 
                      key={score.id} 
                      className={`score-row ${index < 3 ? 'top-score' : ''}`}
                    >
                      <span className="rank-col">
                        {index + 1}
                        {index === 0 && ' 🥇'}
                        {index === 1 && ' 🥈'}
                        {index === 2 && ' 🥉'}
                      </span>
                      <span className="name-col">{score.playerName}</span>
                      <span className="score-col">{score.score.toLocaleString()}</span>
                      <span className="date-col">{formatDate(score.timestamp)}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="high-scores-buttons">
          <button 
            onClick={onBackToMenu}
            className="menu-button back-button"
          >
            RETURN TO BASE
          </button>
        </div>
      </div>
    </div>
  );
};

export default HighScores;
