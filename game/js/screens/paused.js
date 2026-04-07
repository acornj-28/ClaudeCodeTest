const pausedScreen = {
  draw(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.textAlign = 'center';

    ctx.font = 'bold 48px monospace';
    ctx.fillStyle = '#000';
    ctx.fillText('PAUSED', CANVAS_W / 2 + 2, CANVAS_H / 2 - 18);
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText('PAUSED', CANVAS_W / 2, CANVAS_H / 2 - 20);

    ctx.font = '14px monospace';
    ctx.fillStyle = '#888';
    ctx.fillText('[ ESC ] Resume', CANVAS_W / 2, CANVAS_H / 2 + 24);

    ctx.textAlign = 'left';
  }
};
