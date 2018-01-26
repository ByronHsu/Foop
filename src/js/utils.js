/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function rnGen(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function rnGenInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export { rnGen, rnGenInt };
