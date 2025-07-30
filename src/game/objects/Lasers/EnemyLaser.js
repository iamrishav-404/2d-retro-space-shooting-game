import Phaser from 'phaser';

class EnemyLaser extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y,laserName) {
    super(scene, x, y,laserName);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = 500; 
    this.setScale(1.5); 

    this.setDepth(10); 
    if (this.body) {
      this.body.setVelocityY(this.speed);
      console.log(laserName,' created with velocity:', this.body.velocity.y);
    }
  }

  update() {
    // Manual movement as backup (in case physics isn't working)
    this.y += this.speed * (1/60); // Assuming 60 FPS
    // Destroy if off screen
    if (this.y > 850) {
      this.destroy();
    }
  }
}

export default EnemyLaser;
