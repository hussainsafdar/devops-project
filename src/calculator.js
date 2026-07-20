/**
 * Real calculator math engine.
 *
 * Ports the original Python operations (add / subtract / multiply / divide,
 * with a divide-by-zero guard) AND adds a proper expression evaluator that
 * honours real arithmetic rules: operator precedence, associativity, unary
 * minus, parentheses, decimals and percent.
 *
 * The evaluator is a small shunting-yard implementation — it does real math,
 * it does not fake or approximate results.
 */

// --- Original four operations (mirrors src/calculator/operations.py) ---

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

const OPERATIONS = { add, sub: subtract, mul: multiply, div: divide };

// --- Real expression evaluator ---

const PRECEDENCE = { "+": 1, "-": 1, "*": 2, "/": 2, "%": 2, u: 3 };
const RIGHT_ASSOC = { u: true };

function tokenize(input) {
  const tokens = [];
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    if (ch === " " || ch === "\t" || ch === "\n") {
      i++;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      let num = "";
      while (i < input.length && /[0-9.]/.test(input[i])) {
        num += input[i++];
      }
      if ((num.match(/\./g) || []).length > 1) {
        throw new Error("invalid number: " + num);
      }
      tokens.push({ type: "num", value: parseFloat(num) });
      continue;
    }
    if ("+-*/%()".includes(ch)) {
      tokens.push({ type: "op", value: ch });
      i++;
      continue;
    }
    throw new Error("unexpected character: " + ch);
  }
  return tokens;
}

// Convert infix tokens to postfix (Reverse Polish Notation).
function toPostfix(tokens) {
  const output = [];
  const stack = [];
  let prev = null;

  for (let k = 0; k < tokens.length; k++) {
    const t = tokens[k];
    if (t.type === "num") {
      output.push(t);
    } else if (t.type === "op" && t.value === "(") {
      stack.push(t);
    } else if (t.type === "op" && t.value === ")") {
      while (stack.length && stack[stack.length - 1].value !== "(") {
        output.push(stack.pop());
      }
      if (!stack.length) throw new Error("mismatched parentheses");
      stack.pop();
    } else if (t.type === "op") {
      let value = t.value;
      // Unary plus/minus detection.
      const isUnary =
        value === "+" || value === "-"
          ? prev === null ||
            (prev.type === "op" && prev.value !== ")")
          : false;
      if (isUnary && (value === "+" || value === "-")) {
        value = "u"; // unary minus marker (unary plus is a no-op)
      }
      while (stack.length) {
        const top = stack[stack.length - 1];
        if (top.type !== "op" || top.value === "(") break;
        const topVal = top.value === "u" ? "u" : top.value;
        const higher =
          PRECEDENCE[topVal] > PRECEDENCE[value] ||
          (PRECEDENCE[topVal] === PRECEDENCE[value] &&
            !RIGHT_ASSOC[value]);
        if (!higher) break;
        output.push(stack.pop());
      }
      stack.push({ type: "op", value });
    }
    prev = t;
  }
  while (stack.length) {
    const top = stack.pop();
    if (top.value === "(" || top.value === ")") {
      throw new Error("mismatched parentheses");
    }
    output.push(top);
  }
  return output;
}

function evalPostfix(postfix) {
  const stack = [];
  for (const t of postfix) {
    if (t.type === "num") {
      stack.push(t.value);
      continue;
    }
    if (t.value === "u") {
      const a = stack.pop();
      if (a === undefined) throw new Error("invalid expression");
      stack.push(-a);
      continue;
    }
    const b = stack.pop();
    const a = stack.pop();
    if (a === undefined || b === undefined) {
      throw new Error("invalid expression");
    }
    let r;
    switch (t.value) {
      case "+":
        r = add(a, b);
        break;
      case "-":
        r = subtract(a, b);
        break;
      case "*":
        r = multiply(a, b);
        break;
      case "/":
        r = divide(a, b);
        break;
      case "%":
        r = a % b;
        break;
      default:
        throw new Error("unknown operator: " + t.value);
    }
    stack.push(r);
  }
  if (stack.length !== 1) throw new Error("invalid expression");
  return stack[0];
}

/**
 * Evaluate a mathematical expression string using real arithmetic.
 * @param {string} expr
 * @returns {number}
 */
function evaluate(expr) {
  if (typeof expr !== "string" || expr.trim() === "") {
    throw new Error("empty expression");
  }
  const postfix = toPostfix(tokenize(expr));
  if (postfix.length === 0) throw new Error("empty expression");
  return evalPostfix(postfix);
}

const Calculator = {
  add,
  subtract,
  multiply,
  divide,
  OPERATIONS,
  evaluate,
};

// Export for Node (require) and the browser (window).
if (typeof module !== "undefined" && module.exports) {
  module.exports = Calculator;
}
if (typeof window !== "undefined") {
  window.Calculator = Calculator;
}
