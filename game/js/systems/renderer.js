const renderer = {
  draw(ctx, gc, state) {
    ctx.imageSmoothingEnabled = false;

    // 1. Background
    drawBackground(ctx, gc.map || null);

    const showGame = state === States.PLAYING || state === States.WAVE_TRANSITION || state === States.PAUSED;
    if (showGame) {
      // 2. Particles (behind entities)
      gc.particles.draw(ctx);

      // 3. Bullets
      for (let b of gc.bullets) b.draw(ctx);

      // 4. Enemies
      for (let e of gc.enemies) drawEnemy(ctx, e);

      // 5. Player
      drawPlayer(ctx, gc.player);

      // 6. HUD
      hud.draw(ctx, gc);
    }

    // 7. Crosshair (only when actively playing)
    if (state === States.PLAYING || state === States.WAVE_TRANSITION) {
      drawCrosshair(ctx, input.mouse.x, input.mouse.y);
    }
  }
};
