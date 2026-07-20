/**
 * Calculator operations.
 *
 * Ported from the original Python project (src/calculator/operations.py).
 * Each function mirrors the semantics of the Python implementation, including
 * the divide-by-zero guard in `divide`.
 */

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    const err = new Error("cannot divide by zero");
    err.code = "DIVIDE_BY_ZERO";
    throw err;
  }
  return a / b;
}

const OPERATIONS = {
  add,
  sub: subtract,
  mul: multiply,
  div: divide,
};

module.exports = { add, subtract, multiply, divide, OPERATIONS };
