function drawPlayer(ctx, player) {
  if (player.dead) return;

  // Invincibility blink
  if (player.invincible && Math.floor(player.invincibleTimer * 10) % 2 === 0) return;

  const x = r(player.x);
  const y = r(player.y);
  const frame = player.animFrame;
  const angle = player.angle;

  ctx.save();

  // Shadow
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(x, y + 10, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Legs (walk cycle)
  const legOffsets = [
    [0, 0],   // frame 0: neutral
    [-3, 4],  // frame 1: left forward
    [0, 0],   // frame 2: neutral
    [3, 4],   // frame 3: right forward
  ];
  const legOff = legOffsets[frame];

  ctx.fillStyle = COLORS.playerLegs;
  // Left leg
  ctx.fillRect(x - 6, y + 5 + legOff[0], 4, 7);
  // Right leg
  ctx.fillRect(x + 2, y + 5 - legOff[0], 4, 7);

  // Body
  ctx.fillStyle = COLORS.player;
  ctx.fillRect(x - 7, y - 6, 14, 14);
  ctx.strokeStyle = COLORS.playerDark;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - 7, y - 6, 14, 14);

  // Chest detail
  ctx.fillStyle = COLORS.playerDark;
  ctx.fillRect(x - 3, y - 4, 6, 4);

  // Head
  ctx.fillStyle = COLORS.playerHead;
  ctx.fillRect(x - 5, y - 14, 10, 10);
  ctx.strokeStyle = '#c0a080';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 5, y - 14, 10, 10);

  // Eyes (small pixels)
  ctx.fillStyle = '#333';
  ctx.fillRect(x - 3, y - 11, 2, 2);
  ctx.fillRect(x + 1, y - 11, 2, 2);

  // Gun arm (rotates with aim angle)
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Arm
  ctx.fillStyle = COLORS.playerGun;
  ctx.fillRect(4, -2, 12, 4);

  // Barrel
  ctx.fillStyle = COLORS.playerGunBarrel;
  ctx.fillRect(12, -1.5, 8, 3);

  // Muzzle highlight
  ctx.fillStyle = '#fff';
  ctx.fillRect(19, -1, 2, 1);

  ctx.restore();
  ctx.restore();
}
