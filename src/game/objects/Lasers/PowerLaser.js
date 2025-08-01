import Phaser from "phaser";

class PowerLaser extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "laserBoostAnim");

    // Add to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Set laser properties
    this.speed = 600; 
   // this.setVelocityY(-400); // Faster than normal laser
    this.setScale(1); // Slightly bigger
    this.setDepth(25);

    // Play the animation
    this.play("power-laser-anim");

    // Add glowing effect
    //this.setTint(0x00ffff); // Cyan glow

     if (this.body) {
      this.body.setVelocityY(-this.speed);
      console.log('Power Laser created with velocity:', this.body.velocity.y);
    }
  }

  update() {
    this.y -= this.speed * (1/60); 
    // Remove if off-screen
    if (this.y < -50) {
      this.destroy();
    }
  }
}

export default PowerLaser;