import Phaser from 'phaser';

class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseScene' });
  }

  create() {

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Create semi-transparent overlay
    const overlay = this.add.rectangle(centerX, centerY, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.7);
    overlay.setOrigin(0.5);

    // Pause title
    this.add.text(centerX, centerY - 100, 'MISSION PAUSED', {
      font: '48px monospace',
      fill: '#00ff00',
      align: 'center'
    }).setOrigin(0.5);

    // Instructions
    this.add.text(centerX, centerY, 'PRESS ESC TO RESUME', {
      font: '24px monospace',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(centerX, centerY + 50, 'PRESS R TO RESTART', {
      font: '24px monospace',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(centerX, centerY + 100, 'PRESS Q TO QUIT', {
      font: '24px monospace',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    // Input handling
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
  }

  update() {
    // Resume game
    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      this.resumeGame();
    }

    // Restart game
    if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
      this.restartGame();
    }

    // Quit to menu
    if (Phaser.Input.Keyboard.JustDown(this.qKey)) {
      this.quitGame();
    }
  }

  resumeGame() {
    this.scene.stop();
    this.scene.resume('GameScene');
    
    // Tell game scene to resume sounds
    const gameScene = this.scene.get('GameScene');
    if (gameScene && gameScene.resumeGame) {
      gameScene.resumeGame();
    }
  }

  restartGame() {
    this.scene.stop();
    this.scene.stop('GameScene');
    this.scene.start('GameScene');
  }

  quitGame() {
    // Get the game end callback and call it with current score
    const gameScene = this.scene.get('GameScene');
    const onGameEnd = this.registry.get('onGameEnd');
    
    if (onGameEnd && gameScene) {
      onGameEnd(gameScene.score || 0);
    }
  }
}

export default PauseScene;
