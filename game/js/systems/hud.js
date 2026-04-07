const hud = {
  draw(ctx, gc) {
    const pad = 12;

    // ── Health bar ───────────────────────────────────────────────────────────
    const barW = 120, barH = 12;
    const hpRatio = clamp(gc.player.hp / gc.player.maxHp, 0, 1);

    ctx.fillStyle = COLORS.hudHealthBg;
    ctx.fillRect(pad, pad, barW, barH);
    // color shifts red → orange → green
    ctx.fillStyle = hpRatio > 0.6 ? '#2ecc71' : hpRatio > 0.3 ? '#f39c12' : COLORS.hudHealth;
    ctx.fillRect(pad, pad, Math.round(barW * hpRatio), barH);
    ctx.strokeStyle = COLORS.hudBorder;
    ctx.lineWidth = 1;
    ctx.strokeRect(pad, pad, barW, barH);

    ctx.font = '10px monospace';
    ctx.fillStyle = COLORS.hudText;
    ctx.fillText('HP', pad + 2, pad + barH - 2);
    ctx.fillText(Math.ceil(gc.player.hp) + '/' + gc.player.maxHp, pad + barW + 5, pad + barH - 1);

    // ── Score (top right) ────────────────────────────────────────────────────
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = COLORS.hudScore;
    ctx.textAlign = 'right';
    ctx.fillText('SCORE: ' + String(gc.score).padStart(6, '0'), CANVAS_W - pad, pad + 12);
    ctx.textAlign = 'left';

    // ── Level / Wave (top center) ─────────────────────────────────────────────
    const levelDef = getLevel(gc.level);
    const totalWaves = levelDef.waves.length;
    ctx.font = '12px monospace';
    ctx.fillStyle = COLORS.hudText;
    ctx.textAlign = 'center';
    ctx.fillText(
      'LEVEL ' + gc.level + '   WAVE ' + gc.wave + '/' + totalWaves,
      CANVAS_W / 2, pad + 12
    );
    ctx.textAlign = 'left';
  }
};
