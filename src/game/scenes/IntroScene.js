import Phaser from 'phaser';
import { Howl } from 'howler';

class IntroScene extends Phaser.Scene {
  constructor() {
    super({ key: 'IntroScene' });
    
    this.introMusic = null;
    this.countdownNumber = 3;
    this.countdownText = null;
    this.titleText = null;
    this.subtitleText = null;
    this.backgroundSpeed = 1;
  }

  create() {
    // Create scrolling background
    this.createBackground();
    
    // Play intro music
    this.playIntroMusic();
    
    // Create title screen
    this.createTitleScreen();
    
    // Start the intro sequence
    this.time.delayedCall(2000, () => {
      this.startCountdown();
    });
  }

  createBackground() {
    // Use the same background as the game
    this.background1 = this.add.image(600, 400, 'background');
    this.background2 = this.add.image(600, -400, 'background');
    
    // Scale backgrounds to fit screen properly
    const scaleX = 1200 / this.background1.width;
    const scaleY = 800 / this.background1.height;
    const scale = Math.max(scaleX, scaleY);
    
    this.background1.setScale(scale);
    this.background2.setScale(scale);
    
    // Set backgrounds to be behind everything
    this.background1.setDepth(-100);
    this.background2.setDepth(-100);
    
    // Add dark overlay for better text visibility
    this.overlay = this.add.rectangle(600, 400, 1200, 800, 0x000000, 0.6);
    this.overlay.setDepth(-50);
  }

  createTitleScreen() {
    // Main title
    this.titleText = this.add.text(600, 200, 'SPACE SHOOTER', {
      fontSize: '64px',
      fontFamily: 'monospace',
      color: '#ff0080',
      stroke: '#ffffff',
      strokeThickness: 2
    }).setOrigin(0.5);
    
    // Add glow effect
    this.titleText.setShadow(0, 0, '#ff0080', 10, true, true);
    
    // Subtitle
    this.subtitleText = this.add.text(600, 280, 'DEFEND EARTH FROM ALIEN INVASION!', {
      fontSize: '24px',
      fontFamily: 'monospace',
      color: '#00ffff',
      stroke: '#ffffff',
      strokeThickness: 1
    }).setOrigin(0.5);
    
    // Controls instruction
    this.add.text(600, 350, 'CONTROLS:', {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#ffff00'
    }).setOrigin(0.5);
    
    this.add.text(600, 380, 'MOVE: ARROW KEYS or WASD', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    this.add.text(600, 405, 'SHOOT: SPACEBAR (Hold for rapid fire)', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    this.add.text(600, 430, 'PAUSE: ESC', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // Mission briefing
    this.add.text(600, 480, 'MISSION: Destroy all alien invaders!', {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: '#00ff00'
    }).setOrigin(0.5);
    
    this.add.text(600, 505, 'Get ready, pilot...', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#888888'
    }).setOrigin(0.5);
    
    // Add pulsing animation to title
    this.tweens.add({
      targets: this.titleText,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Add floating animation to subtitle
    this.tweens.add({
      targets: this.subtitleText,
      y: 290,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  playIntroMusic() {
    try {
      this.introMusic = new Howl({
        src: ['./assets/game_intro_music.mp3'],
        volume: 0.6,
        html5: true,
        onloaderror: () => console.warn('Failed to load intro music')
      });
      
      this.introMusic.play();
    } catch (error) {
      console.warn('Error playing intro music:', error);
    }
  }

  startCountdown() {
    // Clear title screen
    this.tweens.killAll();
    this.children.list.forEach(child => {
      if (child !== this.background1 && child !== this.background2 && child !== this.overlay) {
        child.destroy();
      }
    });
    
    // Add "GET READY" text
    const readyText = this.add.text(600, 300, 'GET READY!', {
      fontSize: '48px',
      fontFamily: 'monospace',
      color: '#ffff00',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    
    readyText.setShadow(0, 0, '#ffff00', 15, true, true);
    
    // Start countdown
    this.countdownText = this.add.text(600, 400, this.countdownNumber.toString(), {
      fontSize: '128px',
      fontFamily: 'monospace',
      color: '#ff0080',
      stroke: '#ffffff',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    this.countdownText.setShadow(0, 0, '#ff0080', 20, true, true);
    
    // Countdown animation
    this.time.addEvent({
      delay: 1000,
      callback: this.updateCountdown,
      callbackScope: this,
      repeat: 2 // Will fire 3 times total (3, 2, 1)
    });
  }

  updateCountdown() {
    // Add scale animation for current number
    this.tweens.add({
      targets: this.countdownText,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 200,
      yoyo: true,
      ease: 'Back.easeOut'
    });
    
    // Play countdown sound effect (using shoot sound as beep)
    try {
      const beep = new Howl({
        src: ['./assets/shooting_sound.mp3'],
        volume: 0.3,
        rate: 2.0, // Higher pitch for beep effect
        html5: true
      });
      beep.play();
    } catch (error) {
      console.warn('Error playing countdown beep:', error);
    }
    
    this.countdownNumber--;
    
    if (this.countdownNumber > 0) {
      // Update number
      this.countdownText.setText(this.countdownNumber.toString());
    } else {
      // Show "GO!" and start game
      this.countdownText.setText('GO!');
      this.countdownText.setColor('#00ff00');
      
      // Extra dramatic animation for GO!
      this.tweens.add({
        targets: this.countdownText,
        scaleX: 2,
        scaleY: 2,
        alpha: 0,
        duration: 800,
        ease: 'Power2.easeOut',
        onComplete: () => {
          this.startGame();
        }
      });
    }
  }

  startGame() {
    // Stop intro music
    if (this.introMusic) {
      try {
        this.introMusic.stop();
      } catch (error) {
        console.warn('Error stopping intro music:', error);
      }
    }
    
    // Start the main game scene
    this.scene.start('GameScene');
  }

  update() {
    // Update background scrolling during intro
    if (this.background1 && this.background2) {
      this.background1.y += this.backgroundSpeed;
      this.background2.y += this.backgroundSpeed;
      
      // Reset background positions for infinite scroll (adjusted for 800px height)
      if (this.background1.y > 1200) {
        this.background1.y = this.background2.y - 800;
      }
      if (this.background2.y > 1200) {
        this.background2.y = this.background1.y - 800;
      }
    }
  }
}

export default IntroScene;
