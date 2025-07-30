import Phaser from "phaser";
import { Howl } from "howler";
import Player from "../objects/Player";
import Enemy from "../objects/Enemies/Enemy";
import Laser from "../objects/Lasers/Laser";
import EnemyLaser from "../objects/Lasers/EnemyLaser";
import PowerUps from "../objects/PowerUps";
import EnemyStarShip from "../objects/Enemies/EnemyStarShip";

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });

    this.player = null;
    this.enemies = null;
    this.enemyStarships = null;
    this.enemyStarshipLasers = null;
    this.lasers = null;
    this.enemyLasers = null;
    this.playerHeal = null;
    this.speedBoost = null;

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

    this.healthThreshold = 40; // Health threshold for heal drops
    this.healDropTimer = null; // Timer for health boost drop checks

    this.speedBoostDropTimer = null;
    this.speedBoostEffectTimer = null; // Timer for speed boost effect duration
    this.originalPlayerSpeed = null; // Store original speed
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

    } catch (error) {
      console.warn("Error initializing sounds:", error);
    }


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
        this.playerTakeDamage(10);
        enemyLaser.destroy();
      }
    );

    this.physics.add.overlap(
      this.player,
      this.enemyStarshipLasers,
      (player, enemyStarshipLaser) => {
        this.playerTakeDamage(15);
        enemyStarshipLaser.destroy();
      }
    );

    // Player collides with enemies
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      this.destroyEnemyOnly(enemy);
      this.playerTakeDamage(25);
    });

    this.physics.add.overlap(
      this.player,
      this.enemyStarships,
      (player, enemyStarship) => {
        this.destroyEnemyOnly(enemyStarship);
        this.playerTakeDamage(35);
      }
    );

    //health pickup collision - hit by laser
    this.physics.add.overlap(
      this.lasers,
      this.playerHeal,
      (playerLaser, heal) => {
        this.collectHealthPickup(heal);
        playerLaser.destroy(); // Also destroy the laser
      }
    );

    //health pickup collision - touched by player
    this.physics.add.overlap(this.player, this.playerHeal, (player, heal) => {
      this.collectHealthPickup(heal);
    });

    this.physics.add.overlap(this.lasers, this.speedBoost, (laser, speedBoost) => {
      this.collectSpeedBoost(speedBoost);
      laser.destroy(); // Also destroy the laser
    });

    this.physics.add.overlap(this.player, this.speedBoost, (player, speedBoost) => {
      this.collectSpeedBoost(speedBoost);
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
      console.log("Applying speed boost to player:", this.playerSpeed);
      this.player.speed = this.playerSpeed;
    }

    this.showSpeedEffect();
    speedBoost.destroy();

    // Set timer to reset speed after 5 seconds
    this.speedBoostEffectTimer = this.time.delayedCall(5000, () => {
      console.log("Resetting player speed to:", this.originalPlayerSpeed);
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

  startEnemySpawning() {
    this.enemySpawnTimer = this.time.addEvent({
      delay: this.enemySpawnRate,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });
  }

  startEnemyStarshipSpawning() {
    this.enemyStarshipSpawnTimer = this.time.addEvent({
      delay: this.enemyStarshipSpawnRate,
      callback: this.spawnEnemyStarship,
      callbackScope: this,
      loop: true,
    });
  }

  startEnemyShooting() {
    this.enemyShootTimer = this.time.addEvent({
      delay: 1000, // Enemies shoot every 1 seconds
      callback: this.enemyShoot,
      callbackScope: this,
      loop: true,
    });
  }

  startEnemyStarshipShooting() {
    this.enemyStarshipShootTimer = this.time.addEvent({
      delay: 1500, // Enemy starships shoot every 1.5 seconds
      callback: this.enemyStarshipShoot,
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
      const laser = new Laser(this, this.player.x, this.player.y - 30);
      this.lasers.add(laser);
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

  spawnEnemyStarship() {
    const x = Phaser.Math.Between(100, 1200);
    const enemyStarship = new EnemyStarShip(this, x, -50);
    if (this.enemyStarships.countActive(true) < 2) {
      // Limit to 2 active starships
      this.enemyStarships.add(enemyStarship);
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
    } else {
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
    const healDelay = Phaser.Math.Between(4000, 8000);
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
    if (
      this.health < this.healthThreshold &&
      this.playerHeal.countActive(true) === 0
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
    const speedBoostDelay = Phaser.Math.Between(4000, 8000);
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
        // // If speed boost is destroyed, restart the timer
        // if (!this.speedBoostTimer) {
        //   this.startSpeedBoostTimer();
        // }
      }
    });
  }

  getGameLevel(){
    if(this.score >= 4500){
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
  updateDifficulty() {
    const newLevel = this.getGameLevel();
    if (newLevel > this.level) {
      this.level = newLevel;
      this.levelText.setText("LEVEL: " + this.level);

      // Increase difficulty
      this.enemySpeed += 10;
      //this.enemySpawnRate = Math.max(500, this.enemySpawnRate - 100);
      this.enemySpawnRate = Math.max(500, this.enemySpawnRate - 200);
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
        this.healthThreshold = 60; 
      }

      // Stop enemy starships and speed boosts at level 3
      if (this.level === 3) {
        if (this.enemyStarshipSpawnTimer) {
          this.enemyStarshipSpawnTimer.destroy();
          this.enemyStarshipSpawnTimer = null;
        }
        if (this.enemyStarshipShootTimer) {
          this.enemyStarshipShootTimer.destroy();
          this.enemyStarshipShootTimer = null;
        }
        if (this.speedBoostTimer) {
          this.speedBoostTimer.destroy();
          this.speedBoostTimer = null;
        }
        
        // Clear existing enemy starships and speed boosts
        this.enemyStarships.clear(true, true);
        this.enemyStarshipLasers.clear(true, true);
        this.speedBoost.clear(true, true);
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

    // Pause all sounds
    Object.values(this.sounds).forEach((sound) => {
      try {
        if (sound.playing()) {
          sound.pause();
        }
      } catch (error) {
        console.warn("Error pausing sound:", error);
      }
    });
  }

  resumeGame() {
    this.scene.resume();

    // Resume all sounds
    Object.values(this.sounds).forEach((sound) => {
      try {
        if (sound._sounds[0] && sound._sounds[0]._paused) {
          sound.play();
        }
      } catch (error) {
        console.warn("Error resuming sound:", error);
      }
    });
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
