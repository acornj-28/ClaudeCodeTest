const spawner = {
  waveIndex: 0,
  enemyQueue: [],
  spawnTimer: 0,
  spawnInterval: 1.0,
  allSpawned: false,
  levelNum: 1,
  waveDef: null,

  startWave(waveData, levelNum, enemies) {
    this.levelNum = levelNum;
    this.waveDef = waveData;
    this.spawnInterval = waveData.spawnInterval;
    this.spawnTimer = 0;
    this.allSpawned = false;

    // Build shuffled queue
    const queue = [];
    for (let i = 0; i < waveData.grunts;  i++) queue.push('grunt');
    for (let i = 0; i < waveData.rushers; i++) queue.push('rusher');
    for (let i = 0; i < waveData.tanks;   i++) queue.push('tank');
    this.enemyQueue = shuffleArray(queue);

    // Initialize all Rusher charge angles toward center
    // (will be set properly on first update)
  },

  update(dt, enemies, onWaveCleared) {
    if (!this.allSpawned) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnTimer = this.spawnInterval;
        if (this.enemyQueue.length > 0) {
          const type = this.enemyQueue.shift();
          const pos = randomEdgePoint(40);
          const enemy = createEnemy(type, pos.x, pos.y, this.levelNum);
          // Set initial rusher charge angle toward center
          if (enemy.type === 'rusher') {
            enemy.chargeAngle = angleToward(pos.x, pos.y, CANVAS_W / 2, CANVAS_H / 2);
          }
          enemies.push(enemy);
        } else {
          this.allSpawned = true;
        }
      }
    } else {
      // All spawned — wait for all enemies to die
      const alive = enemies.filter(e => e.state !== 'dead');
      if (alive.length === 0) {
        onWaveCleared();
      }
    }
  },
};
