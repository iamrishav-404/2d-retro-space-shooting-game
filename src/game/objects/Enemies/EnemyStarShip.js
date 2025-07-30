import Phaser from "phaser";

class EnemyStarShip extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "enemyStarship");

    // Add to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Store base speed and level
    this.baseSpeed = 80;

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
  }
}

export default EnemyStarShip;
