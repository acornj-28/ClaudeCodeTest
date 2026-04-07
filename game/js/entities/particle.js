class Particle {
  constructor(x, y, vx, vy, life, radius, color, gravity) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.life = life; this.maxLife = life;
    this.radius = radius;
    this.color = color;
    this.gravity = gravity || 0;
    this.dead = false;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += this.gravity * dt;
    this.life -= dt;
    if (this.life <= 0) this.dead = true;
  }

  draw(ctx) {
    const alpha = clamp(this.life / this.maxLife, 0, 1);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(r(this.x), r(this.y), Math.max(0.5, this.radius * alpha), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  static muzzleFlash(x, y, angle) {
    const particles = [];
    for (let i = 0; i < 7; i++) {
      const spread = (Math.random() - 0.5) * 0.8;
      const a = angle + spread;
      const speed = randomRange(80, 220);
      particles.push(new Particle(
        x, y,
        Math.cos(a) * speed,
        Math.sin(a) * speed,
        randomRange(0.08, 0.2),
        randomRange(1.5, 3),
        i < 4 ? COLORS.particleMuzzle : COLORS.bullet,
        0
      ));
    }
    return particles;
  }

  static bulletHit(x, y) {
    const particles = [];
    for (let i = 0; i < 5; i++) {
      const a = Math.random() * Math.PI * 2;
      const speed = randomRange(60, 160);
      particles.push(new Particle(
        x, y,
        Math.cos(a) * speed,
        Math.sin(a) * speed,
        randomRange(0.15, 0.35),
        randomRange(1, 2.5),
        COLORS.particleHit,
        80
      ));
    }
    return particles;
  }

  static enemyHit(x, y, color) {
    const particles = [];
    for (let i = 0; i < 5; i++) {
      const a = Math.random() * Math.PI * 2;
      const speed = randomRange(50, 130);
      particles.push(new Particle(
        x, y,
        Math.cos(a) * speed,
        Math.sin(a) * speed,
        randomRange(0.2, 0.4),
        randomRange(1.5, 3),
        color,
        60
      ));
    }
    return particles;
  }

  static enemyDeath(x, y, color) {
    const particles = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const speed = randomRange(80, 250);
      particles.push(new Particle(
        x, y,
        Math.cos(a) * speed,
        Math.sin(a) * speed,
        randomRange(0.3, 0.7),
        randomRange(2, 4),
        i % 3 === 0 ? COLORS.white : color,
        120
      ));
    }
    return particles;
  }

  static playerHit(x, y) {
    const particles = [];
    for (let i = 0; i < 10; i++) {
      const a = Math.random() * Math.PI * 2;
      const speed = randomRange(80, 200);
      particles.push(new Particle(
        x, y,
        Math.cos(a) * speed,
        Math.sin(a) * speed,
        randomRange(0.25, 0.5),
        randomRange(2, 4),
        COLORS.particlePlayerHit,
        100
      ));
    }
    return particles;
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  spawn(particleArray) {
    for (let p of particleArray) this.particles.push(p);
  }

  update(dt) {
    for (let p of this.particles) p.update(dt);
    this.particles = this.particles.filter(p => !p.dead);
  }

  draw(ctx) {
    for (let p of this.particles) p.draw(ctx);
  }

  clear() {
    this.particles = [];
  }
}
