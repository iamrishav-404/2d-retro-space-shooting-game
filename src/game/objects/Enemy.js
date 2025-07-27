import Phaser from 'phaser';

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, speed = 80, level = 1) {
    super(scene, x, y, 'alien');
    
    // Add to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Store base speed and level
    this.baseSpeed = speed;
    this.gameLevel = level;
    
    // Adjust movement patterns based on level
    if (level >= 2) {
      // From level 2+: Higher chance of horizontal movement
      const rand = Phaser.Math.Between(0, 10);
      if (rand <= 3) {
        this.movementPattern = 3; // 40% chance of horizontal sweep
      } else {
        this.movementPattern = Phaser.Math.Between(0, 2); // 60% chance of other patterns
      }
    } else {
      // Level 1: Only basic patterns
      this.movementPattern = Phaser.Math.Between(0, 2);
      // 0 = straight down, 1 = zigzag, 2 = diagonal
    }
    
    // Scale the enemy to be much smaller - make it tiny
    this.setScale(0.07);
    
    // Set depth to be above background but below UI
    this.setDepth(5);
    
    // Movement tracking for patterns
    this.moveTimer = 0;
    this.horizontalDirection = Phaser.Math.Between(0, 1) ? 1 : -1;
    this.spawnX = x; // Store spawn position for horizontal movement
    
    // Set up initial movement based on pattern
    this.setupMovement();
    
    // Color code enemies by movement pattern for easy identification
    if (this.movementPattern === 3) {
      this.setTint(0xff0000); // Red tint for horizontal sweep enemies
    }
    
    console.log('Enemy created at:', x, y, 'with pattern:', this.movementPattern, 'level:', level, 'velocity:', this.body.velocity);
  }
  
  setupMovement() {
    // Ensure physics body exists
    if (!this.body) {
      console.error('Enemy physics body not found!');
      return;
    }
    
    switch(this.movementPattern) {
      case 0: // Straight down - always moves down
        this.setVelocity(0, this.baseSpeed);
        console.log('Enemy setup: straight down, velocity Y:', this.body.velocity.y);
        break;
      case 1: // Zigzag (starts with horizontal + down)
        this.setVelocity(this.horizontalDirection * 60, this.baseSpeed);
        console.log('Enemy setup: zigzag, velocity X:', this.body.velocity.x, 'Y:', this.body.velocity.y);
        break;
      case 2: // Diagonal
        const diagDirection = Phaser.Math.Between(0, 1) ? 1 : -1;
        this.setVelocity(diagDirection * 40, this.baseSpeed);
        console.log('Enemy setup: diagonal, velocity X:', this.body.velocity.x, 'Y:', this.body.velocity.y);
        break;
      case 3: // Horizontal sweep (level 2+) - cross entire screen horizontally
        // Start from one edge and move to the other edge
        if (this.spawnX < 600) { // If spawned on left half, move right
          this.setVelocity(200, this.baseSpeed * 0.2); // Much faster horizontal, slower vertical
          this.horizontalDirection = 1;
        } else { // If spawned on right half, move left
          this.setVelocity(-200, this.baseSpeed * 0.2); // Much faster horizontal, slower vertical
          this.horizontalDirection = -1;
        }
        console.log('Enemy setup: horizontal sweep, velocity X:', this.body.velocity.x, 'Y:', this.body.velocity.y);
        break;
    }
  }
  
  update() {
    // Ensure we always have some downward movement (except for horizontal sweep)
    if (this.body && this.movementPattern !== 3 && Math.abs(this.body.velocity.y) < 20) {
      this.setVelocityY(this.baseSpeed);
    }
    
    this.moveTimer += 16; // Approximate delta time
    
    if (this.movementPattern === 1) { // Zigzag pattern
      if (this.moveTimer > 800) { // Change direction every 0.8 seconds
        this.horizontalDirection *= -1;
        this.setVelocityX(this.horizontalDirection * 60);
        this.moveTimer = 0;
      }
      // Keep zigzag enemies within screen bounds
      if (this.x < 50) {
        this.setVelocityX(Math.abs(this.body.velocity.x));
        this.horizontalDirection = 1;
      } else if (this.x > 1150) {
        this.setVelocityX(-Math.abs(this.body.velocity.x));
        this.horizontalDirection = -1;
      }
    } else if (this.movementPattern === 3) { // Horizontal sweep pattern
      // For horizontal sweep, don't bounce - let them go off screen
      // They will be cleaned up by the game's cleanup system
      // Just maintain consistent horizontal movement across the screen
    } else {
      // Keep other patterns within screen bounds horizontally
      if (this.x < 50) {
        this.setVelocityX(Math.abs(this.body.velocity.x));
        this.horizontalDirection = 1;
      } else if (this.x > 1150) {
        this.setVelocityX(-Math.abs(this.body.velocity.x));
        this.horizontalDirection = -1;
      }
    }
  }
}

export default Enemy;
