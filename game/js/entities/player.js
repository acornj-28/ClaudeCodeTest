class Player {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = CANVAS_W / 2;
    this.y = CANVAS_H / 2;
    this.vx = 0; this.vy = 0;
    this.hp = PLAYER_MAX_HP;
    this.maxHp = PLAYER_MAX_HP;
    this.radius = PLAYER_RADIUS;
    this.angle = 0;
    this.fireCooldown = 0;
    this.animFrame = 0;
    this.animTimer = 0;
    this.animSpeed = 0.1;
    this.isMoving = false;
    this.invincible = false;
    this.invincibleTimer = 0;
    this.dead = false;
  }

  update(dt, particleSystem) {
    // Movement
    let dx = 0, dy = 0;
    if (input.isDown('ArrowLeft', 'a'))  dx -= 1;
    if (input.isDown('ArrowRight', 'd')) dx += 1;
    if (input.isDown('ArrowUp', 'w'))    dy -= 1;
    if (input.isDown('ArrowDown', 's'))  dy += 1;

    if (dx !== 0 && dy !== 0) { dx *= 0.7071; dy *= 0.7071; }
    this.isMoving = dx !== 0 || dy !== 0;

    this.x = clamp(this.x + dx * PLAYER_SPEED * dt, this.radius, CANVAS_W - this.radius);
    this.y = clamp(this.y + dy * PLAYER_SPEED * dt, this.radius, CANVAS_H - this.radius);

    // Aim
    this.angle = angleToward(this.x, this.y, input.mouse.x, input.mouse.y);

    // Fire
    this.fireCooldown -= dt;

    // Walk animation
    if (this.isMoving) {
      this.animTimer += dt;
      if (this.animTimer >= this.animSpeed) {
        this.animTimer = 0;
        this.animFrame = (this.animFrame + 1) % 4;
      }
    } else {
      this.animFrame = 0;
    }

    // Invincibility
    if (this.invincible) {
      this.invincibleTimer -= dt;
      if (this.invincibleTimer <= 0) this.invincible = false;
    }
  }

  tryShoot(bullets, particleSystem) {
    if (this.dead) return;
    if (this.fireCooldown <= 0 && input.mouse.down) {
      this.fireCooldown = PLAYER_FIRE_RATE;
      const gunLen = 16;
      const bx = this.x + Math.cos(this.angle) * gunLen;
      const by = this.y + Math.sin(this.angle) * gunLen;
      bullets.push(new Bullet(bx, by, this.angle));
      particleSystem.spawn(Particle.muzzleFlash(bx, by, this.angle));
    }
  }

  takeDamage(amount, particleSystem) {
    if (this.invincible || this.dead) return;
    this.hp -= amount;
    this.invincible = true;
    this.invincibleTimer = PLAYER_INVINCIBLE_DURATION;
    particleSystem.spawn(Particle.playerHit(this.x, this.y));
    if (this.hp <= 0) {
      this.hp = 0;
      this.dead = true;
    }
  }
}
