import Phaser from "phaser";

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, speed = 80, level = 1,velocity_x= 0) {
    super(scene, x, y, "alien");

    // Add to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Store base speed and level
    this.baseSpeed = speed;
    this.gameLevel = level;
    this.velocity_x = velocity_x; // Store horizontal velocity

    // Scale the enemy to be much smaller - make it tiny
    this.setScale(0.07);

    // Set depth to be above background but below UI
    this.setDepth(5);

    this.spawnX = x; // Store spawn position for horizontal movement

    // Set up initial movement based on pattern
    this.setupMovement();

    console.log(
      "Enemy created at:",
      x,
      y,
      "with pattern:",
      this.movementPattern,
      "level:",
      level,
      "velocity:",
      this.body.velocity
    );
  }

  setupMovement() {
    // Ensure physics body exists
    if (!this.body) {
      console.error("Enemy physics body not found!");
      return;
    }
  }

  update() {
    // Ensure we always have some downward movement (except for horizontal sweep)
    if (this.body && Math.abs(this.body.velocity.y) < 20) {
      this.setVelocityY(this.baseSpeed);
    }
    // Move horizontally based on current position
    // Bounce horizontally at screen edges
    if (this.body) {
      const screenWidth = this.scene.sys.game.config.width;
      const halfWidth = (this.width * this.scaleX) / 2;

      // Reverse direction at edges
      if (this.x <= halfWidth && this.body.velocity.x < 0) {
        this.setVelocityX(this.velocity_x); // Move right
      } else if (
        this.x >= screenWidth - halfWidth &&
        this.body.velocity.x > 0
      ) {
        this.setVelocityX(-this.velocity_x); // Move left
      }
      // If velocity is zero (e.g., after spawn), set initial direction based on spawn position
      if (this.body.velocity.x === 0) {
        if (this.x < screenWidth / 2) {
          this.setVelocityX(this.velocity_x); // Start moving right
        } else {
          this.setVelocityX(-this.velocity_x); // Start moving left
        }
      }
    }
  }
}

export default Enemy;
