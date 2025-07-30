import Phaser from 'phaser';

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y,speed=300) {
    super(scene, x, y, 'starship');
    
    // Add to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Set up physics properties
    this.setCollideWorldBounds(true);
    this.setDrag(300);
    //this.setMaxVelocity(2000);
    
    // Scale the player ship to be smaller
    this.setScale(0.1);
    
    
    // Shooting properties
    this.shootCooldown = 0;
    this.shootDelay = 200; // Faster shooting - more lasers visible
    
    // Movement speed
    this.speed = speed;

    // Set depth to be above background
    this.setDepth(10);

    console.log('Player created at:', x, y, 'with speed of:', this.speed);
  }

  update() {
    // Update shoot cooldown
    if (this.shootCooldown > 0) {
      this.shootCooldown -= this.scene.game.loop.delta;
    }
  }

  handleMovement(left, right, up, down) {
    // Reset velocity
    this.setVelocity(0);
    
    // Horizontal movement
    if (left) {
      this.setVelocityX(-this.speed);
    } else if (right) {
      this.setVelocityX(this.speed);
    }
    
    // Vertical movement
    if (up) {
      this.setVelocityY(-this.speed);
    } else if (down) {
      this.setVelocityY(this.speed);
    }
  }

  canShoot() {
    return this.shootCooldown <= 0;
  }

  resetShootCooldown() {
    this.shootCooldown = this.shootDelay;
  }
}

export default Player;
