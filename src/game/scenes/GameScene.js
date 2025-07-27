import Phaser from 'phaser';
import { Howl } from 'howler';
import Player from '../objects/Player';
import Enemy from '../objects/Enemy';
import Laser from '../objects/Laser';
import EnemyLaser from '../objects/EnemyLaser';

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    
    this.player = null;
    this.enemies = null;
    this.lasers = null;
    this.enemyLasers = null;
    this.cursors = null;
    this.wasdKeys = null;
    this.spaceKey = null;
    this.escKey = null;
    
    this.score = 0;
    this.health = 100;
    this.level = 1;
    this.enemySpeed = 80; // Increased speed
    this.enemySpawnRate = 1000; // Faster spawning (every 1 second)
    this.enemiesKilled = 0;
    
    this.gameStarted = false;
    this.gameEnded = false;
    
    // Sound objects
    this.sounds = {};
    
    // UI elements
    this.scoreText = null;
    this.healthText = null;
    this.levelText = null;
    
    // Background scrolling
    this.backgroundY = 0;
    this.backgroundSpeed = 2;
    
    // Timers
    this.enemySpawnTimer = null;
    this.enemyShootTimer = null;
  }

  create() {
    // Initialize audio using Howler.js
    this.initializeSounds();
    
    // Create scrolling background
    this.createBackground();
    
    // Create visible borders
    this.createVisibleBorders();
    
    // Create player at bottom center of the larger screen
    this.player = new Player(this, 600, 700);
    
    // Create groups with physics enabled
    this.enemies = this.physics.add.group({
      runChildUpdate: true // Enable automatic updating of children
    });
    this.lasers = this.physics.add.group({
      runChildUpdate: true // Enable automatic updating of children
    });
    this.enemyLasers = this.physics.add.group({
      runChildUpdate: true // Enable automatic updating of children
    });
    
    // Create input controls
    this.createControls();
    
    // Create UI
    this.createUI();
    
    // Set up collisions
    this.setupCollisions();
    
    // Start enemy spawning
    this.startEnemySpawning();
    
    // Start enemy shooting
    this.startEnemyShooting();
    
    // Play background music immediately
    this.playBackgroundMusic();
    
    this.gameStarted = true;
  }

  initializeSounds() {
    // Initialize all sounds with error handling
    try {
      this.sounds.bgMusic = new Howl({
        src: ['./assets/background_music.mp3'],
        loop: true,
        volume: 0.3,
        html5: true,
        onloaderror: () => console.warn('Failed to load background music')
      });

      this.sounds.shootSound = new Howl({
        src: ['./assets/shooting_sound.mp3'],
        volume: 0.5,
        html5: true,
        onloaderror: () => console.warn('Failed to load shoot sound')
      });

      this.sounds.enemyDie = new Howl({
        src: ['./assets/enemy_die_sound.mp3'],
        volume: 0.6,
        html5: true,
        onloaderror: () => console.warn('Failed to load enemy die sound')
      });

      this.sounds.playerDamage = new Howl({
        src: ['./assets/player_damage_sound.mp3'],
        volume: 0.7,
        html5: true,
        onloaderror: () => console.warn('Failed to load player damage sound')
      });

      this.sounds.playerDie = new Howl({
        src: ['./assets/player_die_sound.mp3'],
        volume: 0.8,
        html5: true,
        onloaderror: () => console.warn('Failed to load player die sound')
      });

      this.sounds.gameIntro = new Howl({
        src: ['./assets/game_intro_music.mp3'],
        volume: 0.5,
        html5: true,
        onloaderror: () => console.warn('Failed to load intro music')
      });
    } catch (error) {
      console.warn('Error initializing sounds:', error);
    }
  }

  createBackground() {
    // Use your provided background image
    this.background1 = this.add.image(600, 400, 'background');
    this.background2 = this.add.image(600, -400, 'background');
    
    // Scale backgrounds to fit the wider screen properly
    const scaleX = 1200 / this.background1.width;
    const scaleY = 800 / this.background1.height;
    const scale = Math.max(scaleX, scaleY);
    
    this.background1.setScale(scale);
    this.background2.setScale(scale);
    
    // Set backgrounds to be behind everything
    this.background1.setDepth(-100);
    this.background2.setDepth(-100);
  }

  createVisibleBorders() {
    // Create only a bottom border that stays within screen bounds
    const borderThickness = 12; // Much thicker border
    const borderColor = 0x00ff00; // Green color
    
    // Bottom border - positioned within the 800px screen height
    this.bottomBorder = this.add.rectangle(600, 790, 1200, borderThickness, borderColor);
    this.bottomBorder.setDepth(50); // Above everything   
  }

  createControls() {
    // Arrow keys
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // WASD keys
    this.wasdKeys = this.input.keyboard.addKeys('W,S,A,D');
    
    // Space and Escape keys
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    
    // Prevent space from scrolling page
    this.spaceKey.preventDefault = true;
  }

  createUI() {
    // Create retro-styled UI
    // Score display
    this.scoreText = this.add.text(20, 20, 'SCORE: 0', {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#ff0080'
    });

    // Health display
    this.healthText = this.add.text(20, 50, 'HEALTH: 100', {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#00ff00'
    });

    // Level display
    this.levelText = this.add.text(20, 80, 'LEVEL: 1', {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#00ffff'
    });

    // Enemy kill counter
    this.killText = this.add.text(20, 110, 'KILLS: 0', {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#ffff00'
    });

    // Instructions
    this.add.text(600, 550, 'ESC: PAUSE', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#888888'
    });

    // Set UI depth to be on top
    this.scoreText.setDepth(100);
    this.healthText.setDepth(100);
    this.levelText.setDepth(100);
    this.killText.setDepth(100);
  }

  setupCollisions() {
    // Player lasers hit enemies
    this.physics.add.overlap(this.lasers, this.enemies, (laser, enemy) => {
      this.destroyEnemy(enemy);
      laser.destroy();
    });

    // Enemy lasers hit player
    this.physics.add.overlap(this.player, this.enemyLasers, (player, enemyLaser) => {
      this.playerTakeDamage(10);
      enemyLaser.destroy();
    });

    // Player collides with enemies
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      this.destroyEnemy(enemy);
      this.playerTakeDamage(25);
    });
  }

  startEnemySpawning() {
    this.enemySpawnTimer = this.time.addEvent({
      delay: this.enemySpawnRate,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });
  }

  startEnemyShooting() {
    this.enemyShootTimer = this.time.addEvent({
      delay: 3000, // Enemies shoot every 3 seconds
      callback: this.randomEnemyShoot,
      callbackScope: this,
      loop: true
    });
  }

  playBackgroundMusic() {
    try {
      if (this.sounds.bgMusic) {
        this.sounds.bgMusic.play();
      }
    } catch (error) {
      console.warn('Error playing background music:', error);
    }
  }

  update() {
    if (!this.gameStarted || this.gameEnded) return;

    // Update background scrolling
    this.updateBackground();
    
    // Handle input
    this.handleInput();
    
    // Update player
    if (this.player) {
      this.player.update();
    }
    
    // Update enemies
    this.enemies.children.entries.forEach(enemy => {
      if (enemy.update) {
        enemy.update();
      }
    });
    
    // Update laser groups manually
    this.lasers.children.entries.forEach(laser => {
      if (laser.update) {
        laser.update();
      }
    });
    
    this.enemyLasers.children.entries.forEach(enemyLaser => {
      if (enemyLaser.update) {
        enemyLaser.update();
      }
    });
    
    // Clean up off-screen objects
    this.cleanupObjects();
    
    // Update difficulty
    this.updateDifficulty();
  }

  updateBackground() {
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

  handleInput() {
    // Handle pause
    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      this.pauseGame();
      return;
    }

    // Movement input
    const leftPressed = this.cursors.left.isDown || this.wasdKeys.A.isDown;
    const rightPressed = this.cursors.right.isDown || this.wasdKeys.D.isDown;
    const upPressed = this.cursors.up.isDown || this.wasdKeys.W.isDown;
    const downPressed = this.cursors.down.isDown || this.wasdKeys.S.isDown;

    // Update player movement
    if (this.player) {
      this.player.handleMovement(leftPressed, rightPressed, upPressed, downPressed);
    }

    // Shooting input - continuous shooting while holding space
    if (this.spaceKey.isDown) {
      this.playerShoot();
    }
  }

  playerShoot() {
    if (this.player && this.player.canShoot()) {
      const laser = new Laser(this, this.player.x, this.player.y - 30);
      this.lasers.add(laser);
      this.player.resetShootCooldown();
      
      // Play shooting sound
      try {
        if (this.sounds.shootSound) {
          this.sounds.shootSound.play();
        }
      } catch (error) {
        console.warn('Error playing shoot sound:', error);
      }
    }
  }

  spawnEnemy() {
    const x = Phaser.Math.Between(100, 1100); // Wider spawn range for 1200px width
    const enemy = new Enemy(this, x, -50, this.enemySpeed, this.level);
    this.enemies.add(enemy);
    console.log('Enemy spawned at:', x, -50, 'Level:', this.level, 'Total enemies:', this.enemies.children.size);
  }

  randomEnemyShoot() {
    // Pick a random active enemy to shoot
    const activeEnemies = this.enemies.children.entries.filter(enemy => enemy.active && enemy.y > 0 && enemy.y < 400);
    if (activeEnemies.length > 0) {
      const randomEnemy = Phaser.Utils.Array.GetRandom(activeEnemies);
      this.enemyShoot(randomEnemy);
    }
  }

  enemyShoot(enemy) {
    if (enemy && enemy.active) {
      const enemyLaser = new EnemyLaser(this, enemy.x, enemy.y + 30);
      this.enemyLasers.add(enemyLaser);
    }
  }

  destroyEnemy(enemy) {
    // Play enemy death sound
    try {
      if (this.sounds.enemyDie) {
        this.sounds.enemyDie.play();
      }
    } catch (error) {
      console.warn('Error playing enemy death sound:', error);
    }
    
    // Add to score and kill count
    this.score += 100;
    this.enemiesKilled += 1;
    
    // Update UI
    this.scoreText.setText('SCORE: ' + this.score);
    this.killText.setText('KILLS: ' + this.enemiesKilled);
    
    // Destroy enemy
    enemy.destroy();
  }

  playerTakeDamage(damage) {
    this.health -= damage;
    this.healthText.setText('HEALTH: ' + Math.max(0, this.health));
    
    // Play damage sound
    try {
      if (this.sounds.playerDamage) {
        this.sounds.playerDamage.play();
      }
    } catch (error) {
      console.warn('Error playing damage sound:', error);
    }
    
    // Flash player red
    if (this.player) {
      this.player.setTint(0xff0000);
      this.time.delayedCall(100, () => {
        if (this.player) {
          this.player.clearTint();
        }
      });
    }
    
    // Check for game over
    if (this.health <= 0) {
      this.gameOver();
    }
  }

  cleanupObjects() {
    // Remove lasers that are off-screen
    this.lasers.children.entries.forEach(laser => {
      if (laser.y < -50) {
        laser.destroy();
      }
    });

    this.enemyLasers.children.entries.forEach(laser => {
      if (laser.y > 850) { // Adjusted for 800px height
        laser.destroy();
      }
    });

    // Handle enemies reaching the bottom - damage player
    this.enemies.children.entries.forEach(enemy => {
      if (enemy.y > 750) { // When enemy reaches near bottom (before starship area)
        // Damage player when enemy reaches bottom
        this.playerTakeDamage(15);
        enemy.destroy();
      }
    });
  }

  updateDifficulty() {
    const newLevel = Math.floor(this.enemiesKilled / 10) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      this.levelText.setText('LEVEL: ' + this.level);
      
      // Increase difficulty
      this.enemySpeed += 10;
      this.enemySpawnRate = Math.max(500, this.enemySpawnRate - 100);
      this.backgroundSpeed += 0.2;
      
      // Update spawn timer
      if (this.enemySpawnTimer) {
        this.enemySpawnTimer.destroy();
        this.startEnemySpawning();
      }
      
      // Flash level up message
      const levelUpText = this.add.text(400, 300, 'LEVEL UP!', {
        fontSize: '48px',
        fontFamily: 'monospace',
        color: '#ffff00'
      }).setOrigin(0.5).setDepth(200);
      
      this.tweens.add({
        targets: levelUpText,
        alpha: 0,
        y: 200,
        duration: 2000,
        ease: 'Power2',
        onComplete: () => levelUpText.destroy()
      });
    }
  }

  pauseGame() {
    this.scene.pause();
    this.scene.launch('PauseScene');
    
    // Pause all sounds
    Object.values(this.sounds).forEach(sound => {
      try {
        if (sound.playing()) {
          sound.pause();
        }
      } catch (error) {
        console.warn('Error pausing sound:', error);
      }
    });
  }

  resumeGame() {
    this.scene.resume();
    
    // Resume all sounds
    Object.values(this.sounds).forEach(sound => {
      try {
        if (sound._sounds[0] && sound._sounds[0]._paused) {
          sound.play();
        }
      } catch (error) {
        console.warn('Error resuming sound:', error);
      }
    });
  }

  gameOver() {
    if (this.gameEnded) return;
    
    this.gameEnded = true;
    
    // Stop all sounds
    Object.values(this.sounds).forEach(sound => {
      try {
        sound.stop();
      } catch (error) {
        console.warn('Error stopping sound:', error);
      }
    });
    
    // Play death sound
    try {
      if (this.sounds.playerDie) {
        this.sounds.playerDie.play();
      }
    } catch (error) {
      console.warn('Error playing death sound:', error);
    }
    
    // Stop enemy spawning
    if (this.enemySpawnTimer) {
      this.enemySpawnTimer.destroy();
    }
    if (this.enemyShootTimer) {
      this.enemyShootTimer.destroy();
    }
    
    // Get the game end callback from registry
    const onGameEnd = this.registry.get('onGameEnd');
    if (onGameEnd) {
      // Delay to let death sound play
      this.time.delayedCall(1000, () => {
        onGameEnd(this.score);
      });
    }
  }
}

export default GameScene;
