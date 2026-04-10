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

// ── Grunt: green triceratops ────────────────────────────────────────────────
function drawGrunt(ctx, enemy) {
  const x = r(enemy.x), y = r(enemy.y);
  const frame = enemy.animFrame;
  const bob = frame === 1 ? 1 : 0;

  const green      = '#4caf50';
  const greenDark  = '#2e7d32';
  const greenLight = '#81c784';
  const orange     = '#ff6f00';

  // Legs (walk cycle)
  const legOff = frame === 1 ? 2 : 0;
  ctx.fillStyle = greenDark;
  ctx.fillRect(x - 8, y + 6 + legOff, 5, 6);
  ctx.fillRect(x + 3, y + 6 - legOff, 5, 6);

  // Frill (behind head, fan shape)
  ctx.fillStyle = orange;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(x + i * 3, y - 8 + bob);
    ctx.lineTo(x + i * 3 - 3, y - 20 + bob);
    ctx.lineTo(x + i * 3 + 3, y - 20 + bob);
    ctx.closePath();
    ctx.fill();
  }

  // Tail
  ctx.fillStyle = green;
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 2 + bob);
  ctx.quadraticCurveTo(x + 18, y + bob, x + 16, y + 8 + bob);
  ctx.quadraticCurveTo(x + 12, y + 6 + bob, x + 8, y + 6 + bob);
  ctx.closePath();
  ctx.fill();

  // Body
  ctx.fillStyle = green;
  ctx.beginPath();
  ctx.ellipse(x, y + 1 + bob, 10, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = greenLight;
  ctx.beginPath();
  ctx.ellipse(x - 1, y + bob, 7, 6, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = green;
  ctx.beginPath();
  ctx.ellipse(x - 8, y - 4 + bob, 8, 7, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Horns
  // nose horn
  ctx.fillStyle = greenDark;
  ctx.beginPath();
  ctx.moveTo(x - 15, y - 4 + bob);
  ctx.lineTo(x - 19, y - 9 + bob);
  ctx.lineTo(x - 12, y - 3 + bob);
  ctx.closePath();
  ctx.fill();
  // brow horns
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 9 + bob);
  ctx.lineTo(x - 13, y - 17 + bob);
  ctx.lineTo(x - 6,  y - 10 + bob);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 5, y - 9 + bob);
  ctx.lineTo(x - 7, y - 17 + bob);
  ctx.lineTo(x - 1, y - 10 + bob);
  ctx.closePath();
  ctx.fill();

  // Eye
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(x - 7, y - 5 + bob, 2.5, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c62828';
  ctx.beginPath();
  ctx.ellipse(x - 7, y - 5 + bob, 1.5, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Nostril
  ctx.fillStyle = greenDark;
  ctx.beginPath();
  ctx.ellipse(x - 14, y - 2 + bob, 1, 0.8, 0, 0, Math.PI * 2);
  ctx.fill();
}

// ── Rusher: brown bear ──────────────────────────────────────────────────────
function drawRusher(ctx, enemy) {
  const x = r(enemy.x), y = r(enemy.y);

  const brown      = '#795548';
  const brownDark  = '#4e342e';
  const brownLight = '#a1887f';
  const tan        = '#d7a069';

  // Trail
  if (enemy.trailPositions && enemy.trailPositions.length > 0) {
    for (let i = 0; i < enemy.trailPositions.length; i++) {
      const tp = enemy.trailPositions[i];
      const alpha = (1 - (i / enemy.trailPositions.length)) * 0.45;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = brownLight;
      const s = 8 - i * 0.8;
      ctx.beginPath();
      ctx.ellipse(r(tp.x), r(tp.y), s, s * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  const charging = enemy.chargeState !== 'paused';

  // Body
  ctx.fillStyle = charging ? brownLight : brown;
  ctx.beginPath();
  ctx.ellipse(x, y + 2, 11, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Belly
  ctx.fillStyle = tan;
  ctx.beginPath();
  ctx.ellipse(x, y + 4, 6, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Arms
  ctx.fillStyle = brown;
  ctx.beginPath();
  ctx.ellipse(x - 12, y + 2, 4, 3, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + 12, y + 2, 4, 3, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Claws
  ctx.fillStyle = brownDark;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.ellipse(x - 15 + i * 1.5, y + 4, 1, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 15 + i * 1.5, y + 4, 1, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Head
  ctx.fillStyle = charging ? brownLight : brown;
  ctx.beginPath();
  ctx.ellipse(x, y - 8, 9, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.fillStyle = brown;
  ctx.beginPath();
  ctx.ellipse(x - 7, y - 15, 4, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + 7, y - 15, 4, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c97070';
  ctx.beginPath();
  ctx.ellipse(x - 7, y - 15, 2, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + 7, y - 15, 2, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Muzzle
  ctx.fillStyle = tan;
  ctx.beginPath();
  ctx.ellipse(x, y - 6, 5, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  ctx.fillStyle = brownDark;
  ctx.beginPath();
  ctx.ellipse(x, y - 8, 2.5, 1.8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = charging ? '#ff3300' : '#1a1a1a';
  ctx.beginPath();
  ctx.ellipse(x - 4, y - 11, 1.5, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + 4, y - 11, 1.5, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // eye shine
  ctx.fillStyle = '#fff';
  ctx.fillRect(x - 4, y - 12, 1, 1);
  ctx.fillRect(x + 4, y - 12, 1, 1);
}

// ── Tank: pigeon ────────────────────────────────────────────────────────────
function drawTank(ctx, enemy) {
  const x = r(enemy.x), y = r(enemy.y);
  const frame = enemy.animFrame;
  const bob = frame === 1 ? 1 : 0;

  const pigeon     = '#9eaab4';
  const pigeonDark = '#607d8b';
  const white      = '#eceff1';
  const pink       = '#f48fb1';
  const iridGreen  = '#69f0ae';
  const iridPurp   = '#ce93d8';

  // Health bar
  const barW = 32;
  const hpRatio = clamp(enemy.hp / enemy.maxHp, 0, 1);
  ctx.fillStyle = COLORS.tankHealthBg;
  ctx.fillRect(x - barW / 2, y - 28 + bob, barW, 4);
  ctx.fillStyle = hpRatio > 0.5 ? '#2ecc71' : hpRatio > 0.25 ? '#f39c12' : COLORS.tankHealthFill;
  ctx.fillRect(x - barW / 2, y - 28 + bob, Math.round(barW * hpRatio), 4);
  ctx.strokeStyle = '#888'; ctx.lineWidth = 1;
  ctx.strokeRect(x - barW / 2, y - 28 + bob, barW, 4);

  const flash = enemy.stompFlash;

  // Feet
  ctx.fillStyle = pink;
  ctx.fillRect(x - 9, y + 14 + bob, 4, 3);
  ctx.fillRect(x + 5, y + 14 + bob, 4, 3);
  // toes
  for (let t = 0; t < 3; t++) {
    ctx.fillRect(x - 10 + t * 2, y + 17 + bob, 1, 2);
    ctx.fillRect(x + 5 + t * 2,  y + 17 + bob, 1, 2);
  }

  // Wings (slightly spread when stomping)
  const wingSpread = flash ? 6 : 2;
  ctx.fillStyle = flash ? '#fff' : pigeon;
  ctx.beginPath();
  ctx.ellipse(x - 13 - wingSpread, y + 3 + bob, 7, 5, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + 13 + wingSpread, y + 3 + bob, 7, 5, 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Body (plump)
  ctx.fillStyle = flash ? '#ffffff' : pigeon;
  ctx.beginPath();
  ctx.ellipse(x, y + 4 + bob, 13, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // White belly
  if (!flash) {
    ctx.fillStyle = white;
    ctx.beginPath();
    ctx.ellipse(x, y + 6 + bob, 8, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Iridescent neck patch
  if (!flash) {
    ctx.fillStyle = iridGreen;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.ellipse(x, y - 4 + bob, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = iridPurp;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.ellipse(x + 2, y - 4 + bob, 5, 4, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Head
  ctx.fillStyle = flash ? '#fff' : pigeonDark;
  ctx.beginPath();
  ctx.ellipse(x, y - 11 + bob, 8, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = '#bdbdbd';
  ctx.beginPath();
  ctx.moveTo(x + 7, y - 11 + bob);
  ctx.lineTo(x + 14, y - 10 + bob);
  ctx.lineTo(x + 7, y - 9 + bob);
  ctx.closePath();
  ctx.fill();
  // beak ridge
  ctx.fillStyle = '#e0e0e0';
  ctx.fillRect(x + 7, y - 12 + bob, 5, 2);

  // Eye
  ctx.fillStyle = '#ff6f00';
  ctx.beginPath();
  ctx.ellipse(x + 3, y - 13 + bob, 2.5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.ellipse(x + 3, y - 13 + bob, 1.5, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillRect(x + 3, y - 14 + bob, 1, 1);

  // Wing feather detail
  if (!flash) {
    ctx.fillStyle = pigeonDark;
    ctx.fillRect(x - 5, y + 8 + bob, 10, 2);
    ctx.fillRect(x - 4, y + 11 + bob, 8, 1);
  }
}
