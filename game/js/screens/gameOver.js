const gameOverScreen = {
  timer: 0,
  shakeX: 0,
  shakeY: 0,
  blinkTimer: 0,
  blinkOn: true,

  onEnter() {
    this.timer = 0;
    this.blinkTimer = 0;
    this.blinkOn = true;
  },

  update(dt, onRestart, onMenu) {
    this.timer += dt;
    this.shakeX = (Math.random() - 0.5) * (4 / (1 + this.timer));
    this.shakeY = (Math.random() - 0.5) * (4 / (1 + this.timer));
    this.blinkTimer += dt;
    if (this.blinkTimer >= 0.5) {
      this.blinkTimer = 0;
      this.blinkOn = !this.blinkOn;
    }
    if (this.timer > 0.5) {
      if (input.isDown('r', 'R')) onRestart();
      if (input.isDown('m', 'M')) onMenu();
    }
  },

  draw(ctx, gc) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    const cx = CANVAS_W / 2 + this.shakeX;
    const cy = CANVAS_H / 2 + this.shakeY;

    ctx.textAlign = 'center';

    // Title
    ctx.font = 'bold 52px monospace';
    ctx.fillStyle = '#111';
    ctx.fillText('GAME OVER', cx + 3, cy - 85);
    ctx.fillStyle = '#e74c3c';
    ctx.fillText('GAME OVER', cx, cy - 88);

    // Stats
    ctx.font = '18px monospace';
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText('SCORE: ' + String(gc.score).padStart(6, '0'), cx, cy - 30);

    ctx.font = '14px monospace';
    ctx.fillStyle = '#aaa';
    ctx.fillText('Reached Level ' + gc.level + ', Wave ' + gc.wave, cx, cy + 0);

    // Controls
    if (this.blinkOn) {
      ctx.font = '13px monospace';
      ctx.fillStyle = '#ecf0f1';
      ctx.fillText('[R] RESTART', cx - 60, cy + 55);
      ctx.fillText('[M] MENU', cx + 60, cy + 55);
    }

    ctx.textAlign = 'left';
  }
};
