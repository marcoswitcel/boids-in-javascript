
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

const canvas = document.createElement('canvas');

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

document.body.append(canvas);

const ctx = canvas.getContext('2d');

ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);


class AnimationFrameLoop {
  running = false;
  handle = null;
  lastRequestId = 0;


  /**
   * @private
   * @param {number} timestamp 
   */
  handleAnimationFrame = (timestamp) => {

    const handle = this.handle;
    // @todo calcular deltatime quando necessário
    const deltaTime = 0;

    try {
      if (typeof handle == 'function') handle(timestamp, deltaTime);
    } catch(error) {
      console.error(error)
    }

    if (this.running) {
      this.lastRequestId = requestAnimationFrame(this.handleAnimationFrame);
    }
  };

  start = () => {
    if (!this.running) {
      this.running = true;
      this.lastRequestId = requestAnimationFrame(this.handleAnimationFrame);
    }
  }
}

function handleFrame(timestamp, deltaTime) {
  console.log(`timestamp: ${timestamp}, deltaTime: ${deltaTime}`);
}

const loop = new AnimationFrameLoop();
loop.handle = handleFrame;
loop.start();
