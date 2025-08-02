import Phaser from 'phaser';

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y,speed=300) {
    super(scene, x, y, 'starship');
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.setCollideWorldBounds(true);
    this.setDrag(300);
    this.setScale(0.1);
    
    this.shootCooldown = 0;
    this.shootDelay = 200; 
    
    this.speed = speed;
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
