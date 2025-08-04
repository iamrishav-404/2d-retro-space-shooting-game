import Phaser from 'phaser';

class Laser extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'laser');
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.speed = 600; 
    this.setScale(1.5); 
    this.setTint(0x00ff00); 
    
    // strong glow effect
    this.setBlendMode(Phaser.BlendModes.ADD);
    
    this.setDepth(25);
    

    if (this.body) {
      this.body.setVelocityY(-this.speed);
      console.log('Laser created with velocity:', this.body.velocity.y);
    }
  }

  update() {
    this.y -= this.speed * (1/60); 
    if (this.y < -50) {
      this.destroy();
    }
  }
}

export default Laser;
