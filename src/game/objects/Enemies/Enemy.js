import Phaser from "phaser";

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, speed = 80, level = 1,velocity_x= 0) {
    super(scene, x, y, "alien");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.baseSpeed = speed;
    this.gameLevel = level;
    this.velocity_x = velocity_x; 

    this.setScale(0.07);
    this.setDepth(5);

    this.spawnX = x;
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
    if (!this.body) {
      console.error("Enemy physics body not found!");
      return;
    }
  }

  update() {
    // downward movement 
    if (this.body && Math.abs(this.body.velocity.y) < 20) {
      this.setVelocityY(this.baseSpeed);
    }
    // Horizontally  move 
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
      // If velocity is zero, inital movement based on position
      if (this.body.velocity.x === 0) {
        if (this.x < screenWidth / 2) {
          this.setVelocityX(this.velocity_x); 
        } else {
          this.setVelocityX(-this.velocity_x);
        }
      }
    }
  }
}

export default Enemy;
