window.addEventListener('load', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  input.init(canvas);
  stateManager.init(ctx);
  stateManager.transition(States.MENU);

  let lastTime = 0;

  function gameLoop(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;

    stateManager.update(dt);
    stateManager.draw();
    input.clearFrameState();

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
});
