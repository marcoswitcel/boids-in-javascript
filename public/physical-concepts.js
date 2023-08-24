import { addInPlace } from './vector2-math.js'
import { vec2 } from './vectors.js';

/**
 * @typedef {import('./vectors').Vector2} Vector2
 */

/**
 * @param {{ acceleration: Vector2 }} receiver 
 * @param {Vector2} force 
 */
export const applyForce = (receiver, force) => {
  addInPlace(receiver.acceleration, force);
}

/**
 * 
 * @param {Vector2} force 
 * @param {number} angle 
 * @returns {Vector2}
 */
export const rotateForce = (force, angle) => {
  const radians = Math.PI / 180 * angle;
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);

  return vec2(cos * force.x + sin * force.y, cos * force.y - sin * force.x);
}
