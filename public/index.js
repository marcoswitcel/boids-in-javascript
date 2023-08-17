import { clearCanvas, drawRect } from './rendering.js';
import { setDocumentTitle } from './utils.js';
import { vec2 } from './vectors.js';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;




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

  /**
   * @private
   * @type {HTMLCanvasElement}
   */
  canvas;

  /**
   * @private
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  setup() {
    setDocumentTitle("Boids");
    console.log('BoidsSimulationApp - Setup');
    
    this.canvas = document.createElement('canvas');
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    document.body.append(this.canvas);

    this.ctx = this.canvas.getContext('2d');
  }
  
  handleTick = (timestamp, deltaTime) => {
    console.log(`BoidsSimulationApp - tickt\nimestamp: ${timestamp}, deltaTime: ${deltaTime}`);
    
    // apenas rascunhando estrutura

    // update vai aqui
    update: {}

    // renderização aqui
    render: {
      drawRect(this.ctx, vec2(0, 0), this.canvas.width, this.canvas.height, 'blue');
      //clearCanvas(this.ctx);
    }
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
