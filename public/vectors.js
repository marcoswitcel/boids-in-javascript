
/**
 * Um tipo genérico para vetores de posição velocidade e afins
 * @typedef {{ x: number, y: number, }} Vector2
 */

/**
 * @param {number} x 
 * @param {number} y 
 * @returns {Vector2}
 */
export const vec2 = (x, y) => ({ x, y });
