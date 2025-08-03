# NEXUS 🚀

A retro 2D space shooter where you pilot a starship to defend the galaxy against waves of alien invaders. Collect power-ups, defeat massive bosses, level up through intense battles, and climb the leaderboards as you fight to save humanity's last stronghold.

## Features

- **5 Progressive Levels** with increasing difficulty and new enemy types
- **Power-ups**: Health boosts, speed boosts, laser upgrades, shields, and time freeze
- **Multiple Enemy Types**: Basic aliens, starships, and armored bosses with health bars
- **Winner/Loser System**: Complete the game at 20,000 points or fight for high scores
- **Firebase Leaderboard** with winner badges for completed games
- **Retro Sound Effects** and background music
- **Responsive Controls** with WASD/Arrow keys and spacebar shooting

## Game Controls

- **Movement**: Arrow Keys or WASD
- **Shoot**: Spacebar
- **Pause**: ESC key

## Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Firebase Setup** (Optional - for leaderboards)
   - Create a Firebase project and enable Firestore
   - Update `src/services/firebase.js` with your config

3. **Run the Game**
```bash
npm start
```

Built with React, Phaser.js, Howler.js, and Firebase.


