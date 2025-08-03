
export const formatScore = (score) => {
  return score.toLocaleString();
};

export const formatTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const lerp = (start, end, factor) => {
  return start + (end - start) * factor;
};

export const randomBetween = (min, max) => {
  return Math.random() * (max - min) + min;
};

export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Particle effect helper
export const createExplosionParticles = (scene, x, y, color = 0xff0000) => {
  const particles = [];
  const particleCount = 8;
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const speed = randomBetween(50, 150);
    
    const particle = scene.add.circle(x, y, randomBetween(2, 4), color);
    particle.setBlendMode(Phaser.BlendModes.ADD);
    
    scene.physics.add.existing(particle);
    particle.body.setVelocity(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed
    );
    
    // Fade out and destroy
    scene.tweens.add({
      targets: particle,
      alpha: 0,
      scale: 0,
      duration: 500,
      onComplete: () => particle.destroy()
    });
    
    particles.push(particle);
  }
  
  return particles;
};

// Screen shake utility
export const addScreenShake = (scene, duration = 100, intensity = 5) => {
  scene.cameras.main.shake(duration, intensity * 0.01);
};

// Sound manager 
export const createSoundPool = (scene, key, poolSize = 5) => {
  const pool = [];
  for (let i = 0; i < poolSize; i++) {
    pool.push(scene.sound.add(key));
  }
  
  let currentIndex = 0;
  
  return {
    play: (config = {}) => {
      const sound = pool[currentIndex];
      currentIndex = (currentIndex + 1) % poolSize;
      
      if (!sound.isPlaying) {
        sound.play(config);
      }
    }
  };
};
