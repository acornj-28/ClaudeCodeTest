function drawEnemy(ctx, enemy) {
  if (enemy.state === 'dead') return;

  ctx.save();

  if (enemy.state === 'dying') {
    const t = clamp(enemy.deathTimer / enemy.deathDuration, 0, 1);
    ctx.globalAlpha = 1 - t;
    const scale = lerp(1, 1.6, t);
    ctx.translate(r(enemy.x), r(enemy.y));
    ctx.rotate(t * Math.PI * 0.5);
    ctx.scale(scale, scale);
    ctx.translate(-r(enemy.x), -r(enemy.y));
  }

  switch (enemy.type) {
    case 'grunt':  drawGrunt(ctx, enemy);  break;
    case 'rusher': drawRusher(ctx, enemy); break;
    case 'tank':   drawTank(ctx, enemy);   break;
  }

  ctx.restore();
}

function drawGrunt(ctx, enemy) {
  const x = r(enemy.x), y = r(enemy.y);
  const frame = enemy.animFrame;

  // Body
  const bodyH = frame === 1 ? 15 : 14;
  ctx.fillStyle = COLORS.grunt;
  ctx.fillRect(x - 7, y - 7, 14, bodyH);

  // Border
  ctx.strokeStyle = COLORS.gruntDark;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - 7, y - 7, 14, bodyH);

  // Eyes
  ctx.fillStyle = COLORS.gruntEye;
  const eyeY = frame === 1 ? y - 3 : y - 4;
  ctx.fillRect(x - 4, eyeY, 3, 3);
  ctx.fillRect(x + 1, eyeY, 3, 3);

  // Pupils
  ctx.fillStyle = '#000';
  ctx.fillRect(x - 3, eyeY + 1, 1, 1);
  ctx.fillRect(x + 2, eyeY + 1, 1, 1);
}

function drawRusher(ctx, enemy) {
  const x = r(enemy.x), y = r(enemy.y);

  // Trail dots
  if (enemy.trailPositions && enemy.trailPositions.length > 0) {
    for (let i = 0; i < enemy.trailPositions.length; i++) {
      const tp = enemy.trailPositions[i];
      const alpha = (1 - (i / enemy.trailPositions.length)) * 0.5;
      const size = 5 - i;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = COLORS.rusherBright;
      ctx.fillRect(r(tp.x) - size / 2, r(tp.y) - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
  }

  // Diamond body (rotated square)
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = enemy.chargeState === 'paused' ? COLORS.rusher : COLORS.rusherBright;
  ctx.fillRect(-6, -6, 12, 12);
  ctx.strokeStyle = '#ff0000';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-6, -6, 12, 12);
  ctx.restore();

  // Bright center pip
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - 2, y - 2, 3, 3);
}

function drawTank(ctx, enemy) {
  const x = r(enemy.x), y = r(enemy.y);
  const frame = enemy.animFrame;
  const yOff = frame === 1 ? 1 : 0;

  // Health bar above
  const barW = 28;
  const hpRatio = clamp(enemy.hp / enemy.maxHp, 0, 1);
  ctx.fillStyle = COLORS.tankHealthBg;
  ctx.fillRect(x - barW / 2, y - 20 + yOff, barW, 4);
  ctx.fillStyle = hpRatio > 0.5 ? '#2ecc71' : hpRatio > 0.25 ? '#f39c12' : COLORS.tankHealthFill;
  ctx.fillRect(x - barW / 2, y - 20 + yOff, Math.round(barW * hpRatio), 4);
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - barW / 2, y - 20 + yOff, barW, 4);

  // Body flash on stomp
  if (enemy.stompFlash) {
    ctx.fillStyle = '#ffffff';
  } else {
    ctx.fillStyle = COLORS.tank;
  }
  ctx.fillRect(x - 10, y - 11 + yOff, 20, 22);

  // Border
  ctx.strokeStyle = COLORS.tankDark;
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 10, y - 11 + yOff, 20, 22);

  // Armor bolts (corner decorations)
  if (!enemy.stompFlash) {
    ctx.fillStyle = COLORS.tankBolt;
    const boltPositions = [[-8, -9], [6, -9], [-8, 9], [6, 9]];
    for (const [bx, by] of boltPositions) {
      ctx.fillRect(x + bx, y + by + yOff, 3, 3);
    }

    // Eye slit
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(x - 5, y - 3 + yOff, 10, 3);
  }
}
