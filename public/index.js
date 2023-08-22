import { seeking } from './boid.js';
import { applyForce } from './physical-concepts.js';
import { clearCanvas, drawCircle, drawLine, drawRect } from './rendering.js';
import { setDocumentTitle } from './utils.js';
import { add, addInPlace, dist, divInPlace, limitInPlace, mag, mulInPlace, normalize, normalizeInPlace, scalarDivInPlace, scalarMul, scalarMulInPlace, setMag, sub } from './vector2-math.js';
import { vec2 } from './vectors.js';

const CANVAS_WIDTH = 800 * .7;
const CANVAS_HEIGHT = 500 * .7;


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
 * @typedef {{ position: Vector2, velocity: Vector2, acceleration: Vector2, size: number, maxSpeed: number, maxForce: number }} Boid
 */

/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @returns {Boid}
 */
const boid = (x, y) => ({ position: { x, y, }, velocity: { x: 0, y: 0, }, acceleration: { x: 0, y: 0 },
                          size: 10, maxSpeed: 50, maxForce: 10, });

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
   * @param {number} scale
   * @returns {void}
   */
  render(ctx, scale = 1) {
    BoidsBehavior.render(ctx, this.boids, scale);
  }

  /**
   * @param {Boid[]} boids
   * @param {number} deltaTime
   * @returns {void}
   */
  static update(boids, deltaTime) {
    /**
     * @note https://natureofcode.com/book/chapter-6-autonomous-agents/#611-group-behaviors-or-lets-not-run-into-each-other
     * @todo João, terminar de testar e analisar como isso funciona
     * @todo João, considerar definir a separção em termos de tamanho, tipo, uma vez e meia do tamanho
     */
    const desiredSeparationFactor = 5;
    BoidsBehavior.separate(boids, desiredSeparationFactor);
    const desiredNeightbordistFactor = 5;
    BoidsBehavior.align(boids, desiredNeightbordistFactor);
    BoidsBehavior.cohesion(boids, desiredNeightbordistFactor);

    BoidsBehavior.seek(boids, BoidsBehavior.mouseTarget);
  }

  /**
   * @todo João, maxSpeed deveria ser uma coisa do boid não do manager? acho que seria mais interessante
   * 
   * @param {Boid[]} boids 
   * @param {number} desiredSeparationFactor 
   */
  static separate(boids, desiredSeparationFactor) {
    for (const currentBoid of boids) {
      const desiredSeparation = desiredSeparationFactor *  currentBoid.size;
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
        setMag(sum, currentBoid.maxSpeed);

        const steer = sub(sum, currentBoid.velocity);
        limitInPlace(steer, currentBoid.maxForce);

        applyForce(currentBoid, steer);
      }
    }
  }

  /**
   * 
   * @param {Boid[]} boids 
   * @param {number} desiredNeightbordistFactor 
   */
  static align(boids, desiredNeightbordistFactor) {
    for (const currentBoid of boids) {
      const desiredNeightbordist = desiredNeightbordistFactor * currentBoid.size;
      const sum = vec2(0, 0);
      let count = 0;

      for (const otherBoid of boids) {
        const distance =  dist(currentBoid.position, otherBoid.position);
        if (distance > 0 && distance < desiredNeightbordist) {
          addInPlace(sum, otherBoid.velocity);
          count++;
        }
      }

      if (count > 0) {
        scalarDivInPlace(sum, count);
        normalizeInPlace(sum);
        scalarMulInPlace(sum, currentBoid.maxSpeed);

        const steer = sub(sum, currentBoid.velocity);
        limitInPlace(steer, currentBoid.maxForce);

        applyForce(currentBoid, steer);
      }
    }
  }

  /**
   * 
   * @param {Boid[]} boids 
   * @param {number} desiredNeightbordistFactor 
   */
  static cohesion(boids, desiredNeightbordistFactor) {
    for (const currentBoid of boids) {
      const desiredNeightbordist = desiredNeightbordistFactor * currentBoid.size;
      const sum = vec2(0, 0);
      let count = 0;

      for (const otherBoid of boids) {
        const distance =  dist(currentBoid.position, otherBoid.position);
        if (distance > 0 && distance < desiredNeightbordist) {
          addInPlace(sum, otherBoid.position);
          count++;
        }
      }

      if (count > 0) {
        scalarDivInPlace(sum, count);

        /**
         * @todo João, por causa da forma como implementei o resultado não está de acordo com os exemplos
         * @reference https://natureofcode.com/book/chapter-6-autonomous-agents/#613-flocking
         */
        seeking(currentBoid, sum);
      }
    }
  }

  /**
   * @param {Boid[]} boids 
   * @param {Vector2} target 
   * @returns {void}
   */
  static seek(boids, target) {
    for (const boid of boids) {
      const desiredVelocity = sub(target, boid.position);

      normalizeInPlace(desiredVelocity);
      scalarMulInPlace(desiredVelocity, boid.maxSpeed);

      const steerForce = sub(desiredVelocity, boid.velocity);
      limitInPlace(steerForce, boid.maxForce);

      applyForce(boid, steerForce);
    }
  }

  /**
   * @todo João, pra fazer zoom de uma forma legal, acho que o melhor seria inserir
   * um objeto câmera e renderizar do ponto de vista dessa câmera.
   * @todo João, termina de implementar suporte a zoom e definir quando pode ser ativado
   * 
   * @param {CanvasRenderingContext2D} ctx 
   * @param {Boid[]} boids
   * @param {number} scale
   * @returns {void}
   */
  static render(ctx, boids, scale = 1) {
    for (const boid of boids) {
      // @note João, boid.size é o número da largura esperada da figura, então no caso de uma esfera seria o diâmetro
      const radius = boid.size / 2;
      const position = scalarMul(boid.position, scale);
      drawCircle(ctx, position, radius * scale, 'blue');
      drawLine(ctx, position, add(position, setMag(normalize(boid.velocity), boid.size * scale)), 'blue', scale)
    }

    // Desenhando target
    drawCircle(ctx, scalarMul(BoidsBehavior.mouseTarget, scale), 5 * scale, 'red');
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
   * @type {HTMLCanvasElement}
   */
  zoomCanvas;

  /**
   * @private
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * @private
   * @type {CanvasRenderingContext2D}
   */
  ctxZoom;

  /**
   * @type {BoidsBehavior}
   */
  boidsBehavior;

  setup() {
    setDocumentTitle("Boids");
    //console.log('BoidsSimulationApp - Setup');
    
    this.canvas = document.createElement('canvas');
    this.zoomCanvas = document.createElement('canvas');
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.zoomCanvas.width = CANVAS_WIDTH;
    this.zoomCanvas.height = CANVAS_HEIGHT;

    document.body.append(this.canvas);
    document.body.append(this.zoomCanvas);

    this.ctx = this.canvas.getContext('2d');
    this.ctxZoom = this.zoomCanvas.getContext('2d');

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
       * Regras de computação do movimento abaixo (cinemática / física)
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
      drawRect(this.ctxZoom, vec2(0, 0), this.zoomCanvas.width, this.zoomCanvas.height, '#333');
      
      this.boidsBehavior.render(this.ctx);
      this.boidsBehavior.render(this.ctxZoom, 2);
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
