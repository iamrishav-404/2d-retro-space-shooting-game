import Phaser from 'phaser';

class Laser extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'laser');
    
    // Add to scene first
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Set laser properties
    this.speed = 600; 
    this.setScale(1.5); 
    this.setTint(0x00ff00); // Bright green color
    
    // Add strong glow effect
    this.setBlendMode(Phaser.BlendModes.ADD);
    
    // Set depth to be above everything except UI
    this.setDepth(25);
    
    // Enable physics body and set velocity
    if (this.body) {
      this.body.setVelocityY(-this.speed);
      console.log('Laser created with velocity:', this.body.velocity.y);
    }
  }

  update() {
    // Manual movement as backup (in case physics isn't working)
    this.y -= this.speed * (1/60); // Assuming 60 FPS
    
    // Destroy if off screen
    if (this.y < -50) {
      this.destroy();
    }
  }
}

export default Laser;
