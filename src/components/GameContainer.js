import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import PreloadScene from '../game/scenes/PreloadScene';
import IntroScene from '../game/scenes/IntroScene';
import GameScene from '../game/scenes/GameScene';
import PauseScene from '../game/scenes/PauseScene';
import '../styles/GameContainer.css';

const GameContainer = ({ onGameEnd, playerName }) => {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);

  useEffect(() => {
    // Game configuration
    const config = {
      type: Phaser.AUTO,
      width: 1200,
      height: 800,
      parent: gameRef.current,
      backgroundColor: '#000000',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: [PreloadScene, IntroScene, GameScene, PauseScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
          width: 600,
          height: 400
        },
        max: {
          width: 1920,
          height: 1080
        }
      }
    };

    // Game instance
    phaserGameRef.current = new Phaser.Game(config);

    // Set up game end callback
    phaserGameRef.current.registry.set('onGameEnd', onGameEnd);
    phaserGameRef.current.registry.set('playerName', playerName);

    // Cleanup function
    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [onGameEnd, playerName]);

  return (
    <div className="game-container">
      <div className="game-ui">
        <div className="player-info">
          <span className="pilot-name">PILOT: {playerName}</span>
        </div>
      </div>
      <div 
        ref={gameRef} 
        className="phaser-game"
        id="phaser-game"
      />
    </div>
  );
};

export default GameContainer;
