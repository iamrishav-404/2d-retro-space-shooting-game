import Phaser from 'phaser';

class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // Create loading bar
    this.createLoadingBar();

    // Create a proper laser texture first
    this.createLaserTexture();
    this.createEnemyLaserTexture();
    this.createEnemyStarshipLaserTexture();
    this.createL1EnemyLaserTexture();

    // Load images - using your provided assets
    this.load.image('background', 'assets/images/background_scene.png');
    this.load.image('starship', 'assets/images/starship.png');
    this.load.image('alien', 'assets/images/alien.png');
    this.load.image('heal', 'assets/images/health_heal.png'); 
    this.load.spritesheet('healthPickupAnim', 'assets/images/HealthPickup.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.image('enemyStarship',"assets/images/Enemy_Starship.png")
    this.load.image('speedBoost', 'assets/images/speed_boost.png');
    this.load.spritesheet('speedBoostAnim', 'assets/images/speed_boost_ani.png', {
      frameWidth: 48,
      frameHeight: 48
    }); 
    this.load.image('L1enemy',"assets/images/L1Enemy.png")
    this.load.image('laserboost',"assets/images/laser_boost.png")
    this.load.spritesheet('healthBar', 'assets/images/healthbar_spritesheet.png', {
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.spritesheet('laserBoostAnim', 'assets/images/laserboost_spritesheet.png',{
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet('laserBoostEffectAnim', 'assets/images/laserboostview_spritesheet.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.image('L2enemy','assets/images/L2Enemy.png')
    this.load.image('shield','assets/images/shield.png')
    this.load.spritesheet('shieldAnim', 'assets/images/shield_spritesheet.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    // Load audio files using Howler instead of Phaser's loader to avoid CORS issues
    // We'll initialize these in the GameScene directly with Howler
    
    // Update loading progress
    this.load.on('progress', (progress) => {
      this.updateLoadingBar(progress);
    });

    this.load.on('complete', () => {
      this.completeLoading();
    });

    // Handle loading errors
    this.load.on('loaderror', (file) => {
      console.warn('Failed to load:', file.key);
    });
  }

  createLaserTexture() {
    // Create a simple but visible laser beam texture
    const graphics = this.add.graphics();
    
    // Create a bright green laser beam
    graphics.fillStyle(0x00ff00); // Green color
    graphics.fillRect(0, 0, 6, 20); // Simple rectangle laser
    
    // Generate texture from graphics
    graphics.generateTexture('laser', 6, 20);
    graphics.destroy();
  }

  createEnemyLaserTexture() {
    const graphics = this.add.graphics();
    const radius = 5; 
    graphics.fillStyle(0xff0000, 1); // Red color
    graphics.fillCircle(radius, radius, radius); // Draw filled circle

    graphics.generateTexture('enemyLaser',radius * 2, radius * 2);
    graphics.destroy();
  }

  createEnemyStarshipLaserTexture() {
     const graphics = this.add.graphics();

    // Create a bright red laser beam
    graphics.fillStyle(0xff0000); // Red color
    graphics.fillRect(0, 0, 6, 20); // Simple rectangle laser
    
    // Generate texture from graphics
    graphics.generateTexture('enemyStarshipLaser', 6, 20);
    graphics.destroy();

  }

  createL1EnemyLaserTexture(){
    const graphics = this.add.graphics();
    const radius = 7; 
    graphics.fillStyle(0xff0000, 1); 
    graphics.fillCircle(radius, radius, radius);

    graphics.generateTexture('L1EnemyLaser',radius * 2, radius * 2);
    graphics.destroy();
  }

  createLoadingBar() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Set retro background
    this.cameras.main.setBackgroundColor('#000000');

    // Loading text
    this.loadingText = this.add.text(width / 2, height / 2 - 50, 'INITIALIZING SYSTEMS...', {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#ff0080',
      align: 'center'
    }).setOrigin(0.5);

    // Loading bar background
    this.loadingBarBg = this.add.rectangle(width / 2, height / 2, 400, 20, 0x222222);
    this.loadingBarBg.setStrokeStyle(2, 0xff0080);
    
    // Loading bar fill
    this.loadingBar = this.add.rectangle(width / 2 - 200, height / 2, 0, 18, 0xff0080);
    this.loadingBar.setOrigin(0, 0.5);

    // Percentage text
    this.percentText = this.add.text(width / 2, height / 2 + 30, '0%', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#00ffff',
      align: 'center'
    }).setOrigin(0.5);

    // Add some retro flair
    this.add.text(width / 2, 100, 'RETRO SPACE SHOOTER', {
      fontSize: '32px',
      fontFamily: 'monospace',
      color: '#ffff00',
      align: 'center'
    }).setOrigin(0.5);
  }

  updateLoadingBar(progress) {
    this.loadingBar.width = 400 * progress;
    this.percentText.setText(Math.round(progress * 100) + '%');
    
    // Update loading text based on progress
    if (progress < 0.3) {
      this.loadingText.setText('LOADING SPACECRAFT...');
    } else if (progress < 0.6) {
      this.loadingText.setText('SCANNING ALIEN THREATS...');
    } else if (progress < 0.9) {
      this.loadingText.setText('INITIALIZING WEAPONS...');
    } else {
      this.loadingText.setText('PREPARING FOR LAUNCH...');
    }
  }

  completeLoading() {
    // Wait a moment then transition to intro scene
    this.time.delayedCall(500, () => {
      this.scene.start('IntroScene');
    });
  }
}

export default PreloadScene;
