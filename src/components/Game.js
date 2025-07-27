import React, { useState } from 'react';
import GameContainer from './GameContainer';
import MainMenu from './MainMenu';
import GameOver from './GameOver';
import HighScores from './HighScores';
import '../styles/Game.css';

const Game = () => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameOver, highScores
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState('');

  const startGame = (name) => {
    setPlayerName(name);
    setScore(0);
    setGameState('playing');
  };

  const endGame = (finalScore) => {
    setScore(finalScore);
    setGameState('gameOver');
  };

  const showHighScores = () => {
    setGameState('highScores');
  };

  const backToMenu = () => {
    setGameState('menu');
  };

  const renderCurrentView = () => {
    switch (gameState) {
      case 'menu':
        return (
          <MainMenu 
            onStartGame={startGame}
            onShowHighScores={showHighScores}
          />
        );
      case 'playing':
        return (
          <GameContainer 
            onGameEnd={endGame}
            playerName={playerName}
          />
        );
      case 'gameOver':
        return (
          <GameOver 
            score={score}
            playerName={playerName}
            onBackToMenu={backToMenu}
            onShowHighScores={showHighScores}
          />
        );
      case 'highScores':
        return (
          <HighScores 
            onBackToMenu={backToMenu}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="game-wrapper">
      {renderCurrentView()}
    </div>
  );
};

export default Game;
