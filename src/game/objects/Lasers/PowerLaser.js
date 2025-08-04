import Phaser from "phaser";

class PowerLaser extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "laserBoostAnim");

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.speed = 600; 
    this.setScale(1); 
    this.setDepth(25);

    this.play("power-laser-anim");

     if (this.body) {
      this.body.setVelocityY(-this.speed);
      console.log('Power Laser created with velocity:', this.body.velocity.y);
    }
  }

  update() {
    this.y -= this.speed * (1/60); 
    if (this.y < -50) {
      this.destroy();
    }
  }
}

export default PowerLaser;