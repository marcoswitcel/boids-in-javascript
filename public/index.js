import { applyForce } from './physical-concepts.js';
import { clearCanvas, drawCircle, drawRect } from './rendering.js';
import { setDocumentTitle } from './utils.js';
import { addInPlace, dist, divInPlace, limitInPlace, mag, mulInPlace, normalize, normalizeInPlace, scalarDivInPlace, scalarMul, scalarMulInPlace, setMag, sub } from './vector2-math.js';
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
  lastTimestamp = 0;


  /**
   * @private
   * @param {number} timestamp 
   */
  handleAnimationFrame = (timestamp) => {
    // Pula a primeira execução para sabermos qual é a janela de tempo entre os frames
    // desde a primeira invocação da função contida em `handleTick`
    if (this.lastTimestamp == 0  && this.running) {
      this.lastTimestamp = timestamp;
      this.lastRequestId = requestAnimationFrame(this.handleAnimationFrame);
      return;
    }

    const deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    
    try {
      const handleTick = this.handleTick;
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

  /**
   * @private
   * @type {Vector2}
   */
  static mouseTarget = vec2(0, 0);

  constructor(boids) {
    this.boids = boids;
  }

  /**
   * @param {number} deltaTime
   * @returns {void}
   */
  update(deltaTime) {
    BoidsBehavior.update(this.boids, deltaTime);
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
   * @param {number} deltaTime
   * @returns {void}
   */
  static update(boids, deltaTime) {
    const maxSpeedSpeed = 50; // 50 pixels por segundo

    /**
     * @note https://natureofcode.com/book/chapter-6-autonomous-agents/#611-group-behaviors-or-lets-not-run-into-each-other
     * @todo João, terminar de testar e analisar como isso funciona
     */
    separateBehavior: {
      const desiredSeparation = 100;

      for (const currentBoid of boids) {
        const sum = vec2(0, 0);
        let count = 0;

        for (const otherBoid of boids) {
          const distance =  dist(currentBoid.position, otherBoid.position);
          if (distance > 0 && distance < desiredSeparation) {
            const diff = sub(currentBoid.position, otherBoid.position);
            normalizeInPlace(diff);
            scalarDivInPlace(diff, distance);
            addInPlace(sum, diff);
            count++;
          }
        }

        if (count > 0) {
          scalarDivInPlace(sum, count);
          setMag(sum, maxSpeedSpeed);

          const steer = sub(sum, currentBoid.velocity);
          limitInPlace(steer, maxSpeedSpeed);

          applyForce(currentBoid, steer);
        }
      }
    }

    steerBehavior:
    for (const boid of boids) {
      const desiredVelocity = sub(BoidsBehavior.mouseTarget, boid.position);

      normalizeInPlace(desiredVelocity);
      scalarMulInPlace(desiredVelocity, maxSpeedSpeed);

      const steerForce = sub(desiredVelocity, boid.velocity);

      applyForce(boid, steerForce);
    }
  }

  /**
   * @param {CanvasRenderingContext2D} ctx 
   * @param {Boid[]} boids
   * @returns {void}
   */
  static render(ctx, boids) {
    const size = 10; // @note arbitrário e temporário esse valor
    for (const boid of boids) {
      drawCircle(ctx, boid.position, size, 'blue');
    }

    // Desenhando target
    drawCircle(ctx, BoidsBehavior.mouseTarget, 5, 'red');
  }

  /**
   * @param {number} x 
   * @param {number} y 
   */
  static updateMouseTarget(x, y) {
    this.mouseTarget.x = x;
    this.mouseTarget.y = y;
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
    //console.log('BoidsSimulationApp - Setup');
    
    this.canvas = document.createElement('canvas');
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    document.body.append(this.canvas);

    this.ctx = this.canvas.getContext('2d');

    const boids = Array(20).fill(0).map(() => boid(Math.random() * 300, Math.random() * 300));
    this.boidsBehavior = new BoidsBehavior(boids);

    this.canvas.addEventListener('mousemove', (event) => {
      BoidsBehavior.updateMouseTarget(event.offsetX, event.offsetY);
    })
  }
  
  handleTick = (timestamp, deltaTime) => {
    //console.log(`BoidsSimulationApp - tick\ntimestamp: ${timestamp}, deltaTime: ${deltaTime}`);
    
    // apenas rascunhando estrutura

    // update vai aqui
    update: {
      this.boidsBehavior.update(deltaTime);

      /**
       * Regras de computação do movimento abaixo
       */
      for (const boid of this.boidsBehavior.boids) {
        // @note João, não tenho certeza se só multiplicar a velocidade e aceleração pelos milissegundos decorridos
        // vair ser suficiente para deixar os cálculos flexíveis a janelas de tempo e número de ticks por segundo 
        // variados. Falta testar, a ideia e observar atentamente ao longo do desenvolvimento se algum artefacto 
        // temporal é percebido no sistema de movimento.
        const elapsedMilliseconds = (deltaTime / 1000);
        addInPlace(boid.velocity, scalarMul(boid.acceleration, elapsedMilliseconds));
        addInPlace(boid.position, scalarMul(boid.velocity,     elapsedMilliseconds));
        
        // Aceleração precisa ser resetada sempre
        scalarMulInPlace(boid.acceleration, 0);
      }
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
