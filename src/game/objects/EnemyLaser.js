import Phaser from 'phaser';

class EnemyLaser extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'laser');
    
    // Add to scene and enable physics
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Set laser properties
    this.setScale(1.5); // Make enemy laser bigger and more visible
    this.setTint(0xff0080); // Bright pink/red tint for enemy lasers
    
    // Set velocity (downward) - faster movement
    this.setVelocityY(500);
    
    // Add glow effect
    this.setBlendMode(Phaser.BlendModes.ADD);
    
    // Set depth to be above background but below UI
    this.setDepth(20);
    
    console.log('Enemy laser created at:', x, y, 'with velocity:', this.body.velocity.y);
  }

  update() {
    // Destroy if off screen
    if (this.y > 850) {
      this.destroy();
    }
  }
}

export default EnemyLaser;
