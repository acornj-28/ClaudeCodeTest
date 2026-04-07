class Bullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * BULLET_SPEED;
    this.vy = Math.sin(angle) * BULLET_SPEED;
    this.damage = BULLET_DAMAGE;
    this.radius = BULLET_RADIUS;
    this.lifetime = BULLET_LIFETIME;
    this.dead = false;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.lifetime -= dt;
    if (this.lifetime <= 0) this.dead = true;
    // off-screen cull
    if (this.x < -20 || this.x > CANVAS_W + 20 ||
        this.y < -20 || this.y > CANVAS_H + 20) {
      this.dead = true;
    }
  }

  draw(ctx) {
    const t = clamp(this.lifetime / BULLET_LIFETIME, 0, 1);
    // glow effect
    ctx.save();
    ctx.globalAlpha = 0.4 * t;
    ctx.fillStyle = COLORS.bulletGlow;
    ctx.beginPath();
    ctx.arc(r(this.x), r(this.y), this.radius * 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = t;
    ctx.fillStyle = COLORS.bullet;
    ctx.beginPath();
    ctx.arc(r(this.x), r(this.y), this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
