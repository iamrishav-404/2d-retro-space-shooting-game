import Phaser from "phaser";

class L1EnemyStarShip extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "L1enemy");

    // Add to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Store base speed and level
    this.baseSpeed = 80;
    
    // Health system
    this.maxHealth = 2;
    this.currentHealth = 2;

    this.setScale(0.13);
    this.setDepth(5);

    // Create health bar
    this.createHealthBar();

    if (!this.body) {
      console.error("Enemy physics body not found!");
      return;
    }
  }

  createHealthBar() {
    // Create health bar sprite above the enemy
    this.healthBar = this.scene.add.sprite(this.x, this.y - 40, 'healthBar');
    this.healthBar.setScale(0.5);
    this.healthBar.setDepth(15); // Above enemy but below UI
    
    // Set initial frame (full health = frame 0)
    this.healthBar.setFrame(0);
  }

  takeDamage(damage = 1) {
    this.currentHealth -= damage;
    this.currentHealth = Math.max(0, this.currentHealth);
    
    // Update health bar visual
    this.updateHealthBar();
    
    // Flash red when taking damage
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      this.clearTint();
    });
    
    // Return true if enemy is destroyed
    return this.currentHealth <= 0;
  }

  updateHealthBar() {
    if (this.healthBar) {
      // Calculate health percentage and set appropriate frame
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
    // Ensure we always have some downward movement
    if (this.body && Math.abs(this.body.velocity.y) < 20) {
      this.setVelocityY(this.baseSpeed);
    }
    
    // Update health bar position to follow enemy
    if (this.healthBar) {
      this.healthBar.x = this.x;
      this.healthBar.y = this.y - 40;
    }
  }

  destroy() {
    // Clean up health bar when enemy is destroyed
    if (this.healthBar) {
      this.healthBar.destroy();
    }
    super.destroy();
  }
}

export default L1EnemyStarShip;