const levelCompleteScreen = {
  timer: 0,
  blinkTimer: 0,
  blinkOn: true,
  waveBonus: 0,

  onEnter(gc) {
    this.timer = 0;
    this.blinkTimer = 0;
    this.blinkOn = true;
    this.waveBonus = gc.level * 100;
    gc.score += this.waveBonus;
  },

  update(dt, onNext) {
    this.timer += dt;
    this.blinkTimer += dt;
    if (this.blinkTimer >= 0.5) {
      this.blinkTimer = 0;
      this.blinkOn = !this.blinkOn;
    }
    if (this.timer > 0.5 && (input.isDown('Enter', ' ') || input.mouse.clicked)) {
      onNext();
    }
  },

  draw(ctx, gc) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    const cx = CANVAS_W / 2;

    ctx.textAlign = 'center';
    ctx.font = 'bold 42px monospace';
    ctx.fillStyle = '#2ecc71';
    ctx.fillText('LEVEL COMPLETE!', cx, 200);

    ctx.font = '20px monospace';
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText('Level ' + gc.level + ' cleared!', cx, 255);

    ctx.font = '16px monospace';
    ctx.fillStyle = COLORS.hudScore;
    ctx.fillText('WAVE BONUS: +' + this.waveBonus, cx, 305);

    ctx.fillStyle = '#ecf0f1';
    ctx.fillText('SCORE: ' + String(gc.score).padStart(6, '0'), cx, 335);

    if (this.blinkOn) {
      ctx.font = '14px monospace';
      ctx.fillStyle = '#aaa';
      ctx.fillText('[ ENTER ] NEXT LEVEL', cx, 390);
    }

    ctx.textAlign = 'left';
  }
};
