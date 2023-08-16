import { setDocumentTitle } from './utils.js';

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
  lastRequestId = 0;
  handleTick = null;
  handleClose = null;


  /**
   * @private
   * @param {number} timestamp 
   */
  handleAnimationFrame = (timestamp) => {

    const handleTick = this.handleTick;
    // @todo calcular deltatime quando necessário
    const deltaTime = 0;

    try {
      if (typeof handleTick == 'function') handleTick(timestamp, deltaTime);
    } catch(error) {
      console.error(error)
    }

    if (this.running) {
      this.lastRequestId = requestAnimationFrame(this.handleAnimationFrame);
    } else {
      try {
        this.lastRequestId = 0;
        const handleClose = this.handleClose;
        if (typeof handleClose == 'function') handleClose(timestamp, deltaTime);
      } catch(error) {
        console.error(error)
      }
    }
  };

  callClose() {

  };

  start = () => {
    if (!this.running) {
      this.running = true;
      this.lastRequestId = requestAnimationFrame(this.handleAnimationFrame);
    }
  }

  stop = () => {
    this.running = false;
  }
}

class BoidsSimulationApp {

  setup() {
    console.log('BoidsSimulationApp - Setup');
    setDocumentTitle("Boids");
  }

  handleTick = (timestamp, deltaTime) => {
    console.log(`BoidsSimulationApp - tickt\nimestamp: ${timestamp}, deltaTime: ${deltaTime}`);
  }

  // @todo João, ainda não sendo chamado esse método, pensar na forma mais clara de fazer o vínculo
  shutdown() {
    console.log('BoidsSimulationApp - shutdown');
  }
}

const main = () => {
  const app = new BoidsSimulationApp();
  const loop = new AnimationFrameLoop();
  loop.handleTick = app.handleTick;
  loop.handleClose = app.shutdown;

  app.setup();
  loop.start();

  // @note Apenas para testar o handleClose
  // setTimeout(loop.stop, 1000);
}

main();
