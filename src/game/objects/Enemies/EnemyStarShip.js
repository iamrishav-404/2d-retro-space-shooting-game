import Phaser from "phaser";

class EnemyStarShip extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, isHorizontalMovement = false) {
    super(scene, x, y, "enemyStarship");

    // Add to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Store base speed and level
    this.baseSpeed = 80;
    this.velocity_x = 50;
    this.isHorizontalMovement = isHorizontalMovement; 


    this.setScale(0.07);
    this.setDepth(5);

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

    if (this.body && this.isHorizontalMovement) {
      const screenWidth = this.scene.sys.game.config.width;
      const halfWidth = (this.width * this.scaleX) / 2;

      // Reverse direction at edges
      if (this.x <= halfWidth && this.body.velocity.x < 0) {
        this.setVelocityX(this.velocity_x);
      } else if (
        this.x >= screenWidth - halfWidth &&
        this.body.velocity.x > 0
      ) {
        this.setVelocityX(-this.velocity_x); 
      }
      // If velocity is zero (e.g., after spawn), set initial direction based on spawn position
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

export default EnemyStarShip;
