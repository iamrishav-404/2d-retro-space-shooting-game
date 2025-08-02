import Phaser from "phaser";

class L3EnemyStarShip extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "L3enemy");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.baseSpeed = 80;
    this.maxHealth = 4;
    this.currentHealth = 4;

    this.setScale(0.13);
    this.setDepth(5);
    this.createHealthBar();

    if (!this.body) {
      console.error("Enemy physics body not found!");
      return;
    }
  }

  createHealthBar() {
    this.healthBar = this.scene.add.sprite(this.x, this.y - 50, 'healthBar');
    this.healthBar.setScale(0.5);
    this.healthBar.setDepth(15); 
    
    this.healthBar.setFrame(0);
  }

  takeDamage(damage = 1) {
    this.currentHealth -= damage;
    this.currentHealth = Math.max(0, this.currentHealth);
    

    this.updateHealthBar();
    
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      this.clearTint();
    });
    
    return this.currentHealth <= 0;
  }

  updateHealthBar() {
    if (this.healthBar) {
      const healthPercentage = this.currentHealth / this.maxHealth;
      
      if (healthPercentage > 0.75) {
        this.healthBar.setFrame(0); // Full health
      } else if (healthPercentage > 0.5) {
        this.healthBar.setFrame(1); // 75% health
      } else if (healthPercentage > 0.25) {
        this.healthBar.setFrame(2); // 50% health
      } else if (healthPercentage > 0) {
        this.healthBar.setFrame(3); // 25% health
      } else {
        this.healthBar.setFrame(4); // Empty/destroyed
      }
    }
  }

  update() {
    if (this.body && Math.abs(this.body.velocity.y) < 20) {
      this.setVelocityY(this.baseSpeed);
    }
    
    if (this.healthBar) {
      this.healthBar.x = this.x;
      this.healthBar.y = this.y - 50;
    }
  }

  destroy() {
    if (this.healthBar) {
      this.healthBar.destroy();
    }
    super.destroy();
  }
}

export default L3EnemyStarShip;