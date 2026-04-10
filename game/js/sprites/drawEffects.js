// ── Crosshair ─────────────────────────────────────────────────────────────────
function drawCrosshair(ctx, x, y) {
  const size = 10, gap = 4;
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.moveTo(r(x) - size, r(y)); ctx.lineTo(r(x) - gap, r(y));
  ctx.moveTo(r(x) + gap,  r(y)); ctx.lineTo(r(x) + size, r(y));
  ctx.moveTo(r(x), r(y) - size); ctx.lineTo(r(x), r(y) - gap);
  ctx.moveTo(r(x), r(y) + gap);  ctx.lineTo(r(x), r(y) + size);
  ctx.stroke();
  ctx.fillStyle = '#ff4444';
  ctx.globalAlpha = 0.9;
  ctx.fillRect(r(x) - 1, r(y) - 1, 2, 2);
  ctx.restore();
}

// ── Seeded RNG ────────────────────────────────────────────────────────────────
function seededRng(seed) {
  let s = seed | 0;
  return function () {
    s = (Math.imul(s, 1664525) + 1013904223) | 0;
    return (s >>> 0) / 0x100000000;
  };
}

// ── Map Generator ─────────────────────────────────────────────────────────────
function _perimPos(rng) {
  const m = 68;
  const side = Math.floor(rng() * 4);
  switch (side) {
    case 0: return { x: rng() * CANVAS_W, y: 10 + rng() * (m - 10) };
    case 1: return { x: rng() * CANVAS_W, y: CANVAS_H - m + rng() * (m - 10) };
    case 2: return { x: 10 + rng() * (m - 10), y: rng() * CANVAS_H };
    default:return { x: CANVAS_W - m + rng() * (m - 10), y: rng() * CANVAS_H };
  }
}

function generateMap(level) {
  const rng = seededRng(level * 31337 + 999);
  const themes = ['park', 'courtyard', 'desert'];
  const theme = themes[(level - 1) % themes.length];

  // Pre-compute floor tile variation values
  const tileSize = 32;
  const cols = Math.ceil(CANVAS_W / tileSize) + 1;
  const rows = Math.ceil(CANVAS_H / tileSize) + 1;
  const tiles = [];
  for (let i = 0; i < cols * rows; i++) tiles.push(rng());

  const objects = [];

  if (theme === 'park') {
    const treeCount = 10 + Math.floor(rng() * 5);
    for (let i = 0; i < treeCount; i++) {
      const p = _perimPos(rng);
      objects.push({ type: 'tree', x: p.x, y: p.y, size: 22 + rng() * 12 });
    }
    for (let i = 0; i < 7 + Math.floor(rng() * 4); i++) {
      const p = _perimPos(rng);
      objects.push({ type: 'rock', x: p.x, y: p.y, size: 8 + rng() * 8, angle: rng() * Math.PI });
    }
    for (let i = 0; i < 22 + Math.floor(rng() * 14); i++) {
      const p = _perimPos(rng);
      const cols2 = ['#ef5350', '#ffee58', '#ce93d8', '#4fc3f7', '#ff8a65', '#a5d6a7'];
      objects.push({ type: 'flower', x: p.x, y: p.y, color: cols2[Math.floor(rng() * cols2.length)] });
    }
  } else if (theme === 'courtyard') {
    const pillarPos = [
      { x: 38, y: 38 }, { x: CANVAS_W - 38, y: 38 },
      { x: 38, y: CANVAS_H - 38 }, { x: CANVAS_W - 38, y: CANVAS_H - 38 },
      { x: CANVAS_W / 2, y: 30 }, { x: CANVAS_W / 2, y: CANVAS_H - 30 },
      { x: 30, y: CANVAS_H / 2 }, { x: CANVAS_W - 30, y: CANVAS_H / 2 },
    ];
    for (const p of pillarPos) objects.push({ type: 'pillar', x: p.x, y: p.y });
    for (let i = 0; i < 6 + Math.floor(rng() * 4); i++) {
      const p = _perimPos(rng);
      objects.push({ type: 'barrel', x: p.x, y: p.y });
    }
    const torchPositions = [
      { x: CANVAS_W * 0.25, y: 18 }, { x: CANVAS_W * 0.75, y: 18 },
      { x: CANVAS_W * 0.25, y: CANVAS_H - 18 }, { x: CANVAS_W * 0.75, y: CANVAS_H - 18 },
      { x: 18, y: CANVAS_H * 0.3 }, { x: 18, y: CANVAS_H * 0.7 },
      { x: CANVAS_W - 18, y: CANVAS_H * 0.3 }, { x: CANVAS_W - 18, y: CANVAS_H * 0.7 },
    ];
    for (const p of torchPositions) objects.push({ type: 'torch', x: p.x, y: p.y });
  } else if (theme === 'desert') {
    for (let i = 0; i < 8 + Math.floor(rng() * 5); i++) {
      const p = _perimPos(rng);
      objects.push({ type: 'cactus', x: p.x, y: p.y, h: 24 + rng() * 18 });
    }
    for (let i = 0; i < 8 + Math.floor(rng() * 4); i++) {
      const p = _perimPos(rng);
      objects.push({ type: 'sandrock', x: p.x, y: p.y, size: 10 + rng() * 10, angle: rng() * Math.PI });
    }
    for (let i = 0; i < 5 + Math.floor(rng() * 4); i++) {
      const p = _perimPos(rng);
      objects.push({ type: 'skull', x: p.x, y: p.y });
    }
  }

  return { theme, tileSize, cols, rows, tiles, objects };
}

