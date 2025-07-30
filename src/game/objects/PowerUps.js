import Phaser from "phaser";

class PowerUps extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y,name) {
    super(scene, x, y, name);


    this.speed = 80; // Set speed for upward movement
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(0.05); // Make it smaller
    this.setDepth(20);

    if (!this.body) {
      console.error("PowerUps ", name, " physics body not found!");
      return;
    }
  
  }
  update() {
    
     if (this.body ) {
      this.setVelocityY(this.speed);
    }
  }
}

export default PowerUps;
