import { clearCanvas, drawRect } from './rendering.js';
import { setDocumentTitle } from './utils.js';
import { addInPlace, mag, normalize, normalizeInPlace, scalarMulInPlace, sub } from './vector2-math.js';
import { vec2 } from './vectors.js';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;


/**
 * @typedef {import('./vectors.js').Vector2} Vector2
 */

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

/**
 * @typedef {{ position: Vector2, velocity: Vector2, acceleration: Vector2, }} Boid
 */

/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @returns {Boid}
 */
const boid = (x, y) => ({ position: { x, y, }, velocity: { x: 0, y: 0, }, acceleration: { x: 0, y: 0 }, });

class BoidsBehavior {

  /**
   * @type {Boid[]}
   */
  boids;

  constructor(boids) {
    this.boids = boids;
  }

  /**
  * @returns {void}
   */
  update() {
    BoidsBehavior.update(this.boids);
  }

  /**
   * @param {CanvasRenderingContext2D} ctx 
   * @returns {void}
   */
  render(ctx) {
    BoidsBehavior.render(ctx, this.boids);
  }

  /**
   * @param {Boid[]} boids
   * @returns {void}
   */
  static update(boids) {
    // @todo João, implementando um target temporário
    const target = vec2(300, 300);
    
    for (const boid of boids) {
      const distance = sub(target, boid.position);
      const desiredVelocity = mag(distance) / 10;
      normalizeInPlace(distance);
      scalarMulInPlace(distance, desiredVelocity);

      addInPlace(boid.position, distance);
    }
  }

  /**
   * @param {CanvasRenderingContext2D} ctx 
   * @param {Boid[]} boids
   * @returns {void}
   */
  static render(ctx, boids) {
    for (const boid of boids) {
      const size = 20; // @note arbitrário e temporário esse valor
      drawRect(ctx, boid.position, size, size, 'blue');
    }
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

  /**
   * @type {BoidsBehavior}
   */
  boidsBehavior;

  setup() {
    setDocumentTitle("Boids");
    console.log('BoidsSimulationApp - Setup');
    
    this.canvas = document.createElement('canvas');
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    document.body.append(this.canvas);

    this.ctx = this.canvas.getContext('2d');

    this.boidsBehavior = new BoidsBehavior( [ boid(100, 150) ])
  }
  
  handleTick = (timestamp, deltaTime) => {
    console.log(`BoidsSimulationApp - tickt\nimestamp: ${timestamp}, deltaTime: ${deltaTime}`);
    
    // apenas rascunhando estrutura

    // update vai aqui
    update: {
      this.boidsBehavior.update();
    }

    // renderização aqui
    render: {
      drawRect(this.ctx, vec2(0, 0), this.canvas.width, this.canvas.height, 'white');
      
      this.boidsBehavior.render(this.ctx);
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
