# Retro Space Shooter 🚀

A retro-style 2D space shooting game built with React, Phaser.js, Howler.js, and Firebase.

## Features

- **Retro pixel-art graphics** with authentic 8-bit style
- **Immersive sound effects** powered by Howler.js
- **Progressive difficulty** with increasing enemy waves
- **High score system** with Firebase Firestore integration
- **Responsive design** that works on desktop and mobile
- **Multiple enemy movement patterns** (straight, zigzag, sine wave)
- **Real-time collision detection** and physics
- **Pause/resume functionality**

## Tech Stack

- **Frontend**: React.js
- **Game Engine**: Phaser.js 3
- **Audio**: Howler.js
- **Database**: Firebase Firestore
- **Styling**: CSS3 with retro animations

## Game Controls

- **Movement**: Arrow Keys or WASD
- **Shoot**: Spacebar
- **Pause**: ESC key
- **Restart**: R key (when paused)
- **Quit**: Q key (when paused)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Copy your Firebase config
4. Update `src/services/firebase.js` with your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 3. Run the Development Server

```bash
npm start
```

## Project Structure

```
src/
├── components/          # React components
├── game/               # Phaser game logic
├── services/           # Firebase services
└── styles/             # CSS stylesheets
```

## License

MIT License

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
