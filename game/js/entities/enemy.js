class Enemy {
  constructor(x, y, type, levelNum) {
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.type = type;
    this.state = 'alive'; // alive | dying | dead
    this.deathTimer = 0;
    this.deathDuration = 0.4;
    this.deathParticlesSpawned = false;
    this.animFrame = 0;
    this.animTimer = 0;

    // Set per subclass then scale
    this.setupStats(levelNum || 1);
  }

  setupStats(level) { /* override */ }

  scaleStats(level, baseHp, baseSpeed) {
    const scale = 1 + (level - 1) * 0.15;
    const speedScale = 1 + (level - 1) * 0.05;
    this.hp = Math.round(baseHp * scale);
    this.maxHp = this.hp;
    this.speed = baseSpeed * speedScale;
  }

  update(dt, player, particleSystem) {
    if (this.state === 'dying') {
      this.deathTimer += dt;
      if (!this.deathParticlesSpawned) {
        this.deathParticlesSpawned = true;
        particleSystem.spawn(Particle.enemyDeath(this.x, this.y, this.deathColor));
      }
      if (this.deathTimer >= this.deathDuration) {
        this.state = 'dead';
      }
      return;
    }
    this.behaviorUpdate(dt, player);
    this.animTimer += dt;
    if (this.animTimer >= this.animSpeed) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % this.animFrames;
    }
  }

  behaviorUpdate(dt, player) { /* override */ }

  takeDamage(amount, particleSystem) {
    if (this.state !== 'alive') return;
    this.hp -= amount;
    particleSystem.spawn(Particle.enemyHit(this.x, this.y, this.deathColor));
    if (this.hp <= 0) {
      this.state = 'dying';
      this.deathTimer = 0;
    }
  }
}

// ─── Grunt ───────────────────────────────────────────────────────────────────
class Grunt extends Enemy {
  constructor(x, y, levelNum) {
    super(x, y, 'grunt', levelNum);
  }

  setupStats(level) {
    this.radius = 9;
    this.damage = 15;
    this.scoreValue = 10;
    this.animFrames = 2;
    this.animSpeed = 0.18;
    this.deathColor = COLORS.grunt;
    this.scaleStats(level, 30, 90);
  }

  behaviorUpdate(dt, player) {
    const ang = angleToward(this.x, this.y, player.x, player.y);
    this.vx = Math.cos(ang) * this.speed;
    this.vy = Math.sin(ang) * this.speed;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }
}

// ─── Rusher ──────────────────────────────────────────────────────────────────
class Rusher extends Enemy {
  constructor(x, y, levelNum) {
    super(x, y, 'rusher', levelNum);
    this.chargeAngle = 0;
    this.chargeDuration = 2.0;
    this.pauseDuration = 0.5;
    this.chargeTimer = 0;
    this.chargeState = 'charging'; // charging | paused
  }

  setupStats(level) {
    this.radius = 7;
    this.damage = 25;
    this.scoreValue = 20;
    this.animFrames = 1;
    this.animSpeed = 999;
    this.deathColor = COLORS.rusher;
    this.trailPositions = [];
    this.scaleStats(level, 15, 200);
  }

  behaviorUpdate(dt, player) {
    this.chargeTimer += dt;

    if (this.chargeState === 'charging') {
      if (this.chargeTimer >= this.chargeDuration) {
        this.chargeState = 'paused';
        this.chargeTimer = 0;
        this.vx = 0; this.vy = 0;
      } else {
        this.vx = Math.cos(this.chargeAngle) * this.speed;
        this.vy = Math.sin(this.chargeAngle) * this.speed;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        // trail
        this.trailPositions.unshift({ x: this.x, y: this.y });
        if (this.trailPositions.length > 5) this.trailPositions.pop();
      }
    } else {
      // paused — lock on and prepare next charge angle
      this.chargeAngle = angleToward(this.x, this.y, player.x, player.y);
      this.trailPositions = [];
      if (this.chargeTimer >= this.pauseDuration) {
        this.chargeState = 'charging';
        this.chargeTimer = 0;
      }
    }
  }
}

// ─── Tank ─────────────────────────────────────────────────────────────────────
class Tank extends Enemy {
  constructor(x, y, levelNum) {
    super(x, y, 'tank', levelNum);
    this.stompTimer = 0;
    this.stompInterval = 1.5;
    this.stompDuration = 0.3;
    this.stomping = false;
    this.stompFlash = false;
  }

  setupStats(level) {
    this.radius = 14;
    this.damage = 30;
    this.scoreValue = 50;
    this.animFrames = 2;
    this.animSpeed = 0.35;
    this.deathColor = COLORS.tank;
    this.scaleStats(level, 120, 45);
  }

  behaviorUpdate(dt, player) {
    this.stompTimer += dt;
    if (!this.stomping && this.stompTimer >= this.stompInterval) {
      this.stomping = true;
      this.stompTimer = 0;
      this.stompFlash = true;
    }
    if (this.stomping && this.stompTimer >= this.stompDuration) {
      this.stomping = false;
      this.stompFlash = false;
    }

    const currentSpeed = this.stomping ? this.speed * 3 : this.speed;
    const ang = angleToward(this.x, this.y, player.x, player.y);
    this.vx = Math.cos(ang) * currentSpeed;
    this.vy = Math.sin(ang) * currentSpeed;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }
}

function createEnemy(type, x, y, levelNum) {
  switch (type) {
    case 'grunt':  return new Grunt(x, y, levelNum);
    case 'rusher': return new Rusher(x, y, levelNum);
    case 'tank':   return new Tank(x, y, levelNum);
  }
}
