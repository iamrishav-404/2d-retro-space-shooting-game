import Phaser from "phaser";
import { Howl } from "howler";
import Player from "../objects/Player";
import Enemy from "../objects/Enemies/Enemy";
import Laser from "../objects/Lasers/Laser";
import EnemyLaser from "../objects/Lasers/EnemyLaser";
import PowerUps from "../objects/PowerUps";
import EnemyStarShip from "../objects/Enemies/EnemyStarShip";
import L1EnemyStarShip from "../objects/Enemies/L1Enemy";
import PowerLaser from "../objects/Lasers/PowerLaser";
import L2EnemyStarShip from "../objects/Enemies/L2Enemy";

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });

    this.player = null;
    this.enemies = null;
    this.lasers = null;
    this.enemyLasers = null;
    this.enemyStarships = null;
    this.enemyStarshipLasers = null;
    this.L1Enemies = null;
    this.L1EnemyLasers = null;
    this.L2Enemies = null;
    this.L2EnemiesLasers  = null;

    this.playerHeal = null;
    this.speedBoost = null;
    this.laserBoost = null;
    this.shield = null;

    this.cursors = null;
    this.wasdKeys = null;
    this.spaceKey = null;
    this.escKey = null;

    this.score = 0;
    this.health = 100;
    this.level = 1;

    this.enemySpeed = 80;
    this.enemySpawnRate = 2000;
    this.enemyStarshipSpawnRate = 5000;
    this.L1EnemySpawnRate = 5000;
    this.L2EnemySpawnRate = 5000;
    this.enemiesKilled = 0;
    this.velocity_x = 40;
    this.playerSpeed =300;

    this.gameStarted = false;
    this.gameEnded = false;

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
    this.enemyStarshipSpawnTimer = null;
    this.L1EnemySpawnTimer = null;
    this.L2EnemySpawnTimer = null;

   
    this.healDropTimer = null; 
    this.speedBoostDropTimer = null;
    this.speedBoostEffectTimer = null; 
    this.laserBoostDropTimer = null;
    this.laserBoostEffectTimer = null;
    this.shieldTimer = null;
    this.shieldEffectTimer = null;

    this.healthThreshold = 40;
    this.originalPlayerSpeed = null; 

    this.powerLasers = null;
    this.powerLaserDuration = 10000;
    this.laserBoostActive = false;
    this.laserBoostTimer = null;

    this.shieldEffect = null;
    this.shieldTween = null;
  }

  create() {
    // Initialize audio using Howler.js
    this.initializeSounds();

    // Create scrolling background
    this.createBackground();

    // Create visible borders
    this.createVisibleBorders();

    // Create player at bottom center of the larger screen
    this.player = new Player(this, 600, 700, this.playerSpeed);

    // Create groups with physics enabled
    this.enemies = this.physics.add.group({
      runChildUpdate: true, // Enable automatic updating of children
    });
    this.lasers = this.physics.add.group({
      runChildUpdate: true,
    });
    this.enemyLasers = this.physics.add.group({
      runChildUpdate: true,
    });

    this.playerHeal = this.physics.add.group({
      runChildUpdate: true,
    });

    this.enemyStarships = this.physics.add.group({
      runChildUpdate: true,
    });
    this.enemyStarshipLasers = this.physics.add.group({
      runChildUpdate: true,
    });

    this.speedBoost = this.physics.add.group({
      runChildUpdate: true,
    });

    this.L1Enemies = this.physics.add.group({
      runChildUpdate: true,
    });
    this.L1EnemyLasers = this.physics.add.group({
      runChildUpdate: true,
    });
    this.laserBoost = this.physics.add.group({
      runChildUpdate: true,
    });

    this.powerLasers = this.physics.add.group({
      runChildUpdate: true,
    });

    this.L2Enemies = this.physics.add.group({
      runChildUpdate : true,
    });
    this.L2EnemiesLasers = this.physics.add.group({
      runChildUpdate: true
    })
    this.shield = this.physics.add.group({
      runChildUpdate: true,
    });

    this.createControls();
    this.createUI();
    this.setupCollisions();
    this.startEnemySpawning();
    this.startEnemyShooting();
    this.playBackgroundMusic();

    this.anims.create({
      key: "health-boost",
      frames: this.anims.generateFrameNumbers("healthPickupAnim", {
        start: 0,
        end: 3,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create ({
      key : "speed-boost",
      frames : this.anims.generateFrameNumbers("speedBoostAnim", {
        start: 0,
        end: 3,
      }),
      frameRate: 12, 
      repeat: -1,
    })

    this.anims.create({
      key: "laser-boost-effect",
      frames: this.anims.generateFrameNumbers("laserBoostEffectAnim", {
        start: 0,
        end: 2,
      }),
      frameRate: 20,
      repeat: -1,
    }); 

    this.anims.create({
      key: "power-laser-anim",
      frames: this.anims.generateFrameNumbers("laserBoostAnim", {
        start: 0,
        end: 9, 
      }),
      frameRate: 30,
      repeat: -1,
    });

    this.anims.create({
      key: "shield-anim",
      frames: this.anims.generateFrameNumbers("shieldAnim", {
        start: 0,
        end: 3,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.gameStarted = true;
  }

  initializeSounds() {
    // Initialize all sounds with error handling
    try {
      this.sounds.bgMusic = new Howl({
        src: ["./assets/background_music.mp3"],
        loop: true,
        volume: 0.3,
        html5: true,
        onloaderror: () => console.warn("Failed to load background music"),
      });

      this.sounds.shootSound = new Howl({
        src: ["./assets/shooting_sound.mp3"],
        volume: 0.5,
        html5: true,
        onloaderror: () => console.warn("Failed to load shoot sound"),
      });

      this.sounds.enemyDie = new Howl({
        src: ["./assets/enemy_die_sound.mp3"],
        volume: 0.6,
        html5: true,
        onloaderror: () => console.warn("Failed to load enemy die sound"),
      });

      this.sounds.playerDamage = new Howl({
        src: ["./assets/player_damage_sound.mp3"],
        volume: 0.7,
        html5: true,
        onloaderror: () => console.warn("Failed to load player damage sound"),
      });

      this.sounds.playerDie = new Howl({
        src: ["./assets/player_die_sound.mp3"],
        volume: 0.8,
        html5: true,
        onloaderror: () => console.warn("Failed to load player die sound"),
      });

      this.sounds.gameIntro = new Howl({
        src: ["./assets/game_intro_music.mp3"],
        volume: 0.5,
        html5: true,
        onloaderror: () => console.warn("Failed to load intro music"),
      });

      this.sounds.healthPickup = new Howl({
        src: ["./assets/player_health_boost.mp3"],
        volume: 0.5,
        html5: true,
        onloaderror: () => console.warn("Failed to load health pickup sound"),
      });

      this.sounds.speedBoost = new Howl({
        src: ["./assets/speed_boost.mp3"],
        volume: 0.5,
        html5: true,
        onloaderror: () => console.warn("Failed to load speed boost sound"),
      });
      this.sounds.laserBoost = new Howl({
        src: ["./assets/laserboost.mp3"],
        volume: 0.5,
        html5: true,
        loop: true, 
        onloaderror: () => console.warn("Failed to load laser boost sound"),
      });

    } catch (error) {
      console.warn("Error initializing sounds:", error);
    }

    this.sounds.shieldEffect = new Howl({
      src: ["./assets/shield.mp3"],
      volume: 0.5,
      html5: true,
      onloaderror: () => console.warn("Failed to load shield effect sound"),
    });

  }

  createBackground() {
    // Use your provided background image
    this.background1 = this.add.image(600, 400, "background");
    this.background2 = this.add.image(600, -400, "background");

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
    this.bottomBorder = this.add.rectangle(
      600,
      790,
      1200,
      borderThickness,
      borderColor
    );
    this.bottomBorder.setDepth(50); // Above everything
  }

  createControls() {
    // Arrow keys
    this.cursors = this.input.keyboard.createCursorKeys();

    // WASD keys
    this.wasdKeys = this.input.keyboard.addKeys("W,S,A,D");

    // Space and Escape keys
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.escKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );

    // Prevent space from scrolling page
    this.spaceKey.preventDefault = true;
  }

  createUI() {
    // Create retro-styled UI
    // Score display
    this.scoreText = this.add.text(20, 20, "SCORE: 0", {
      fontSize: "20px",
      fontFamily: "monospace",
      color: "#ff0080",
    });

    // Health display
    this.healthText = this.add.text(20, 50, "HEALTH: 100", {
      fontSize: "20px",
      fontFamily: "monospace",
      color: "#00ff00",
    });

    // Level display
    this.levelText = this.add.text(20, 80, "LEVEL: 1", {
      fontSize: "20px",
      fontFamily: "monospace",
      color: "#00ffff",
    });

    // Enemy kill counter
    this.killText = this.add.text(20, 110, "KILLS: 0", {
      fontSize: "20px",
      fontFamily: "monospace",
      color: "#ffff00",
    });

    // Instructions
    this.add.text(600, 550, "ESC: PAUSE", {
      fontSize: "14px",
      fontFamily: "monospace",
      color: "#888888",
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

    this.physics.add.overlap(
      this.lasers,
      this.enemyStarships,
      (laser, enemyStarship) => {
        this.destroyEnemy(enemyStarship);
        laser.destroy();
      }
    );

    // Enemy lasers hit player
    this.physics.add.overlap(
      this.player,
      this.enemyLasers,
      (player, enemyLaser) => {
        if (!this.shieldEffect) {
          this.playerTakeDamage(10);
        }
        enemyLaser.destroy();
      }
    );

    this.physics.add.overlap(
      this.player,
      this.enemyStarshipLasers,
      (player, enemyStarshipLaser) => {
        if (!this.shieldEffect) {
          this.playerTakeDamage(15);
        }
        enemyStarshipLaser.destroy();
      }
    );

    // Player collides with enemies
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      this.destroyEnemyOnly(enemy);
      if (!this.shieldEffect) {
        this.playerTakeDamage(25);
      }
    });

    this.physics.add.overlap(
      this.player,
      this.enemyStarships,
      (player, enemyStarship) => {
        this.destroyEnemyOnly(enemyStarship);
        if (!this.shieldEffect) {
          this.playerTakeDamage(35);
        }
      }
    );

    //health pickup collision 
    this.physics.add.overlap(
      this.lasers,
      this.playerHeal,
      (playerLaser, heal) => {
        this.collectHealthPickup(heal);
        playerLaser.destroy(); 
      }
    );
    this.physics.add.overlap(this.player, this.playerHeal, (player, heal) => {
      this.collectHealthPickup(heal);
    });

    //speed boost collision 
    this.physics.add.overlap(this.lasers, this.speedBoost, (laser, speedBoost) => {
      this.collectSpeedBoost(speedBoost);
      laser.destroy(); 
    });
    this.physics.add.overlap(this.player, this.speedBoost, (player, speedBoost) => {
      this.collectSpeedBoost(speedBoost);
    });

    // L1Enemy laser collision
    this.physics.add.overlap(this.lasers, this.L1Enemies, (laser, enemy) => {
      const isDestroyed = enemy.takeDamage(1);
      if (isDestroyed) {
        this.destroyEnemy(enemy);
      }
      laser.destroy();
    });
    this.physics.add.overlap(this.player, this.L1Enemies, (player, enemy) => {
      this.destroyEnemyOnly(enemy);
      if (!this.shieldEffect) {
        this.playerTakeDamage(30);
      }
    });
    this.physics.add.overlap(this.player, this.L1EnemyLasers, (player, enemyLaser) => {
      if (!this.shieldEffect) {
        this.playerTakeDamage(25);
      }
      enemyLaser.destroy();
    });

    // Laser boost collision
    this.physics.add.overlap(this.lasers, this.laserBoost, (laser, boost) => {
      this.collectLaserBoost(boost);
      laser.destroy();
    });
    this.physics.add.overlap(this.player, this.laserBoost, (player, boost) => {
      this.collectLaserBoost(boost);
    });

    // Power lasers instantly destroy all enemies
    this.physics.add.overlap(this.powerLasers, this.enemies, (powerLaser, enemy) => {
      this.destroyEnemy(enemy);
      powerLaser.destroy();
    });

    this.physics.add.overlap(this.powerLasers, this.enemyStarships, (powerLaser, enemyStarship) => {
      this.destroyEnemy(enemyStarship);
      powerLaser.destroy();
    });

    this.physics.add.overlap(this.powerLasers, this.L1Enemies, (powerLaser, l1Enemy) => {
      // Instantly destroy L1Enemy regardless of health
      this.destroyEnemy(l1Enemy);
      powerLaser.destroy();
    });
    this.physics.add.overlap(this.powerLasers, this.L2Enemies, (powerLaser, l2Enemy) => {
      this.destroyEnemy(l2Enemy);
      powerLaser.destroy();
    });


    // Power lasers can also collect power-ups
    this.physics.add.overlap(this.powerLasers, this.playerHeal, (powerLaser, heal) => {
      this.collectHealthPickup(heal);
      powerLaser.destroy();
    });

    this.physics.add.overlap(this.powerLasers, this.speedBoost, (powerLaser, speedBoost) => {
      this.collectSpeedBoost(speedBoost);
      powerLaser.destroy();
    });

    this.physics.add.overlap(this.powerLasers, this.laserBoost, (powerLaser, laserBoost) => {
      this.collectLaserBoost(laserBoost);
      powerLaser.destroy();
    });
    this.physics.add.overlap(this.powerLasers, this.shield, (powerLaser, shield) => {
      this.collectShield(shield);
      powerLaser.destroy();
    });

    //L2Enemies Collison
    this.physics.add.overlap(this.lasers, this.L2Enemies, (laser, enemy) => {
      const isDestroyed = enemy.takeDamage(1);
      if (isDestroyed) {
        this.destroyEnemy(enemy);
      }
      laser.destroy();
    });
    this.physics.add.overlap(this.player, this.L2EnemiesLasers,(player, laser) =>{
      if (!this.shieldEffect) {
        this.playerTakeDamage(35);
      }
      laser.destroy();
    })
    this.physics.add.overlap(this.player, this.L2Enemies, (player, enemy) => {
      this.destroyEnemyOnly(enemy);
      if (!this.shieldEffect) {
        this.playerTakeDamage(50);
      }
    });

    // Shield collision
    this.physics.add.overlap(this.lasers, this.shield, (laser, shield) => {
      laser.destroy();
      this.collectShield(shield);
    });
    this.physics.add.overlap(this.player, this.shield, (player, shield) => {
      this.collectShield(shield);
     
    });

    //Shield effect collisons
    this.physics.add.overlap(this.lasers, this.shield, (laser, shield) => {
      laser.destroy();
      this.collectShield(shield);
    });
    this.physics.add.overlap(this.player, this.shield, (player, shield) => {
      this.collectShield(shield);
    });
    this.physics.add.overlap(this.enemyLasers, this.shieldEffect, (enemyLaser, shield) => {
      enemyLaser.destroy();
    });
    this.physics.add.overlap(this.enemies, this.shieldEffect, (enemy, shield) => {
      this.destroyEnemyOnly(enemy);
    });
    this.physics.add.overlap(this.enemyStarships, this.shieldEffect, (enemyStarship, shield) => {
      this.destroyEnemyOnly(enemyStarship);
    });
    this.physics.add.overlap(this.enemyStarshipLasers, this.shieldEffect, (enemyStarshipLaser, shield) => {
      enemyStarshipLaser.destroy();
    });
    this.physics.add.overlap(this.L1Enemies, this.shieldEffect, (l1Enemy, shield) => {
      this.destroyEnemyOnly(l1Enemy);
    });
    this.physics.add.overlap(this.L1EnemyLasers, this.shieldEffect, (l1EnemyLaser, shield) => {
      l1EnemyLaser.destroy();
    });
    this.physics.add.overlap(this.L2Enemies, this.shieldEffect, (l2Enemy, shield) => {
      this.destroyEnemyOnly(l2Enemy);
    });
    this.physics.add.overlap(this.L2EnemiesLasers, this.shieldEffect, (l2EnemyLaser, shield) => {
      l2EnemyLaser.destroy();
    });
  }

  collectHealthPickup(heal) {
    this.health += 20;
    this.health = Math.min(this.health, 100);
    this.healthText.setText("HEALTH: " + this.health);
    this.showHealthEffect();
    heal.destroy();

    // If health is now above threshold, stop the heal drop timer
    if (this.health >= this.healthThreshold) {
      this.stopHealDropTimer();
    }
  }

  showHealthEffect() {
    if (this.anims.exists("health-boost")) {
      const healthEffect = this.add.sprite(
        this.player.x,
        this.player.y,
        "healthPickupAnim"
      );
      healthEffect.setScale(3);
      healthEffect.setDepth(this.player.depth - 1);
      healthEffect.play("health-boost");

      // Play health pickup sound ONCE at the start
      if (this.sounds.healthPickup) {
        try {
          this.sounds.healthPickup.play();
        } catch (error) {
          console.warn("Error playing health pickup sound:", error);
        }
      }

      // Make the effect follow the player
      this.tweens.addCounter({
        from: 0,
        to: 1,
        duration: 1000,
        onUpdate: () => {
          healthEffect.x = this.player.x;
          healthEffect.y = this.player.y;
        },
        onComplete: () => {
          healthEffect.destroy();
        },
      });
    } else {
      // Fallback: just play the sound if animation is missing
      if (this.sounds.healthPickup) {
        try {
          this.sounds.healthPickup.play();
        } catch (error) {
          console.warn("Error playing health pickup sound:", error);
        }
      }
    }
  }

  collectSpeedBoost(speedBoost) {
    // Stop any existing speed boost timer
    if (this.speedBoostEffectTimer) {
      this.speedBoostEffectTimer.remove(false);
    }

    // Store original speed if not already stored
    if (!this.originalPlayerSpeed) {
      this.originalPlayerSpeed = this.player.speed;
    }

    // Apply speed boost to both GameScene and Player
    this.playerSpeed = 1200;
    if (this.player) {
      this.player.speed = this.playerSpeed;
    }

    this.showSpeedEffect();
    speedBoost.destroy();

    // Set timer to reset speed after 5 seconds
    this.speedBoostEffectTimer = this.time.delayedCall(5000, () => {
      this.resetPlayerSpeed();
    });
  }

    resetPlayerSpeed() {
    // Reset to original speed
    this.playerSpeed = this.originalPlayerSpeed || 300;
    if (this.player) {
      this.player.speed = this.playerSpeed;
    }

    // Clear the timer reference
    this.speedBoostEffectTimer = null;
  }

  showSpeedEffect() {
    if (this.anims.exists("speed-boost")) {
      const speedEffect = this.add.sprite(
        this.player.x - 40,
        this.player.y,
        "speedBoostAnim"
      );
      speedEffect.setScale(3);
      speedEffect.setDepth(this.player.depth - 1);
      speedEffect.play("speed-boost");

      // Play speed boost sound ONCE at the start
      if (this.sounds.speedBoost) {
        try {
          this.sounds.speedBoost.play();
        } catch (error) {
          console.warn("Error playing speed boost sound:", error);
        }
      }

      // Make the effect follow the player
      this.tweens.addCounter({
        from: 0,
        to: 1,
        duration: 5000,
        onUpdate: () => {
          speedEffect.x = this.player.x - 40;
          speedEffect.y = this.player.y;
        },
        onComplete: () => {
          speedEffect.destroy();
        },
      });
    } else {
      // Fallback: just play the sound if animation is missing
      if (this.sounds.speedBoost) {
        try {
          this.sounds.speedBoost.play();
        } catch (error) {
          console.warn("Error playing speed boost sound:", error);
        }
      }
    }
  }

  collectLaserBoost(laserBoost) {
    // Stop any existing laser boost timer
    if (this.laserBoostTimer) {
      this.laserBoostTimer.remove(false);
    }

    // Activate laser boost
    this.laserBoostActive = true;
    this.showLaserBoostEffect();
    laserBoost.destroy();

    // Set timer to reset laser 
    this.laserBoostTimer = this.time.delayedCall(this.powerLaserDuration, () => {
      this.resetLaserBoost();
    });
  }

  resetLaserBoost() {
    this.laserBoostActive = false;
    this.laserBoostTimer = null;
    if (this.sounds.laserBoost) {
      this.sounds.laserBoost.stop();
    }
  }

  showLaserBoostEffect() {
  if (this.anims.exists("laser-boost-effect")) {
    const laserEffect = this.add.sprite(
      this.player.x + 40,
      this.player.y,
      "laserBoostEffectAnim"
    );
    laserEffect.setScale(1);
    laserEffect.setDepth(this.player.depth - 1);
    laserEffect.play("laser-boost-effect");

    // Play laser boost sound only if game is active
    if (this.sounds.laserBoost && this.gameStarted && !this.gameEnded) {
      try {
        this.sounds.laserBoost.play();
      } catch (error) {
        console.warn("Error playing laser boost sound:", error);
      }
    }

    // Make the effect follow the player
    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: this.powerLaserDuration,
      onUpdate: () => {
        laserEffect.x = this.player.x + 40;
        laserEffect.y = this.player.y;
      },
      onComplete: () => {
        laserEffect.destroy();
        if(this.sounds.laserBoost) {
          this.sounds.laserBoost.stop();
        }
      },
    });
  } else {
    // Fallback: just play the sound if animation exists and game is active
    if (this.sounds.laserBoost && this.gameStarted && !this.gameEnded) {
      try {
        this.sounds.laserBoost.play();
      } catch (error) {
        console.warn("Error playing laser boost sound:", error);
      }
    }
   }
  }

  collectShield(shield) {
    // Stop any existing shield effect timer
    if (this.shieldEffectTimer) {
      this.shieldEffectTimer.remove(false);
    }

    
    this.showShieldEffect();
    // Set timer to remove shield after 5 seconds
    this.shieldEffectTimer = this.time.delayedCall(5000, () => {
      this.removeShield();
    });

    shield.destroy();
  }

  removeShield() {
    // Stop the tween if it's still running
    if (this.shieldTween) {
      this.shieldTween.destroy();
      this.shieldTween = null;
    }
    
    if (this.shieldEffect) {
      this.shieldEffect.destroy();
      this.shieldEffect = null;
    }
    
    if (this.sounds.shieldEffect) {
      this.sounds.shieldEffect.stop();
    }
    
    this.shieldEffectTimer = null;
  }

  showShieldEffect() {
    if (this.anims.exists("shield-anim")) {
      this.shieldEffect = this.add.sprite(
        this.player.x,
        this.player.y,
        "shieldAnim"
      );
      this.shieldEffect.setScale(3);
      this.shieldEffect.setDepth(this.player.depth - 1);
      this.shieldEffect.play("shield-anim");

      // Play shield sound ONCE at the start
      if (this.sounds.shieldEffect) {
        try {
          this.sounds.shieldEffect.play();
        } catch (error) {
          console.warn("Error playing shield sound:", error);
        }
      }
      
      // Store the tween reference so we can destroy it if needed
      this.shieldTween = this.tweens.addCounter({
        from: 0,
        to: 1,
        duration: 5000,
        onUpdate: () => {
          // Add null checks to prevent the error
          if (this.shieldEffect && this.player) {
            this.shieldEffect.x = this.player.x;
            this.shieldEffect.y = this.player.y;
          }
        },
        onComplete: () => {
          if (this.shieldEffect) {
            this.shieldEffect.destroy();
            this.shieldEffect = null;
          }
          if (this.sounds.shieldEffect) {
            this.sounds.shieldEffect.stop();
          }
          this.shieldTween = null;
        },
      });
    }
  }

  startEnemySpawning() {
    this.enemySpawnTimer = this.time.addEvent({
      delay: this.enemySpawnRate,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });
  }

  startEnemyStarshipSpawning(isHorizontalMovement= false) {
    this.enemyStarshipSpawnTimer = this.time.addEvent({
      delay: this.enemyStarshipSpawnRate,
      callback: () => this.spawnEnemyStarship(isHorizontalMovement),
      callbackScope: this,
      loop: true,
    });
  }

  startL1EnemySpawning() {
    this.L1EnemySpawnTimer = this.time.addEvent({
      delay: this.L1EnemySpawnRate,
      callback: this.spawnL1Enemy,
      callbackScope: this,
      loop: true,
    });
  }

  startL2EnemySpawning() {
    this.L2EnemySpawnTimer = this.time.addEvent({
      delay: this.L2EnemySpawnRate,
      callback: this.spawnL2Enemy,
      callbackScope: this,
      loop: true,
    });
  }

  startEnemyShooting() {
    this.enemyShootTimer = this.time.addEvent({
      delay: 1000, 
      callback: this.enemyShoot,
      callbackScope: this,
      loop: true,
    });
  }

  startEnemyStarshipShooting() {
    this.enemyStarshipShootTimer = this.time.addEvent({
      delay: 1500, 
      callback: this.enemyStarshipShoot,
      callbackScope: this,
      loop: true,
    });
  }

  startL1EnemyShooting() {
    this.L1EnemyShootTimer = this.time.addEvent({
      delay: 500, 
      callback: this.L1EnemyShoot,
      callbackScope: this,
      loop: true,
    });
  }

  startL2EnemyShooting() {
    this.L2EnemyShootTimer = this.time.addEvent({
      delay: 700,
      callback: this.L2EnemyShoot,
      callbackScope: this,
      loop: true,
    });
  }

  playBackgroundMusic() {
    try {
      if (this.sounds.bgMusic) {
        this.sounds.bgMusic.play();
      }
    } catch (error) {
      console.warn("Error playing background music:", error);
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
    this.enemies.children.entries.forEach((enemy) => {
      if (enemy.update) {
        enemy.update();
      }
    });

    // Update laser groups manually
    this.lasers.children.entries.forEach((laser) => {
      if (laser.update) {
        laser.update();
      }
    });

    this.enemyLasers.children.entries.forEach((enemyLaser) => {
      if (enemyLaser.update) {
        enemyLaser.update();
      }
    });

    this.powerLasers.children.entries.forEach((powerLaser) => {
      if (powerLaser.update) {
        powerLaser.update();
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
      this.player.handleMovement(
        leftPressed,
        rightPressed,
        upPressed,
        downPressed
      );
    }

    // Shooting input - continuous shooting while holding space
    if (this.spaceKey.isDown) {
      this.playerShoot();
    }
  }

 playerShoot() {
  if (this.player && this.player.canShoot()) {
    let laser;
    
    if (this.laserBoostActive) {
      // Create power laser when boost is active
      laser = new PowerLaser(this, this.player.x, this.player.y - 30);
      this.powerLasers.add(laser);
    } else {
      // Create normal laser
      laser = new Laser(this, this.player.x, this.player.y - 30);
      this.lasers.add(laser);
    }
    
    this.player.resetShootCooldown();

    // Play shooting sound
    try {
      if (this.sounds.shootSound) {
        this.sounds.shootSound.play();
      }
    } catch (error) {
      console.warn("Error playing shoot sound:", error);
    }
  }
 }
  spawnEnemy() {
    const x = Phaser.Math.Between(100, 1200); // Wider spawn range for 1200px width
    const random_x_velcity = Phaser.Math.Between(10, 20); // Random horizontal velocity
    // this.velocity_x += random_x_velcity; // Update horizontal velocity
    const enemy = new Enemy(
      this,
      x,
      -50,
      this.enemySpeed,
      this.level,
      this.velocity_x + random_x_velcity
    );
    this.enemies.add(enemy);
    console.log(
      "Enemy spawned at:",
      x,
      -50,
      "Level:",
      this.level,
      "Total enemies:",
      this.enemies.children.size
    );
  }

  spawnEnemyStarship(isHorizontalMovement) {
    const x = Phaser.Math.Between(100, 1200);
    const enemyStarship = new EnemyStarShip(this, x, -50, isHorizontalMovement);
    if (this.enemyStarships.countActive(true) < 2) {
      // Limit to 2 active starships
      this.enemyStarships.add(enemyStarship);
    }
  }

  spawnL1Enemy() {
    const x = Phaser.Math.Between(100, 1200);
    const l1Enemy = new L1EnemyStarShip(this, x, -50);
    if (this.L1Enemies.countActive(true) < 2) {
      this.L1Enemies.add(l1Enemy);
    }
  }

  spawnL2Enemy() {
    const x = Phaser.Math.Between(100, 1200);
    const l2enemy = new L2EnemyStarShip(this, x, -50);
    if (this.L2Enemies.countActive(true) < 1) {
      this.L2Enemies.add(l2enemy);
    }
  }

  enemyShoot() {
    // Pick a random active enemy to shoot
    const activeEnemies = this.enemies.children.entries.filter(
      (enemy) => enemy.active && enemy.y > 0 && enemy.y < 750
    );
    if (activeEnemies.length > 0) {
      // const randomEnemy = Phaser.Utils.Array.GetRandom(activeEnemies);
      // this.enemyShoot(randomEnemy);

      activeEnemies.forEach((enemy) => {
        if (enemy && enemy.active) {
          const enemyLaser = new EnemyLaser(
            this,
            enemy.x,
            enemy.y + 30,
            "enemyLaser"
          );
          this.enemyLasers.add(enemyLaser);
        }
      });
    }
  }

  enemyStarshipShoot() {
    this.enemyStarships.children.each((enemyStarship) => {
      if (enemyStarship.active) {
        const starshipLaser = new EnemyLaser(
          this,
          enemyStarship.x,
          enemyStarship.y + 30,
          "enemyStarshipLaser"
        );
        this.enemyStarshipLasers.add(starshipLaser);
      }
    });
  }

  L1EnemyShoot() {
    this.L1Enemies.children.each((l1Enemy) => {
      if (l1Enemy.active) {
        const l1EnemyLaser = new EnemyLaser(
          this,
          l1Enemy.x,
          l1Enemy.y + 30,
          "L1EnemyLaser"
        );
        this.L1EnemyLasers.add(l1EnemyLaser);
      }
    });
  }

  L2EnemyShoot() {
    this.L2Enemies.children.each((l2Enemy) => {
      if(l2Enemy.active){
        const l2EnemyLaser = new EnemyLaser(
          this,
          l2Enemy.x,
          l2Enemy.y + 30,
          "L1EnemyLaser"
        );
        this.L2EnemiesLasers.add(l2EnemyLaser);
      }
    }
  )}

  destroyEnemy(enemy) {
    // Play enemy death sound
    try {
      if (this.sounds.enemyDie) {
        this.sounds.enemyDie.play();
      }
    } catch (error) {
      console.warn("Error playing enemy death sound:", error);
    }

    if(enemy instanceof EnemyStarShip) {
      this.score += 150;
    } 
    else if(enemy instanceof L1EnemyStarShip) {
      this.score += 250;
    }
    else if(enemy instanceof L2EnemyStarShip) {
      this.score += 350;
    }
    else {
      this.score += 100;
    }
    this.enemiesKilled += 1;

    // Update UI
    this.scoreText.setText("SCORE: " + this.score);
    this.killText.setText("KILLS: " + this.enemiesKilled);

    // Destroy enemy
    enemy.destroy();
  }

  destroyEnemyOnly(enemy) {
    try {
      if (this.sounds.enemyDie) {
        this.sounds.enemyDie.play();
      }
    } catch (error) {
      console.log("Error playing enemy death sound:", error);
    }
    enemy.destroy();
  }

  playerTakeDamage(damage) {
    this.health -= damage;
    this.healthText.setText("HEALTH: " + Math.max(0, this.health));

    // Play damage sound
    try {
      if (this.sounds.playerDamage) {
        this.sounds.playerDamage.play();
      }
    } catch (error) {
      console.warn("Error playing damage sound:", error);
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

    // Start the heal drop timer if health is low and not already running
    if (this.health < this.healthThreshold && !this.healDropTimer) {
      this.startHealDropTimer();
    }

    // Check for game over
    if (this.health <= 0) {
      this.gameOver();
    }
  }

  // Start a repeating timer to check for health boost drop conditions
  startHealDropTimer() {
    if (this.healDropTimer) {
      return; // Timer already running
    }
    let healDelay;
    if(this.level === 4){
      healDelay = Phaser.Math.Between(3000, 6000);
    }
    else{
    healDelay = Phaser.Math.Between(4000, 8000);
    }
    this.healDropTimer = this.time.addEvent({
      delay: healDelay,
      callback: this.checkAndDropHeal,
      callbackScope: this,
      loop: true,
    });
  }

  // Stop the heal drop timer
  stopHealDropTimer() {
    if (this.healDropTimer) {
      this.healDropTimer.remove(false);
      this.healDropTimer = null;
    }
  }

  // Check if a heal should be dropped
  checkAndDropHeal() {
    
    let activeHealsLimit;
    if(this.level === 4){
      activeHealsLimit = 2; 
    }
    else{
      activeHealsLimit = 1;
    }
    if (
      this.health < this.healthThreshold &&
      this.playerHeal.countActive(true) < activeHealsLimit
    ) {
      this.addPlayerHeal();
    }
    // If health is now above threshold, stop the timer
    if (this.health >= this.healthThreshold) {
      this.stopHealDropTimer();
    }
  }

  addPlayerHeal() {
    if (
      this.health < this.healthThreshold &&
      this.playerHeal.countActive(true) === 0
    ) {
      const x = Phaser.Math.Between(100, 1100);
      const heal = new PowerUps(this, x, -50,'heal');
      this.playerHeal.add(heal);
    }
  }

  startSpeedBoostTimer() {
    if (this.speedBoostTimer) {
      return; // Timer already running
    }
    
    let speedBoostDelay ;
    if(this.level ===2 ){
      speedBoostDelay = Phaser.Math.Between(4000, 8000);
    }
    else if(this.level === 3){
      speedBoostDelay = Phaser.Math.Between(12000, 30000);
    }
    else{
      speedBoostDelay = Phaser.Math.Between(4000, 8000)
    }
    this.speedBoostTimer = this.time.addEvent({
      delay: speedBoostDelay,
      callback: this.checkAndDropSpeedBoost,
      callbackScope: this,
      loop: true,
    });
  }

  stopSpeedBoostTimer() {
    if (this.speedBoostTimer) {
      this.speedBoostTimer.remove(false);
      this.speedBoostTimer = null;
    }
  }

  checkAndDropSpeedBoost(){
    if(this.speedBoost.countActive(true) === 0) {
     const x = Phaser.Math.Between(100, 1100);
      const speedBoost = new PowerUps(this, x, -50, 'speedBoost');
      this.speedBoost.add(speedBoost);
    }
  }

  startLaserBoostTimer() {
    if (this.laserBoostDropTimer) {
      return; // Timer already running
    }
    let laserBoostDelay;
    if(this.level === 4){
      laserBoostDelay = Phaser.Math.Between(15000, 30000);
    }
    else {
      laserBoostDelay = Phaser.Math.Between(5000, 15000);
    }
    this.laserBoostDropTimer = this.time.addEvent({
      delay: laserBoostDelay,
      callback: this.checkAndDropLaserBoost,
      callbackScope: this,
      loop: true,
    });
  }

  stopLaserBoostTimer() {
    if (this.laserBoostDropTimer) {
      this.laserBoostDropTimer.remove(false);
      this.laserBoostDropTimer = null;
    }
  }

  checkAndDropLaserBoost() {
    if (this.laserBoost.countActive(true) === 0) {
      const x = Phaser.Math.Between(100, 1100);
      const laserBoost = new PowerUps(this, x, -50, 'laserboost',0.1);
      this.laserBoost.add(laserBoost);
    }
  }

  startShieldTimer() {
    if (this.shieldTimer) {
      return; // Timer already running
    }
    
    let shieldDelay;
    if (this.level === 4) {
      // Much longer delays for level 4 - shields are very powerful
      shieldDelay = Phaser.Math.Between(20000, 25000); // 20-25 seconds
    } else {
      // Standard delays for earlier levels
      shieldDelay = Phaser.Math.Between(12000, 25000); // 12-25 seconds
    }
    
    this.shieldTimer = this.time.addEvent({
      delay: shieldDelay,
      callback: this.checkAndDropShield,
      callbackScope: this,
      loop: true,
    });
  }

  stopShieldTimer() {
    if (this.shieldTimer) {
      this.shieldTimer.remove(false);
      this.shieldTimer = null;
    }
  }

  checkAndDropShield() {
    if (this.shield.countActive(true) === 0) {
      const x = Phaser.Math.Between(100, 1100);
      const shield = new PowerUps(this, x, -50, 'shield');
      this.shield.add(shield);
    }
  }

  cleanupObjects() {
    // Remove lasers that are off-screen
    this.lasers.children.entries.forEach((laser) => {
      if (laser.y < -50) {
        laser.destroy();
      }
    });

    this.enemyLasers.children.entries.forEach((laser) => {
      if (laser.y > 850) {
        laser.destroy();
      }
    });

    // Remove health pickups that are off-screen and restart timer if needed
    this.playerHeal.children.entries.forEach((heal) => {
      if (heal.y > 850) {
        heal.destroy();
        // If health is still low and no timer is running, restart the timer
        if (this.health < this.healthThreshold && !this.healDropTimer) {
          this.startHealDropTimer();
        }
      }
    });

    // Handle enemies reaching the bottom - damage player
    this.enemies.children.entries.forEach((enemy) => {
      if (enemy.y > 750) {
        //this.playerTakeDamage(15);
        enemy.destroy();
      }
    });

    this.enemyStarships.children.entries.forEach((enemyStarship) => {
      if (enemyStarship.y > 750) {
        enemyStarship.destroy();
      }
    });
    this.enemyStarshipLasers.children.entries.forEach((enemyStarshipLaser) => {
      if (enemyStarshipLaser.y > 850) {
        enemyStarshipLaser.destroy();
      }
    });

    this.speedBoost.children.entries.forEach((speedBoost) => {
      if (speedBoost.y > 850) {
        speedBoost.destroy();
      }
    });

    this.L1Enemies.children.entries.forEach((l1Enemy) => {
      if (l1Enemy.y > 750) {
        if (l1Enemy.healthBar) {
          l1Enemy.healthBar.destroy();
        }
        l1Enemy.destroy();
      }
    });
    this.L1EnemyLasers.children.entries.forEach((l1EnemyLaser) => {
      if (l1EnemyLaser.y > 850) {
        l1EnemyLaser.destroy();
      }
    });

    this.powerLasers.children.entries.forEach((powerLaser) => {
      if (powerLaser.y < -50) {
        powerLaser.destroy();
      }
    });

    this.L2Enemies.children.entries.forEach((l2Enemy) => {
      if (l2Enemy.y > 750) {
        if (l2Enemy.healthBar) {
          l2Enemy.healthBar.destroy();
        }
        l2Enemy.destroy();
      }
    });
    this.L2EnemiesLasers.children.entries.forEach((l2EnemyLaser) => {
      if (l2EnemyLaser.y > 850) {
        l2EnemyLaser.destroy();
      }
    });

    this.shield.children.entries.forEach((shield) => {
      if (shield.y > 850) {
        shield.destroy();
      }
    });


  }

  getGameLevel(){
    if(this.score >= 5000){
      return 4;
    }
    else if(this.score >= 3000){
      return 3;
    }
    else if(this.score >= 1500){
      return 2; 
    }
    else {
      return 1;  
    }
  }

  testingGameLevel(){
    if(this.score >= 400){  
      return 4;
    }
    else if(this.score >= 300){  // Just need 300 points (3 enemies) to reach level 3
    return 3;
  }
  else if(this.score >= 200){  // 200 points for level 2
    return 2; 
  }
  else {
    return 1;  
  }
  }


  updateDifficulty() {
    
    const newLevel = this.testingGameLevel();
    if (newLevel > this.level) {
      this.level = newLevel;
      this.levelText.setText("LEVEL: " + this.level);

      // Increase difficulty
      this.enemySpeed += 10;
      //this.enemySpawnRate = Math.max(500, this.enemySpawnRate - 100);
    
      this.backgroundSpeed += 0.2;
      this.velocity_x += 10;

      // Update spawn timer
      if (this.enemySpawnTimer) {
        this.enemySpawnTimer.destroy();
        this.startEnemySpawning();
      }

      if (this.level === 2 && !this.enemyStarshipSpawnTimer) {
        this.startEnemyStarshipSpawning();
        this.startEnemyStarshipShooting();
        this.startSpeedBoostTimer();
      }
      if(this.level === 2){
        this.healthThreshold = 50; 
        this.enemySpawnRate = Math.max(500, this.enemySpawnRate - 200);
        if (this.enemySpawnTimer) {
          this.enemySpawnTimer.destroy();
          this.startEnemySpawning(); 
        }
      }

      // Stop enemy starships and speed boosts at level 3
      if (this.level === 3) {
        
        this.healthThreshold = 60; 
        this.enemySpawnRate = 2500;
        this.enemyStarshipSpawnRate = 8000;

        if (this.enemyStarshipSpawnTimer) {
          this.enemyStarshipSpawnTimer.destroy();
          this.enemyStarshipSpawnTimer = null;
        }
        this.startEnemyStarshipSpawning(true);

        if (this.enemyStarshipShootTimer) {
          this.enemyStarshipShootTimer.destroy();
          this.enemyStarshipShootTimer = null;
        }
        this.startEnemyStarshipShooting();

        if (this.speedBoostTimer) {
          this.speedBoostTimer.destroy();
          this.speedBoostTimer = null;
        }
        this.startSpeedBoostTimer(); 
        
        if (this.enemySpawnTimer) {
          this.enemySpawnTimer.destroy();
          this.startEnemySpawning(); // This will use the new enemySpawnRate
        }

        if(!this.L1EnemySpawnTimer) {
        this.startL1EnemySpawning();
        this.startL1EnemyShooting();
        }

        // Restart laser boost timer with new level delays
        if (this.laserBoostDropTimer) {
          this.laserBoostDropTimer.destroy();
          this.laserBoostDropTimer = null;
        }
        this.startLaserBoostTimer();
        
      }

      if( this.level === 4) {
        this.healthThreshold = 70;
        if(!this.L2EnemySpawnTimer) {
          this.startL2EnemySpawning();
          this.startL2EnemyShooting();
        }

        // Restart heal timer with level 4 delays (faster heals for harder difficulty)
        if (this.healDropTimer) {
          this.healDropTimer.destroy();
          this.healDropTimer = null;
          // Only restart if health is still low
          if (this.health < this.healthThreshold) {
            this.startHealDropTimer();
          }
        }

        // Restart shield timer with level 4 delays (much longer delays)
        if (this.shieldTimer) {
          this.shieldTimer.destroy();
          this.shieldTimer = null;
        }
        this.startShieldTimer();

        // Restart laser boost timer with level 4 delays (longer delays)
        if (this.laserBoostDropTimer) {
          this.laserBoostDropTimer.destroy();
          this.laserBoostDropTimer = null;
        }
        this.startLaserBoostTimer();

      }
  
      // Flash level up message
      const levelUpText = this.add
        .text(400, 300, "LEVEL UP!", {
          fontSize: "48px",
          fontFamily: "monospace",
          color: "#ffff00",
        })
        .setOrigin(0.5)
        .setDepth(200);

      this.tweens.add({
        targets: levelUpText,
        alpha: 0,
        y: 200,
        duration: 2000,
        ease: "Power2",
        onComplete: () => levelUpText.destroy(),
      });
    }
  }

  pauseGame() {
    this.scene.pause();
    this.scene.launch("PauseScene");

    // Pause all sounds properly
    Object.values(this.sounds).forEach((sound) => {
      try {
        if (sound.playing()) {
          sound.pause();
        }
      } catch (error) {
        console.warn("Error pausing sound:", error);
      }
    });

    // Stop laser boost sound completely if it's playing (since it loops)
    if (this.sounds.laserBoost && this.sounds.laserBoost.playing()) {
      this.sounds.laserBoost.stop();
    }
  }

  resumeGame() {
    this.scene.resume();

    // Only resume background music, not all sounds
    try {
      if (this.sounds.bgMusic && this.sounds.bgMusic._sounds[0] && this.sounds.bgMusic._sounds[0]._paused) {
        this.sounds.bgMusic.play();
      }
    } catch (error) {
      console.warn("Error resuming background music:", error);
    }

  }

  gameOver() {
    if (this.gameEnded) return;

    this.gameEnded = true;

    // Stop all sounds
    Object.values(this.sounds).forEach((sound) => {
      try {
        sound.stop();
      } catch (error) {
        console.warn("Error stopping sound:", error);
      }
    });

    // Play death sound
    try {
      if (this.sounds.playerDie) {
        this.sounds.playerDie.play();
      }
    } catch (error) {
      console.warn("Error playing death sound:", error);
    }

    // Stop enemy spawning
    if (this.enemySpawnTimer) {
      this.enemySpawnTimer.destroy();
    }
    if (this.enemyShootTimer) {
      this.enemyShootTimer.destroy();
    }

    if (this.enemyStarshipSpawnTimer) {
      this.enemyStarshipSpawnTimer.destroy();
    }
    if (this.enemyStarshipShootTimer) {
      this.enemyStarshipShootTimer.destroy();
    }
    if (this.L1EnemySpawnTimer) {
      this.L1EnemySpawnTimer.destroy();
    }
    if (this.L1EnemyShootTimer) {
      this.L1EnemyShootTimer.destroy();
    }
    if (this.healDropTimer) {
      this.healDropTimer.remove(false);
    }
    if (this.speedBoostTimer) {
      this.speedBoostTimer.remove(false);
    }
    if (this.laserBoostDropTimer) {
      this.laserBoostDropTimer.remove(false);
    }
    if (this.L2EnemySpawnTimer) {
      this.L2EnemySpawnTimer.destroy();
    }
    if (this.L2EnemyShootTimer) {
      this.L2EnemyShootTimer.destroy();
    }
    if (this.shieldTimer) {
      this.shieldTimer.remove(false);
    }

    this.playerHeal.clear(true, true);

    // Get the game end callback from registry
    const onGameEnd = this.registry.get("onGameEnd");
    if (onGameEnd) {
      // Delay to let death sound play
      this.time.delayedCall(1000, () => {
        onGameEnd(this.score);
      });
    }
  }
}

export default GameScene;
