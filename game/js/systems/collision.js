function circleCircle(ax, ay, ar, bx, by, br) {
  return distance(ax, ay, bx, by) < ar + br;
}

const collision = {
  bulletsVsEnemies(bullets, enemies, particleSystem, onScore) {
    for (let b of bullets) {
      if (b.dead) continue;
      for (let e of enemies) {
        if (e.state !== 'alive') continue;
        if (circleCircle(b.x, b.y, b.radius, e.x, e.y, e.radius)) {
          b.dead = true;
          const wasAlive = e.state === 'alive';
          e.takeDamage(b.damage, particleSystem);
          if (wasAlive && e.state === 'dying') {
            onScore(e.scoreValue);
          }
          particleSystem.spawn(Particle.bulletHit(b.x, b.y));
          break;
        }
      }
    }
  },

  enemiesVsPlayer(enemies, player, dt, particleSystem) {
    for (let e of enemies) {
      if (e.state !== 'alive') continue;
      if (circleCircle(e.x, e.y, e.radius, player.x, player.y, player.radius)) {
        player.takeDamage(e.damage * dt, particleSystem);
      }
    }
  },
};
