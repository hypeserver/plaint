export function createTicker(tick_ms, cb) {
  let running = false;
  let lastUpdate = 0;

  function tick() {
    if (!running) {
      return;
    }

    const now = Date.now();
    const delta = now - lastUpdate;

    if (delta <= tick_ms) {
      requestAnimationFrame(tick);
      return;
    }

    cb();

    lastUpdate = now;

    requestAnimationFrame(tick);
  }

  return {
    start: () => {
      running = true;
      tick();
    },

    pause: () => {
      running = false;
    }
  };
}
