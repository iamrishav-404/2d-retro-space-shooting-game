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
import L3EnemyStarShip from "../objects/Enemies/L3Enemy";

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
    this.L3Enemies = null;
    this.L3EnemiesLasers = null;

    this.playerHeal = null;
    this.speedBoost = null;
    this.laserBoost = null;
    this.shield = null;
    this.timer = null;

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
    this.L3EnemySpawnRate = 5000;
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
    this.L3EnemySpawnTimer = null;

   
    this.healDropTimer = null; 
    this.speedBoostDropTimer = null;
    this.speedBoostEffectTimer = null; 
    this.laserBoostDropTimer = null;
    this.laserBoostEffectTimer = null;
    this.shieldTimer = null;
    this.shieldEffectTimer = null;
    this.timerDropTimer = null;
    this.timerEffectTimer = null;

    this.healthThreshold = 50;
    this.originalPlayerSpeed = null; 

    this.powerLasers = null;
    this.powerLaserDuration = 10000;
    this.laserBoostActive = false;
    this.laserBoostTimer = null;

    this.shieldEffect = null;
    this.shieldTween = null;
    
    this.timeFreezeActive = false;
    this.timeFreezeEffect = null;
    this.timeFreezeTween = null;
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
    this.L3Enemies = this.physics.add.group({
      runChildUpdate: true,
    });
    this.L3EnemiesLasers = this.physics.add.group({
      runChildUpdate: true,
    });
    this.timer = this.physics.add.group({
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

    this.sounds.timerEffect = new Howl({
      src: ["./assets/timer.mp3"],
      volume: 0.8,
      html5: true,
      onloaderror: () => console.warn("Failed to load timer effect sound"),
    });

  }

  createBackground() {
    this.background1 = this.add.image(600, 400, "background");
    this.background2 = this.add.image(600, -400, "background");

    const scaleX = 1200 / this.background1.width;
    const scaleY = 800 / this.background1.height;
    const scale = Math.max(scaleX, scaleY);

    this.background1.setScale(scale);
    this.background2.setScale(scale);

    this.background1.setDepth(-100);
    this.background2.setDepth(-100);
  }

  createVisibleBorders() {
    // Create only a bottom border that stays within screen bounds
    const borderThickness = 12; 
    const borderColor = 0x00ff00; 

    this.bottomBorder = this.add.rectangle(
      600,
      790,
      1200,
      borderThickness,
      borderColor
    );
    this.bottomBorder.setDepth(50); 
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
    this.scoreText = this.add.text(20, 20, "SCORE: 0", {
      fontSize: "20px",
      fontFamily: "monospace",
      color: "#ff0080",
    });

    this.healthText = this.add.text(20, 50, "HEALTH: 100", {
      fontSize: "20px",
      fontFamily: "monospace",
      color: "#00ff00",
    });

    this.levelText = this.add.text(20, 80, "LEVEL: 1", {
      fontSize: "20px",
      fontFamily: "monospace",
      color: "#00ffff",
    });

    this.killText = this.add.text(20, 110, "KILLS: 0", {
      fontSize: "20px",
      fontFamily: "monospace",
      color: "#ffff00",
    });

    this.add.text(600, 550, "ESC: PAUSE", {
      fontSize: "14px",
      fontFamily: "monospace",
      color: "#888888",
    });

    this.scoreText.setDepth(100);
    this.healthText.setDepth(100);
    this.levelText.setDepth(100);
    this.killText.setDepth(100);
  }

  setupCollisions() {
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

    // L3Enemies collision
    this.physics.add.overlap(this.lasers, this.L3Enemies, (laser, enemy) => {
      const isDestroyed = enemy.takeDamage(1);
      if (isDestroyed) {
        this.destroyEnemy(enemy);
      }
      laser.destroy();
    });
    this.physics.add.overlap(this.player, this.L3Enemies, (player, enemy) => {
      this.destroyEnemyOnly(enemy);
      if (!this.shieldEffect) {
        this.playerTakeDamage(60);
      }
    });
    this.physics.add.overlap(this.player, this.L3EnemiesLasers, (player, enemyLaser) => {
      if (!this.shieldEffect) {
        this.playerTakeDamage(20);
      }
      enemyLaser.destroy();
    });
    this.physics.add.overlap(this.powerLasers, this.L3Enemies, (powerLaser, enemy) => {
      this.destroyEnemy(enemy);
      powerLaser.destroy();
    });

    this.physics.add.overlap(this.lasers, this.timer, (laser, timer) => {
      laser.destroy();
      this.collectTimer(timer);
    });
    this.physics.add.overlap(this.player, this.timer, (player, timer) => {
      this.collectTimer(timer);
    });
    this.physics.add.overlap(this.powerLasers, this.timer, (powerLaser, timer) => {
      powerLaser.destroy();
      this.collectTimer(timer);
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

    if (this.speedBoostEffectTimer) {
      this.speedBoostEffectTimer.remove(false);
    }

    if (!this.originalPlayerSpeed) {
      this.originalPlayerSpeed = this.player.speed;
    }
   
    this.playerSpeed = 1000;
    if (this.player) {
      this.player.speed = this.playerSpeed;
    }

    this.showSpeedEffect();
    speedBoost.destroy();

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

    if (this.laserBoostTimer) {
      this.laserBoostTimer.remove(false);
    }

    this.laserBoostActive = true;
    this.showLaserBoostEffect();
    laserBoost.destroy();

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
    // Fallback , if animation is not there
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
    if (this.shieldEffectTimer) {
      this.shieldEffectTimer.remove(false);
    }

    this.showShieldEffect();
    this.shieldEffectTimer = this.time.delayedCall(5000, () => {
      this.removeShield();
    });

    shield.destroy();
  }

  removeShield() {
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

  collectTimer(timer) { 
    console.log("Timer collected!");
    console.log("Enemies will be unable to fire for 5 seconds!");
    
    if (this.timerEffectTimer) {
      this.timerEffectTimer.remove(false);
    }
 
    this.timeFreezeActive = true;
    this.showTimeFreezeEffect();
    timer.destroy();
    
    this.timerEffectTimer = this.time.delayedCall(5000, () => {
      this.removeTimeFreezeEffect();
    });
  }

  showTimeFreezeEffect() {
    this.timeFreezeEffect = this.add.rectangle(600, 400, 1200, 800, 0xff6600, 0.08);
    this.timeFreezeEffect.setDepth(10);
    
    if (this.sounds.timerEffect) {
      try {
        this.sounds.timerEffect.play();
      } catch (error) {
        console.warn("Error playing timer sound:", error);
      }
    }
    
    // Create pulsing effect
    this.timeFreezeTween = this.tweens.add({
      targets: this.timeFreezeEffect,
      alpha: { from: 0.08, to: 0.2 },
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  removeTimeFreezeEffect() {
    this.timeFreezeActive = false;
    
    if (this.timeFreezeTween) {
      this.timeFreezeTween.destroy();
      this.timeFreezeTween = null;
    }
    
    if (this.timeFreezeEffect) {
      this.timeFreezeEffect.destroy();
      this.timeFreezeEffect = null;
    }

    if (this.sounds.timerEffect) {
      this.sounds.timerEffect.stop();
    }
    
    this.timerEffectTimer = null;
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

  startL3EnemySpawning() {
    this.L3EnemySpawnTimer = this.time.addEvent({
      delay: this.L3EnemySpawnRate,
      callback: this.spawnL3Enemy,
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

  startL3EnemyShooting() {
    this.L3EnemyShootTimer = this.time.addEvent({
      delay: 800,
      callback: this.L3EnemyShoot,
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

    this.enemies.children.entries.forEach((enemy) => {
      if (enemy.update) {
        enemy.update();
      }
    });

    this.enemyStarships.children.entries.forEach((enemyStarship) => {
      if (enemyStarship.update) {
        enemyStarship.update();
      }
    });

    this.L1Enemies.children.entries.forEach((l1Enemy) => {
      if (l1Enemy.update) {
        l1Enemy.update();
      }
    });

    this.L2Enemies.children.entries.forEach((l2Enemy) => {
      if (l2Enemy.update) {
        l2Enemy.update();
      }
    });

    this.L3Enemies.children.entries.forEach((l3Enemy) => {
      if (l3Enemy.update) {
        l3Enemy.update();
      }
    });

    this.lasers.children.entries.forEach((laser) => {
      if (laser.update) {
        laser.update();
      }
    });

    if (!this.timeFreezeActive) {
      this.enemyLasers.children.entries.forEach((enemyLaser) => {
        if (enemyLaser.update) {
          enemyLaser.update();
        }
      });

      this.enemyStarshipLasers.children.entries.forEach((enemyStarshipLaser) => {
        if (enemyStarshipLaser.update) {
          enemyStarshipLaser.update();
        }
      });

      this.L1EnemyLasers.children.entries.forEach((l1EnemyLaser) => {
        if (l1EnemyLaser.update) {
          l1EnemyLaser.update();
        }
      });

      this.L2EnemiesLasers.children.entries.forEach((l2EnemyLaser) => {
        if (l2EnemyLaser.update) {
          l2EnemyLaser.update();
        }
      });

      this.L3EnemiesLasers.children.entries.forEach((l3EnemyLaser) => {
        if (l3EnemyLaser.update) {
          l3EnemyLaser.update();
        }
      });
    }

    this.powerLasers.children.entries.forEach((powerLaser) => {
      if (powerLaser.update) {
        powerLaser.update();
      }
    });

    this.cleanupObjects();

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

    if (this.spaceKey.isDown) {
      this.playerShoot();
    }
  }

 playerShoot() {
  if (this.player && this.player.canShoot()) {
    let laser;
    
    if (this.laserBoostActive) {
      laser = new PowerLaser(this, this.player.x, this.player.y - 30);
      this.powerLasers.add(laser);
    } else {
      laser = new Laser(this, this.player.x, this.player.y - 30);
      this.lasers.add(laser);
    }
    
    this.player.resetShootCooldown();

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
    const x = Phaser.Math.Between(100, 1200); 
    const random_x_velcity = Phaser.Math.Between(10, 20); 
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
    let activeEnemy;
    if(this.level >= 4){
      activeEnemy = 2;
    } else {
      activeEnemy = 1;
    }
    if (this.L1Enemies.countActive(true) < activeEnemy) {
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

  spawnL3Enemy() {
    const x = Phaser.Math.Between(100, 1200);
    const l3enemy = new L3EnemyStarShip(this, x, -50);
    if (this.L3Enemies.countActive(true) < 1) {
      this.L3Enemies.add(l3enemy);
    }
  }

  enemyShoot() {
    // Don't shoot if time is frozen
    if (this.timeFreezeActive) return;
    
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
    if (this.timeFreezeActive) return;
    
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
    if (this.timeFreezeActive) return;
    
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
    if (this.timeFreezeActive) return;
    
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

  L3EnemyShoot() {
    if (this.timeFreezeActive) return;
    
    this.L3Enemies.children.each((l3Enemy) => { 
      if (l3Enemy.active) {
        const l3EnemyLaser1 = new EnemyLaser(
          this,
          l3Enemy.x - 23,
          l3Enemy.y + 30,
          "L1EnemyLaser"
        );
        const l3EnemyLaser2 = new EnemyLaser(
          this,
          l3Enemy.x + 23,
          l3Enemy.y + 30,
          "L1EnemyLaser"
        );
        this.L3EnemiesLasers.add(l3EnemyLaser1);
        this.L3EnemiesLasers.add(l3EnemyLaser2);
      }
    });
  }

  destroyEnemy(enemy) {
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
    else if(enemy instanceof L3EnemyStarShip) {
      this.score += 500;
    }
    else {
      this.score += 100;
    }
    this.enemiesKilled += 1;

    // Update UI
    this.scoreText.setText("SCORE: " + this.score);
    this.killText.setText("KILLS: " + this.enemiesKilled);

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

    try {
      if (this.sounds.playerDamage) {
        this.sounds.playerDamage.play();
      }
    } catch (error) {
      console.warn("Error playing damage sound:", error);
    }

    if (this.player) {
      this.player.setTint(0xff0000);
      this.time.delayedCall(100, () => {
        if (this.player) {
          this.player.clearTint();
        }
      });
    }
    if (this.health <= this.healthThreshold && !this.healDropTimer) {
      this.startHealDropTimer();
    }

    if (this.health <= 0) {
      this.gameOver();
    }
  }

  startHealDropTimer() {
    if (this.healDropTimer) {
      return; 
    }
    let healDelay;
    if(this.level === 5){
      healDelay = Phaser.Math.Between(2000, 5000);
    }
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

  stopHealDropTimer() {
    if (this.healDropTimer) {
      this.healDropTimer.remove(false);
      this.healDropTimer = null;
    }
  }

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
    if (this.health >= this.healthThreshold) {
      this.stopHealDropTimer();
    }
  }

  addPlayerHeal() {
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
      const x = Phaser.Math.Between(100, 1100);
      const heal = new PowerUps(this, x, -50,'heal');
      this.playerHeal.add(heal);
    }
  }

  startSpeedBoostTimer() {
    if (this.speedBoostTimer) {
      return; 
    }

    let speedBoostDelay;

    if(this.level >= 4){
      speedBoostDelay = Phaser.Math.Between(45000, 55000);
    }
    else if(this.level === 3){
      speedBoostDelay = Phaser.Math.Between(35000, 50000);
    }
    else if(this.level ===2 ){
      speedBoostDelay = Phaser.Math.Between(4000, 8000);
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
      return; 
    }
    let laserBoostDelay;
    if (this.level === 5){
      laserBoostDelay = Phaser.Math.Between(20000, 35000);
    }
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
      return; 
    }
    
    let shieldDelay;
    if( this.level === 5) {
      shieldDelay = Phaser.Math.Between(20000, 25000);
    } else if (this.level === 4) {
      shieldDelay = Phaser.Math.Between(15000, 20000); 
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

  startTimerPowerUp() {
    if(this.timerDropTimer){
      return; 
    }
    
    const timerDelay = Phaser.Math.Between(20000, 25000); 
    
    this.timerDropTimer = this.time.addEvent({
      delay: timerDelay,
      callback: this.checkAndDropTimer,
      callbackScope: this,
      loop: true,
    });
  }

  stopTimerPowerUp() {
    if (this.timerDropTimer) {
      this.timerDropTimer.remove(false);
      this.timerDropTimer = null;
    }
  }

  checkAndDropTimer() {
    if (this.timer.countActive(true) === 0) {
      const x = Phaser.Math.Between(100, 1100);
      const timer = new PowerUps(this, x, -50, 'timer', 0.1);
      this.timer.add(timer);
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

    this.L3Enemies.children.entries.forEach((l3Enemy) => {
      if (l3Enemy.y > 750) {
        if (l3Enemy.healthBar) {
          l3Enemy.healthBar.destroy();
        }
        l3Enemy.destroy();
      }
    });
    this.L3EnemiesLasers.children.entries.forEach((l3EnemyLaser) => {
      if (l3EnemyLaser.y > 850) {
        l3EnemyLaser.destroy();
      }
    } );

    this.timer.children.entries.forEach((timer) => {
      if (timer.y > 850) {
        timer.destroy();
      }
    } );


  }

  getGameLevel(){

    if(this.score >= 20000){
      console.log("Game finished")
      this.scene.start("GameOverScene");
    }
    if(this.score > 12000){
      return 5; 
    }
    if(this.score >= 7000){
      return 4;
    }
    else if(this.score >= 4000){
      return 3;
    }
    else if(this.score >= 2000){
      return 2; 
    }
    else {
      return 1;  
    }
  }

  testingGameLevel(){
    if(this.score > 600){
      console.log("Game finished")
      this.scene.start("GameOverScene");
    }
    if(this.score >= 500){ 
      return 5;
    }
    else if(this.score >= 400){  
      return 4;
    }
    else if(this.score >= 300){  
    return 3;
  }
  else if(this.score >= 200){  
    return 2; 
  }
  else {
    return 1;  
  }
  }


  updateDifficulty() {
    
    const newLevel = this.getGameLevel();
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

      if(this.level === 1) {
        if(this.health <= this.healthThreshold) {
          this.startHealDropTimer();
        }
      }

     
      if(this.level === 2){
        this.healthThreshold = 60; 
        this.enemySpawnRate = Math.max(500, this.enemySpawnRate - 200);
        if (this.enemySpawnTimer) {
          this.enemySpawnTimer.destroy();
          this.startEnemySpawning(); 
        }

        if (this.healDropTimer) {
          this.healDropTimer.destroy();
          this.healDropTimer = null;
          if (this.health <= this.healthThreshold) {
            this.startHealDropTimer();
          }
        }

        if (!this.enemyStarshipSpawnTimer) {
        this.startEnemyStarshipSpawning();
        this.startEnemyStarshipShooting();
        this.startSpeedBoostTimer();
      }
      }

      // Stop enemy starships and speed boosts at level 3
      if (this.level === 3) {
        
        this.healthThreshold = 70; 
        this.enemySpawnRate = 2500;
        this.enemyStarshipSpawnRate = 8000;

        if (this.healDropTimer) {
          this.healDropTimer.destroy();
          this.healDropTimer = null;
          if (this.health <= this.healthThreshold) {
            this.startHealDropTimer();
          }
        }

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
          this.startEnemySpawning(); 
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
        this.healthThreshold = 80;

        if(this.L1EnemySpawnTimer){
          this.L1EnemySpawnTimer.destroy();
          this.startL1EnemySpawning();
        }
        if(!this.L2EnemySpawnTimer) {
          this.startL2EnemySpawning();
          this.startL2EnemyShooting();
        }

        if (this.healDropTimer) {
          this.healDropTimer.destroy();
          this.healDropTimer = null;
          if (this.health <= this.healthThreshold) {
            this.startHealDropTimer();
          }
        }

        if (this.shieldTimer) {
          this.shieldTimer.destroy();
          this.shieldTimer = null;
        }
        this.startShieldTimer();

        if (this.laserBoostDropTimer) {
          this.laserBoostDropTimer.destroy();
          this.laserBoostDropTimer = null;
        }
        this.startLaserBoostTimer();

        if(this.speedBoostTimer) {
          this.speedBoostTimer.destroy();
          this.speedBoostTimer = null;
        }
        this.startSpeedBoostTimer();

      }

      if (this.level === 5) {
        this.healthThreshold = 80; 
        
        if(!this.L3EnemySpawnTimer) {
          this.startL3EnemySpawning();
          this.startL3EnemyShooting();
        }

        if (this.shieldTimer) {
          this.shieldTimer.destroy();
          this.shieldTimer = null;
        }
        this.startShieldTimer();

        if (this.laserBoostDropTimer) {
          this.laserBoostDropTimer.destroy();
          this.laserBoostDropTimer = null;
        }
        this.startLaserBoostTimer();


        if(!this.timerDropTimer) {
          this.startTimerPowerUp();
        }

        if (this.healDropTimer) {
          this.healDropTimer.destroy();
          this.healDropTimer = null;
          if (this.health <= this.healthThreshold) {
            this.startHealDropTimer();
          }
        }

        if(this.speedBoostTimer) {
          this.speedBoostTimer.destroy();
          this.speedBoostTimer = null;
        }
        this.startSpeedBoostTimer();



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
    // As Layer Sound may be running , as it runs on loop so check again
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

    Object.values(this.sounds).forEach((sound) => {
      try {
        sound.stop();
      } catch (error) {
        console.warn("Error stopping sound:", error);
      }
    });

    try {
      if (this.sounds.playerDie) {
        this.sounds.playerDie.play();
      }
    } catch (error) {
      console.warn("Error playing death sound:", error);
    }

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
    if (this.L3EnemySpawnTimer) {
      this.L3EnemySpawnTimer.destroy();
    }
    if (this.L3EnemyShootTimer) {
      this.L3EnemyShootTimer.destroy();
    }
    if (this.timerDropTimer) {
      this.timerDropTimer.remove(false);
    }
    if (this.timerEffectTimer) {
      this.timerEffectTimer.remove(false);
    }
    
    this.removeTimeFreezeEffect();

    this.playerHeal.clear(true, true);

    // Get the game end callback from registry
    const onGameEnd = this.registry.get("onGameEnd");
    if (onGameEnd) {
      this.time.delayedCall(1000, () => {
        onGameEnd(this.score);
      });
    }
  }
}

export default GameScene;
