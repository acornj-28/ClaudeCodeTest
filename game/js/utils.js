function distance(ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  return Math.sqrt(dx * dx + dy * dy);
}

function angleToward(fx, fy, tx, ty) {
  return Math.atan2(ty - fy, tx - fx);
}

function normalize(vx, vy) {
  const len = Math.sqrt(vx * vx + vy * vy);
  if (len === 0) return { x: 0, y: 0 };
  return { x: vx / len, y: vy / len };
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function randomInt(min, max) {
  return Math.floor(randomRange(min, max + 1));
}

function randomEdgePoint(margin) {
  margin = margin || 32;
  const edge = randomInt(0, 3);
  switch (edge) {
    case 0: return { x: randomRange(0, CANVAS_W), y: -margin };
    case 1: return { x: CANVAS_W + margin, y: randomRange(0, CANVAS_H) };
    case 2: return { x: randomRange(0, CANVAS_W), y: CANVAS_H + margin };
    case 3: return { x: -margin, y: randomRange(0, CANVAS_H) };
  }
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function r(n) { return Math.round(n); }
