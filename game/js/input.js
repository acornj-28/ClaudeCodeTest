const input = {
  keys: {},
  mouse: { x: 400, y: 300, down: false, clicked: false },

  init(canvas) {
    window.addEventListener('keydown', e => {
      input.keys[e.key] = true;
      // prevent arrow keys from scrolling page
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) {
        e.preventDefault();
      }
    });
    window.addEventListener('keyup', e => {
      input.keys[e.key] = false;
    });

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_W / rect.width;
      const scaleY = CANVAS_H / rect.height;
      input.mouse.x = (e.clientX - rect.left) * scaleX;
      input.mouse.y = (e.clientY - rect.top) * scaleY;
    });

    canvas.addEventListener('mousedown', e => {
      if (e.button === 0) {
        input.mouse.down = true;
        input.mouse.clicked = true;
      }
    });

    canvas.addEventListener('mouseup', e => {
      if (e.button === 0) input.mouse.down = false;
    });

    // prevent context menu on right click
    canvas.addEventListener('contextmenu', e => e.preventDefault());
  },

  clearFrameState() {
    input.mouse.clicked = false;
  },

  isDown(...keys) {
    return keys.some(k => input.keys[k]);
  }
};
