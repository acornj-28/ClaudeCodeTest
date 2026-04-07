const menuScreen = {
  time: 0,
  blinkTimer: 0,
  blinkOn: true,

  onEnter() {
    this.time = 0;
    this.blinkTimer = 0;
    this.blinkOn = true;
  },

  update(dt, onStart) {
    this.time += dt;
    this.blinkTimer += dt;
    if (this.blinkTimer >= 0.5) {
      this.blinkTimer = 0;
      this.blinkOn = !this.blinkOn;
    }
    if (input.isDown('Enter', ' ') || input.mouse.clicked) {
      onStart();
    }
  },

  draw(ctx) {
    // Semi-transparent dark bg
    ctx.fillStyle = 'rgba(10, 10, 20, 0.88)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    const cx = CANVAS_W / 2;

    // Title with color pulse
    const hue = 160 + Math.sin(this.time * 1.5) * 20;
    ctx.font = 'bold 56px monospace';
    ctx.textAlign = 'center';

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillText('GUNGEON ZERO', cx + 3, 183);

    // Main title
    ctx.fillStyle = `hsl(${hue}, 80%, 55%)`;
    ctx.fillText('GUNGEON ZERO', cx, 180);

    // Subtitle
    ctx.font = '16px monospace';
    ctx.fillStyle = '#888';
    ctx.fillText('SURVIVE THE WAVES', cx, 220);

    // Blink prompt
    if (this.blinkOn) {
      ctx.font = '14px monospace';
      ctx.fillStyle = '#ecf0f1';
      ctx.fillText('[ ENTER ] OR CLICK TO START', cx, 290);
    }

    // Controls
    ctx.font = '11px monospace';
    ctx.fillStyle = '#666';
    ctx.fillText('WASD / ARROW KEYS — Move', cx, 360);
    ctx.fillText('MOUSE — Aim', cx, 378);
    ctx.fillText('LEFT CLICK — Shoot', cx, 396);

    // Enemy legend
    ctx.font = '11px monospace';
    ctx.fillStyle = '#555';
    ctx.fillText('GRUNT  RUSHER  TANK', cx, 450);

    // Draw tiny enemy previews
    const previewY = 470;
    ctx.fillStyle = COLORS.grunt;
    ctx.fillRect(cx - 90, previewY, 14, 14);
    ctx.fillStyle = COLORS.rusher;
    ctx.save();
    ctx.translate(cx - 10, previewY + 7);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-6, -6, 12, 12);
    ctx.restore();
    ctx.fillStyle = COLORS.tank;
    ctx.fillRect(cx + 72, previewY, 20, 22);

    ctx.textAlign = 'left';
  }
};
