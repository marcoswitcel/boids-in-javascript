
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
 */
export function clearCanvas(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
