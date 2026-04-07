function drawCrosshair(ctx, x, y) {
  const size = 10;
  const gap = 4;
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.85;

  // horizontal lines
  ctx.beginPath();
  ctx.moveTo(r(x) - size, r(y));
  ctx.lineTo(r(x) - gap, r(y));
  ctx.moveTo(r(x) + gap, r(y));
  ctx.lineTo(r(x) + size, r(y));
  // vertical lines
  ctx.moveTo(r(x), r(y) - size);
  ctx.lineTo(r(x), r(y) - gap);
  ctx.moveTo(r(x), r(y) + gap);
  ctx.lineTo(r(x), r(y) + size);
  ctx.stroke();

  // center dot
  ctx.fillStyle = '#ff4444';
  ctx.globalAlpha = 0.9;
  ctx.fillRect(r(x) - 1, r(y) - 1, 2, 2);

  ctx.restore();
}

function drawBackground(ctx) {
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  const gridSize = 32;

  ctx.beginPath();
  for (let x = 0; x <= CANVAS_W; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_H);
  }
  for (let y = 0; y <= CANVAS_H; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_W, y);
  }
  ctx.stroke();
}
