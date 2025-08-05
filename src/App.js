
import React, { useState, useEffect } from 'react';
import Game from './components/Game';
import './App.css';

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      
      return mobileRegex.test(userAgent) || isTouchDevice || isSmallScreen;
    };

    setIsMobile(checkMobile());

    const handleResize = () => {
      setIsMobile(checkMobile());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="App mobile-message">
        <div className="mobile-container">
          <h1>🚀 NEXUS</h1>
          <div className="mobile-content">
            <h2>🖥️ PC Experience Required</h2>
            <p>This retro space shooter is currently optimized for desktop/PC gameplay with keyboard controls.</p>
            
            <div className="mobile-features">
              <h3>Game Features:</h3>
              <ul>
                <li>🎮 WASD/Arrow key movement</li>
                <li>🔫 Spacebar shooting</li>
                <li>⚡ 5 progressive levels</li>
                <li>🛡️ Power-ups and boss battles</li>
                <li>🏆 GALACTIC Leaderboards</li>
                <li>🎉 Lots of fun</li>
              </ul>
            </div>

            <div className="mobile-instructions">
              <h3>📱 To Play:</h3>
              <p>Please open this game on a <strong>desktop or laptop computer</strong> for the best experience!</p>
              
              <div className="mobile-link">
                <p>🎥 <strong>Want to see gameplay?</strong></p>
                <a 
                  href="https://drive.google.com/file/d/1yT_EXSIthWIml_bqSXAatkKQ7AhCkYx0/view?usp=sharing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="demo-link"
                >
                  Watch Demo Video →
                </a>
              </div>
            </div>

            <div className="mobile-footer">
              <p>Built with React, Phaser.js, Howler.js & Firebase</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;
