function makeGameContext() {
  return {
    player: new Player(),
    enemies: [],
    bullets: [],
    particles: new ParticleSystem(),
    score: 0,
    level: 1,
    wave: 1,
    waveTransitionTimer: 0,
    waveClearedFlag: false,
  };
}

const stateManager = {
  current: null,
  gc: null,
  ctx: null,

  init(ctx) {
    this.ctx = ctx;
  },

  transition(state) {
    this.current = state;
    switch (state) {
      case States.MENU:
        menuScreen.onEnter();
        break;

      case States.PLAYING:
        // gc should already exist; start the current wave
        spawner.startWave(getLevel(this.gc.level).waves[this.gc.wave - 1], this.gc.level, this.gc.enemies);
        break;

      case States.WAVE_TRANSITION:
        this.gc.waveTransitionTimer = 2.0;
        break;

      case States.LEVEL_COMPLETE:
        levelCompleteScreen.onEnter(this.gc);
        break;

      case States.GAME_OVER:
        gameOverScreen.onEnter();
        break;
    }
  },

  startNewGame() {
    this.gc = makeGameContext();
    this.transition(States.PLAYING);
  },

  update(dt) {
    const gc = this.gc;

    switch (this.current) {
      case States.MENU:
        menuScreen.update(dt, () => this.startNewGame());
        break;

      case States.PLAYING:
        if (!gc) break;

        // Pause
        if (input.keys['Escape']) {
          input.keys['Escape'] = false; // consume so it doesn't re-trigger
          this.transition(States.PAUSED);
          break;
        }

        // Update entities
        gc.player.update(dt, gc.particles);
        gc.player.tryShoot(gc.bullets, gc.particles);

        for (let e of gc.enemies) e.update(dt, gc.player, gc.particles);
        for (let b of gc.bullets) b.update(dt);
        gc.particles.update(dt);

        // Collision
        collision.bulletsVsEnemies(gc.bullets, gc.enemies, gc.particles, (pts) => {
          gc.score += pts;
        });
        collision.enemiesVsPlayer(gc.enemies, gc.player, dt, gc.particles);

        // Cleanup dead entities
        gc.bullets = gc.bullets.filter(b => !b.dead);
        gc.enemies = gc.enemies.filter(e => e.state !== 'dead');

        // Player death
        if (gc.player.dead) {
          this.transition(States.GAME_OVER);
          break;
        }

        // Wave progression
        spawner.update(dt, gc.enemies, () => {
          if (!gc.waveClearedFlag) {
            gc.waveClearedFlag = true;
            const levelDef = getLevel(gc.level);
            if (gc.wave >= levelDef.waves.length) {
              // Level complete
              setTimeout(() => {
                gc.level++;
                gc.wave = 1;
                gc.enemies = [];
                gc.bullets = [];
                gc.waveClearedFlag = false;
                this.transition(States.LEVEL_COMPLETE);
              }, 100);
            } else {
              // Next wave
              gc.wave++;
              gc.enemies = [];
              gc.bullets = [];
              gc.waveClearedFlag = false;
              this.transition(States.WAVE_TRANSITION);
            }
          }
        });
        break;

      case States.PAUSED:
        if (input.keys['Escape']) {
          input.keys['Escape'] = false;
          this.transition(States.PLAYING);
        }
        break;

      case States.WAVE_TRANSITION:
        if (!gc) break;
        gc.waveTransitionTimer -= dt;
        if (gc.waveTransitionTimer <= 0) {
          this.transition(States.PLAYING);
        }
        break;

      case States.LEVEL_COMPLETE:
        levelCompleteScreen.update(dt,
          () => {
            gc.player.reset();
            gc.enemies = [];
            gc.bullets = [];
            gc.particles.clear();
            this.transition(States.PLAYING);
          }
        );
        break;

      case States.GAME_OVER:
        gameOverScreen.update(dt,
          () => this.startNewGame(),
          () => { this.gc = null; this.transition(States.MENU); }
        );
        break;
    }
  },

  draw() {
    const ctx = this.ctx;
    const gc = this.gc;
    const state = this.current;

    renderer.draw(ctx, gc || { player: new Player(), enemies: [], bullets: [], particles: new ParticleSystem(), score: 0, level: 1, wave: 1 }, state);

    // Screen overlays
    switch (state) {
      case States.MENU:
        menuScreen.draw(ctx);
        break;

      case States.PAUSED:
        pausedScreen.draw(ctx);
        break;

      case States.WAVE_TRANSITION:
        if (!gc) break;
        this._drawWaveTransition(ctx, gc);
        break;

      case States.LEVEL_COMPLETE:
        levelCompleteScreen.draw(ctx, gc);
        break;

      case States.GAME_OVER:
        gameOverScreen.draw(ctx, gc);
        break;
    }
  },

  _drawWaveTransition(ctx, gc) {
    const t = clamp(1 - gc.waveTransitionTimer / 2.0, 0, 1);
    const alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;
    ctx.save();
    ctx.globalAlpha = alpha * 0.7;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.globalAlpha = alpha;
    ctx.textAlign = 'center';
    ctx.font = 'bold 48px monospace';
    ctx.fillStyle = '#f1c40f';
    ctx.fillText('WAVE ' + gc.wave, CANVAS_W / 2, CANVAS_H / 2 - 20);
    ctx.font = '18px monospace';
    ctx.fillStyle = '#aaa';
    ctx.fillText('Get ready!', CANVAS_W / 2, CANVAS_H / 2 + 20);
    ctx.textAlign = 'left';
    ctx.restore();
  }
};