// ── Object draw helpers ───────────────────────────────────────────────────────
function _mapTree(ctx, obj) {
  const { x, y, size: s } = obj;
  ctx.globalAlpha = 0.2; ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.ellipse(x, y + s * 0.38, s * 0.65, s * 0.22, 0, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#4e342e'; ctx.fillRect(x - s * 0.12, y - s * 0.12, s * 0.24, s * 0.5);
  ctx.fillStyle = '#1b5e20';
  ctx.beginPath(); ctx.ellipse(x, y - s * 0.22, s * 0.72, s * 0.66, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#2e7d32';
  ctx.beginPath(); ctx.ellipse(x - s * 0.18, y - s * 0.34, s * 0.55, s * 0.5, -0.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#388e3c';
  ctx.beginPath(); ctx.ellipse(x + s * 0.1, y - s * 0.46, s * 0.48, s * 0.44, 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(120,220,80,0.18)';
  ctx.beginPath(); ctx.ellipse(x - s * 0.15, y - s * 0.52, s * 0.22, s * 0.2, -0.4, 0, Math.PI * 2); ctx.fill();
}

function _mapRock(ctx, obj) {
  const { x, y, size: s, angle } = obj;
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
  ctx.fillStyle = '#546e7a';
  ctx.beginPath(); ctx.ellipse(0, 0, s, s * 0.7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#78909c';
  ctx.beginPath(); ctx.ellipse(-s * 0.2, -s * 0.2, s * 0.45, s * 0.35, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.beginPath(); ctx.ellipse(-s * 0.28, -s * 0.28, s * 0.18, s * 0.12, -0.5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function _mapFlower(ctx, obj) {
  const { x, y, color } = obj;
  ctx.fillStyle = '#388e3c'; ctx.fillRect(x - 1, y, 2, 5);
  ctx.fillStyle = color;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(x + Math.cos(a) * 3, y + Math.sin(a) * 3, 2.2, 1.5, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#fff176';
  ctx.beginPath(); ctx.ellipse(x, y, 2, 2, 0, 0, Math.PI * 2); ctx.fill();
}

function _mapPillar(ctx, obj) {
  const { x, y } = obj;
  const pw = 18, ph = 32;
  ctx.fillStyle = '#37474f';
  ctx.fillRect(x - pw / 2 - 2, y + ph / 2 - 4, pw + 4, 7);
  ctx.fillRect(x - pw / 2 - 2, y - ph / 2 - 4, pw + 4, 7);
  ctx.fillStyle = '#546e7a'; ctx.fillRect(x - pw / 2, y - ph / 2, pw, ph);
  ctx.strokeStyle = '#37474f'; ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) {
    const lx = x - pw / 2 + (pw / 4) * i;
    ctx.beginPath(); ctx.moveTo(lx, y - ph / 2 + 6); ctx.lineTo(lx, y + ph / 2 - 6); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fillRect(x - pw / 2 + 2, y - ph / 2 + 5, 4, ph - 10);
}

function _mapBarrel(ctx, obj) {
  const { x, y } = obj;
  const bw = 14, bh = 18;
  ctx.fillStyle = '#6d4c41';
  ctx.beginPath(); ctx.roundRect(x - bw / 2, y - bh / 2, bw, bh, 3); ctx.fill();
  ctx.strokeStyle = '#3e2723'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x - bw / 2, y - bh / 2 + 5); ctx.lineTo(x + bw / 2, y - bh / 2 + 5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - bw / 2, y + bh / 2 - 5); ctx.lineTo(x + bw / 2, y + bh / 2 - 5); ctx.stroke();
  ctx.fillStyle = '#8d6e63';
  ctx.beginPath(); ctx.ellipse(x, y - bh / 2, bw / 2, 3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(x - bw / 2 + 2, y - bh / 2 + 2, 3, bh - 4);
}

function _mapTorch(ctx, obj) {
  const { x, y } = obj;
  const t = performance.now() / 1000;
  const flicker = Math.sin(t * 9 + x * 0.5) * 1.5;
  ctx.fillStyle = '#616161'; ctx.fillRect(x - 3, y - 2, 6, 4);
  ctx.fillStyle = '#5d4037'; ctx.fillRect(x - 1.5, y - 10, 3, 9);
  ctx.fillStyle = 'rgba(255,150,0,0.22)';
  ctx.beginPath(); ctx.ellipse(x, y - 12, 10, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e65100';
  ctx.beginPath(); ctx.ellipse(x + flicker * 0.3, y - 14 + flicker * 0.2, 3.5, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffd740';
  ctx.beginPath(); ctx.ellipse(x + flicker * 0.2, y - 13 + flicker * 0.15, 2, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff8e1';
  ctx.beginPath(); ctx.ellipse(x, y - 12.5, 0.8, 1.5, 0, 0, Math.PI * 2); ctx.fill();
}

function _mapCactus(ctx, obj) {
  const { x, y, h } = obj;
  ctx.fillStyle = '#2e7d32';
  ctx.fillRect(x - 5, y - h, 10, h);
  ctx.fillRect(x - 14, y - h * 0.65, 9, 5);
  ctx.fillRect(x - 14, y - h * 0.65 - 12, 5, 14);
  ctx.fillRect(x + 5, y - h * 0.45, 9, 5);
  ctx.fillRect(x + 9, y - h * 0.45 - 14, 5, 16);
  ctx.strokeStyle = '#c8e6c9'; ctx.lineWidth = 0.8;
  for (let i = 0; i < 3; i++) {
    const sy = y - h * 0.25 - i * h * 0.25;
    ctx.beginPath(); ctx.moveTo(x + 5, sy); ctx.lineTo(x + 10, sy - 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 5, sy); ctx.lineTo(x - 10, sy - 4); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(100,200,80,0.15)'; ctx.fillRect(x - 1.5, y - h + 5, 3, h - 10);
}

function _mapSandRock(ctx, obj) {
  const { x, y, size: s, angle } = obj;
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
  ctx.fillStyle = '#8d6e63';
  ctx.beginPath(); ctx.ellipse(0, 0, s, s * 0.65, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#bcaaa4';
  ctx.beginPath(); ctx.ellipse(-s * 0.2, -s * 0.2, s * 0.4, s * 0.3, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function _mapSkull(ctx, obj) {
  const { x, y } = obj;
  ctx.fillStyle = '#efebe9';
  ctx.beginPath(); ctx.ellipse(x, y - 4, 7, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(x - 4, y + 1, 8, 4);
  ctx.fillStyle = '#4e342e';
  ctx.beginPath(); ctx.ellipse(x - 2.5, y - 4, 2.2, 2.2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + 2.5, y - 4, 2.2, 2.2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#efebe9';
  for (let i = 0; i < 3; i++) ctx.fillRect(x - 3 + i * 3, y + 2, 2, 3);
}

// ── Floor tile colour palettes ────────────────────────────────────────────────
const _TILE_PAL = {
  park:      ['#152a18', '#192e1c', '#1c3220', '#1f3622', '#223a25'],
  courtyard: ['#1a1a1a', '#1e1e1e', '#232323', '#272727', '#2c2c2c'],
  desert:    ['#7a5e22', '#876828', '#957030', '#a07835', '#ab823c'],
};

function _tileColor(theme, v) {
  const p = _TILE_PAL[theme] || _TILE_PAL.park;
  return p[Math.min(Math.floor(v * p.length), p.length - 1)];
}

// ── drawBackground ────────────────────────────────────────────────────────────
function drawBackground(ctx, map) {
  if (!map) {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    return;
  }

  const { theme, tileSize: ts, cols, rows, tiles, objects } = map;

  // 1. Floor tiles
  const gapPx = theme === 'courtyard' ? 1 : 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const v = tiles[row * cols + col];
      ctx.fillStyle = _tileColor(theme, v);
      ctx.fillRect(col * ts + gapPx, row * ts + gapPx, ts - gapPx * 2, ts - gapPx * 2);
    }
  }

  // Courtyard grout colour between tiles
  if (theme === 'courtyard') {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H); // already shows through gaps — just for edge
  }

  // 2. Subtle vignette
  const vg = ctx.createRadialGradient(CANVAS_W / 2, CANVAS_H / 2, 100, CANVAS_W / 2, CANVAS_H / 2, 430);
  vg.addColorStop(0, 'rgba(255,255,255,0.03)');
  vg.addColorStop(1, 'rgba(0,0,0,0.40)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // 3. Border frame
  const borderCol = { park: '#0a1a0c', courtyard: '#0d0d0d', desert: '#5c3b0c' };
  ctx.strokeStyle = borderCol[theme] || '#000'; ctx.lineWidth = 8;
  ctx.strokeRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, CANVAS_W - 20, CANVAS_H - 20);

  // 4. Decorative objects
  for (const obj of objects) {
    ctx.save();
    switch (obj.type) {
      case 'tree':     _mapTree(ctx, obj);     break;
      case 'rock':     _mapRock(ctx, obj);     break;
      case 'flower':   _mapFlower(ctx, obj);   break;
      case 'pillar':   _mapPillar(ctx, obj);   break;
      case 'barrel':   _mapBarrel(ctx, obj);   break;
      case 'torch':    _mapTorch(ctx, obj);    break;
      case 'cactus':   _mapCactus(ctx, obj);   break;
      case 'sandrock': _mapSandRock(ctx, obj); break;
      case 'skull':    _mapSkull(ctx, obj);    break;
    }
    ctx.restore();
  }
}
