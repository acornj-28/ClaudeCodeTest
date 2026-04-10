function drawPlayer(ctx, player) {
  if (player.dead) return;

  // Invincibility blink
  if (player.invincible && Math.floor(player.invincibleTimer * 10) % 2 === 0) return;

  const x = r(player.x);
  const y = r(player.y);
  const frame = player.animFrame;
  const angle = player.angle;

  // Husky colour palette
  const grey     = '#8a9ba8';   // main coat
  const greyDark = '#5a6e7a';   // darker grey for back / markings
  const white    = '#e8eef2';   // chest / face mask
  const black    = '#1a1a1a';   // nose, pupils
  const blue     = '#4aa8d8';   // husky blue eyes

  ctx.save();

  // ── Shadow ──────────────────────────────────────────────────────────────
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(x, y + 12, 11, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // ── Tail (behind body, points away from gun angle) ─────────────────────
  const tailAngle = angle + Math.PI + Math.sin(frame * Math.PI / 2) * 0.4;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tailAngle);
  ctx.fillStyle = grey;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(14, -6, 18, 2);
  ctx.quadraticCurveTo(14, 4, 0, 2);
  ctx.closePath();
  ctx.fill();
  // white tail tip
  ctx.fillStyle = white;
  ctx.beginPath();
  ctx.ellipse(17, 2, 3, 2, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // ── Legs (walk cycle) ───────────────────────────────────────────────────
  const legOffsets = [
    [0, 0],
    [-3, 4],
    [0, 0],
    [3, 4],
  ];
  const legOff = legOffsets[frame];

  // back legs (grey)
  ctx.fillStyle = greyDark;
  ctx.fillRect(x - 6, y + 6 + legOff[0], 4, 8);
  ctx.fillRect(x + 2, y + 6 - legOff[0], 4, 8);
  // white paws
  ctx.fillStyle = white;
  ctx.fillRect(x - 6, y + 12 + legOff[0], 4, 2);
  ctx.fillRect(x + 2, y + 12 - legOff[0], 4, 2);

  // ── Body ────────────────────────────────────────────────────────────────
  // dark grey back
  ctx.fillStyle = greyDark;
  ctx.beginPath();
  ctx.roundRect(x - 8, y - 7, 16, 15, 4);
  ctx.fill();
  // lighter grey sides
  ctx.fillStyle = grey;
  ctx.beginPath();
  ctx.roundRect(x - 6, y - 5, 12, 12, 3);
  ctx.fill();
  // white chest blaze
  ctx.fillStyle = white;
  ctx.beginPath();
  ctx.ellipse(x, y + 1, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── Head ────────────────────────────────────────────────────────────────
  // main head shape
  ctx.fillStyle = grey;
  ctx.beginPath();
  ctx.roundRect(x - 7, y - 18, 14, 12, 4);
  ctx.fill();

  // white face mask (forehead stripe + muzzle)
  ctx.fillStyle = white;
  // forehead stripe
  ctx.fillRect(x - 2, y - 18, 4, 5);
  // muzzle
  ctx.beginPath();
  ctx.roundRect(x - 4, y - 11, 8, 5, 2);
  ctx.fill();

  // Ears (pointed, husky-style)
  // left ear
  ctx.fillStyle = greyDark;
  ctx.beginPath();
  ctx.moveTo(x - 7, y - 16);
  ctx.lineTo(x - 10, y - 25);
  ctx.lineTo(x - 2, y - 18);
  ctx.closePath();
  ctx.fill();
  // inner left ear
  ctx.fillStyle = '#c97070';
  ctx.beginPath();
  ctx.moveTo(x - 7, y - 17);
  ctx.lineTo(x - 9, y - 23);
  ctx.lineTo(x - 3, y - 18);
  ctx.closePath();
  ctx.fill();

  // right ear
  ctx.fillStyle = greyDark;
  ctx.beginPath();
  ctx.moveTo(x + 7, y - 16);
  ctx.lineTo(x + 10, y - 25);
  ctx.lineTo(x + 2, y - 18);
  ctx.closePath();
  ctx.fill();
  // inner right ear
  ctx.fillStyle = '#c97070';
  ctx.beginPath();
  ctx.moveTo(x + 7, y - 17);
  ctx.lineTo(x + 9, y - 23);
  ctx.lineTo(x + 3, y - 18);
  ctx.closePath();
  ctx.fill();

  // Eyes — husky blue with dark mask patches
  // dark mask patches
  ctx.fillStyle = greyDark;
  ctx.fillRect(x - 6, y - 16, 4, 4);
  ctx.fillRect(x + 2, y - 16, 4, 4);
  // blue irises
  ctx.fillStyle = blue;
  ctx.beginPath();
  ctx.ellipse(x - 4, y - 14, 2, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + 4, y - 14, 2, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  // pupils
  ctx.fillStyle = black;
  ctx.fillRect(x - 5, y - 15, 1, 2);
  ctx.fillRect(x + 3, y - 15, 1, 2);

  // Nose
  ctx.fillStyle = black;
  ctx.beginPath();
  ctx.ellipse(x, y - 8, 2.5, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  // nose highlight
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillRect(x - 1, y - 9, 1, 1);

  // ── Gun arm (rotates with aim angle) ────────────────────────────────────
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Arm / paw
  ctx.fillStyle = grey;
  ctx.fillRect(4, -3, 10, 5);
  ctx.fillStyle = white;
  ctx.fillRect(4, -3, 3, 5); // white paw

  // Barrel
  ctx.fillStyle = '#7f8c8d';
  ctx.fillRect(10, -2, 14, 4);
  ctx.fillStyle = '#95a5a6';
  ctx.fillRect(18, -1.5, 6, 3);

  // Muzzle highlight
  ctx.fillStyle = '#fff';
  ctx.fillRect(23, -1, 2, 1);

  ctx.restore();
  ctx.restore();
}
