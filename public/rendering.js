
/**
 * @typedef {import("./vectors").Vector2} Vector2
 */

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Vector2} start 
 * @param {number} width 
 * @param {number} height 
 * @param {string} color deveria conter um especificador válido de cor
 */
export function drawRect(ctx, start, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(start.x, start.y, width, height);
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Vector2} position centro do círculo
 * @param {number} radius
 * @param {string} color 
 */
export function drawCircle(ctx, position, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
  ctx.fill();
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 */
export function clearCanvas(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Vector2} pStart 
 * @param {Vector2} pEnd 
 * @param {string} color 
 * @param {number} lineWidth
 * 
 * @returns {void}
 */
export function drawLine(ctx, pStart, pEnd, color, lineWidth = 1) {
  ctx.strokeStyle = color;

  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(pStart.x, pStart.y);
  ctx.lineTo(pEnd.x, pEnd.y);
  ctx.closePath();
  
  ctx.stroke();
}
