const assert = require("assert");
const { add, subtract, multiply, divide, OPERATIONS, evaluate } = require("../src/calculator.js");

let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log(`  ok - ${name}`);
}

console.log("original operations");

test("add returns the sum", () => assert.strictEqual(add(2, 3), 5));
test("subtract returns a - b", () => assert.strictEqual(subtract(5, 3), 2));
test("multiply returns the product", () => assert.strictEqual(multiply(4, 3), 12));
test("divide returns a / b", () => assert.strictEqual(divide(6, 3), 2));
test("divide by zero raises an error", () =>
  assert.throws(() => divide(1, 0), /cannot divide by zero/));
test("OPERATIONS maps the python operation names", () =>
  assert.deepStrictEqual(Object.keys(OPERATIONS).sort(), ["add", "div", "mul", "sub"]));

console.log("expression evaluator (real arithmetic)");

test("respects operator precedence", () => assert.strictEqual(evaluate("3 + 4 * 5"), 23));
test("parentheses override precedence", () => assert.strictEqual(evaluate("(3 + 4) * 5"), 35));
test("handles decimals", () =>
  assert.strictEqual(Math.round(evaluate("0.1 + 0.2") * 1e12) / 1e12, 0.3));
test("handles unary minus", () => assert.strictEqual(evaluate("-5 + 3"), -2));
test("chained operations left-to-right for same precedence", () =>
  assert.strictEqual(evaluate("10 - 3 - 2"), 5));
test("division by zero throws", () =>
  assert.throws(() => evaluate("1 / 0"), /cannot divide by zero/));
test("nested parentheses", () => assert.strictEqual(evaluate("((2 + 3) * 4) / 2"), 10));
test("exponent-like repeated multiply", () => assert.strictEqual(evaluate("2 * 3 * 4"), 24));
test("percent operator (modulo)", () => assert.strictEqual(evaluate("10 % 3"), 1));
test("rejects unbalanced parentheses", () =>
  assert.throws(() => evaluate("(3 + 4"), /parentheses/));

console.log(`\n${passed} tests passed`);
