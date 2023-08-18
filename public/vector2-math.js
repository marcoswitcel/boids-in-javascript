
/**
 * @typedef {import("./vectors").Vector2} Vector2
 */

/**
 * @reference https://natureofcode.com/book/chapter-1-vectors/#13-vector-addition
 * 
 * @param {Vector2} a 
 * @param {Vector2} b 
 * @returns {Vector2}
 */
export const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y, });

/**
 * @param {Vector2} a vetor que terá o seu valor incrementado
 * @param {Vector2} b valor a ser adicionado ao outro vetor
 * @returns {Vector2}
 */
export const addInPlace = (a, b) => {
  a.x += b.x;
  a.y += b.y;
  return a;
};

/**
 * @reference https://natureofcode.com/book/chapter-1-vectors/#vector-subtraction
 * 
 * @param {Vector2} a 
 * @param {Vector2} b 
 * @returns {Vector2}
 */
export const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, });

/**
 * @param {Vector2} a vetor que terá o seu valor incrementado
 * @param {Vector2} b valor a ser adicionado ao outro vetor
 * @returns {Vector2}
 */
export const subInPlace = (a, b) => {
  a.x -= b.x;
  a.y -= b.y;
  return a;
};
