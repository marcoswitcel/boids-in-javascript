import { applyForce } from './physical-concepts.js';
import { limitInPlace, normalizeInPlace, scalarMulInPlace, sub } from './vector2-math.js';

/**
 * @param {import('./index.js').Boid} boid 
 * @param {import('./vectors.js').Vector2} target 
 */
export const seeking = (boid, target) => {
  const desiredVelocity = sub(target, boid.position);

  normalizeInPlace(desiredVelocity);
  scalarMulInPlace(desiredVelocity, boid.maxSpeed);

  const steerForce = sub(desiredVelocity, boid.velocity);
  limitInPlace(steerForce, boid.maxForce);

  applyForce(boid, steerForce);
}
