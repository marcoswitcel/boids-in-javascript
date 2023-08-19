import { addInPlace } from './vector2-math.js'

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
