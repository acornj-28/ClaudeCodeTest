const CANVAS_W = 800;
const CANVAS_H = 600;

const PLAYER_SPEED = 180;
const PLAYER_MAX_HP = 100;
const PLAYER_RADIUS = 10;
const PLAYER_FIRE_RATE = 0.18;
const PLAYER_INVINCIBLE_DURATION = 0.8;

const BULLET_SPEED = 620;
const BULLET_DAMAGE = 25;
const BULLET_LIFETIME = 1.2;
const BULLET_RADIUS = 3;

const COLORS = {
  bg: '#1a1a2e',
  grid: '#1e2040',

  player: '#2ecc71',
  playerDark: '#27ae60',
  playerHead: '#f0d0a0',
  playerLegs: '#8B7355',
  playerGun: '#7f8c8d',
  playerGunBarrel: '#95a5a6',

  grunt: '#c0392b',
  gruntDark: '#8B0000',
  gruntEye: '#ffffff',

  rusher: '#e74c3c',
  rusherBright: '#ff5252',
  rusherTrail: 'rgba(255,82,82,',

  tank: '#2c3e50',
  tankDark: '#1a252f',
  tankBolt: '#34495e',
  tankHealthBg: '#555',
  tankHealthFill: '#e74c3c',

  bullet: '#f39c12',
  bulletGlow: '#ffd700',

  particleMuzzle: '#f1c40f',
  particleHit: '#bdc3c7',
  particleDeath: '#e74c3c',
  particlePlayerHit: '#ff0000',

  hudHealth: '#e74c3c',
  hudHealthBg: '#444',
  hudScore: '#f1c40f',
  hudText: '#ecf0f1',
  hudBorder: '#555',

  white: '#ffffff',
  black: '#000000',
  red: '#e74c3c',
  green: '#2ecc71',
  yellow: '#f1c40f',
  gray: '#95a5a6',
  darkGray: '#333',
};

const LEVELS = [
  {
    waves: [
      { grunts: 5, rushers: 0, tanks: 0, spawnInterval: 1.5 },
      { grunts: 8, rushers: 2, tanks: 0, spawnInterval: 1.2 },
      { grunts: 6, rushers: 3, tanks: 1, spawnInterval: 1.0 },
    ]
  },
  {
    waves: [
      { grunts: 8, rushers: 3, tanks: 1, spawnInterval: 1.0 },
      { grunts: 10, rushers: 4, tanks: 1, spawnInterval: 0.9 },
      { grunts: 8, rushers: 5, tanks: 2, spawnInterval: 0.8 },
    ]
  },
  {
    waves: [
      { grunts: 10, rushers: 5, tanks: 2, spawnInterval: 0.8 },
      { grunts: 12, rushers: 6, tanks: 2, spawnInterval: 0.7 },
      { grunts: 10, rushers: 8, tanks: 3, spawnInterval: 0.6 },
    ]
  },
];

function generateLevel(n) {
  const waveCount = 3 + Math.floor(n / 3);
  const waves = [];
  for (let w = 0; w < waveCount; w++) {
    waves.push({
      grunts:  Math.round(5 + n * 3 + w * 2),
      rushers: Math.round(Math.max(0, (n - 1)) * 2 + w),
      tanks:   Math.round(Math.max(0, (n - 2)) + Math.floor(w / 2)),
      spawnInterval: Math.max(0.5, 1.5 - n * 0.08 - w * 0.03),
    });
  }
  return { waves };
}

function getLevel(n) {
  if (n <= LEVELS.length) return LEVELS[n - 1];
  return generateLevel(n);
}

const States = {
  MENU: 'menu',
  PLAYING: 'playing',
  WAVE_TRANSITION: 'wave_transition',
  LEVEL_COMPLETE: 'level_complete',
  GAME_OVER: 'game_over',
};
