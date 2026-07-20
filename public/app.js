// Browser UI logic. Uses the SAME real math engine (src/calculator.js)
// that the Node tests run against, so results are genuinely computed.

const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");
const statusEl = document.getElementById("status");

let expr = "";
let justEvaluated = false;
let errored = false;

const SYMBOLS = { "+": "+", "-": "−", "*": "×", "/": "÷", "%": "%" };

function setStatus(msg) {
  statusEl.textContent = msg;
}

function displayExpr() {
  return expr
    .replace(/\*/g, "×")
    .replace(/\//g, "÷")
    .replace(/-/g, "−");
}

function render() {
  expressionEl.textContent = displayExpr();
  resultEl.textContent = expr === "" ? "0" : expr.replace(/\*/g, "×").replace(/\//g, "÷").replace(/-/g, "−");
}

// Live evaluation of whatever expression is currently typed.
function liveResult() {
  if (expr === "" || errored) return null;
  try {
    const r = window.Calculator.evaluate(expr);
    if (!isFinite(r)) return null;
    return r;
  } catch {
    return null;
  }
}

function refreshDisplay() {
  if (errored) return;
  const r = liveResult();
  expressionEl.textContent = displayExpr();
  if (r !== null && expr !== "") {
    expressionEl.textContent = displayExpr() + " =";
    resultEl.textContent = formatNumber(r);
    resultEl.classList.remove("error");
  } else {
    resultEl.textContent = expr === "" ? "0" : displayExpr();
    resultEl.classList.remove("error");
  }
}

function formatNumber(n) {
  if (n === null || n === undefined) return "";
  if (Number.isInteger(n)) return String(n);
  const rounded = Math.round((n + Number.EPSILON) * 1e12) / 1e12;
  return String(rounded);
}

function inputToken(token) {
  if (errored) clearAll();
  if (justEvaluated && /[0-9.(]/.test(token)) {
    // Starting a fresh number after '=' begins a new expression.
    expr = "";
    justEvaluated = false;
  }
  if (justEvaluated && /[+\-*/%]/.test(token)) {
    justEvaluated = false;
  }

  // Prevent two operators in a row (except unary minus after an operator).
  const last = expr.slice(-1);
  if (/[+\-*/%]/.test(token) && /[+\-*/%(]/.test(last) && !(token === "-" && /[+\-*/%(]/.test(last))) {
    return;
  }
  if (token === "." && /[0-9.]+\.?$/.test(expr.slice(-1)) === false) {
    // ensure a digit precedes or starts number
  }
  if (token === "." && /[0-9]*\.[0-9]*$/.test(expr)) {
    // already has a decimal in current number
    const m = expr.match(/[0-9]*\.?[0-9]*$/)[0];
    if (m.includes(".")) return;
  }

  expr += token;
  setStatus("Ready");
  refreshDisplay();
}

function chooseOperator(op) {
  inputToken(op);
}

function equals() {
  if (expr === "" || errored) return;
  try {
    const r = window.Calculator.evaluate(expr);
    if (!isFinite(r)) throw new Error("result is not finite");
    expressionEl.textContent = displayExpr() + " =";
    resultEl.textContent = formatNumber(r);
    resultEl.classList.remove("error");
    expr = formatNumber(r);
    justEvaluated = true;
    setStatus("Done");
  } catch (err) {
    resultEl.textContent = err.message.includes("divide by zero")
      ? "Error: cannot divide by zero"
      : "Error";
    resultEl.classList.add("error");
    errored = true;
    setStatus("Error");
  }
}

function clearAll() {
  expr = "";
  justEvaluated = false;
  errored = false;
  resultEl.classList.remove("error");
  setStatus("Cleared");
  refreshDisplay();
}

function backspace() {
  if (errored) {
    clearAll();
    return;
  }
  expr = expr.slice(0, -1);
  justEvaluated = false;
  refreshDisplay();
}

function applyPercent() {
  if (errored) clearAll();
  // Percent of the last number in the expression.
  const m = expr.match(/(\d*\.?\d+)\s*$/);
  if (!m) return;
  const num = parseFloat(m[1]) / 100;
  expr = expr.slice(0, m.index) + formatNumber(num);
  refreshDisplay();
}

document.querySelectorAll(".key").forEach((key) => {
  key.addEventListener("click", () => {
    if (key.dataset.num !== undefined) {
      inputToken(key.dataset.num);
    } else if (key.dataset.op !== undefined) {
      chooseOperator(key.dataset.op);
    } else if (key.dataset.action === "equals") {
      equals();
    } else if (key.dataset.action === "clear") {
      clearAll();
    } else if (key.dataset.action === "backspace") {
      backspace();
    } else if (key.dataset.action === "percent") {
      applyPercent();
    }
  });
});

document.addEventListener("keydown", (e) => {
  const k = e.key;
  if (/[0-9.]/.test(k)) inputToken(k);
  else if (k === "+" || k === "-" || k === "*" || k === "/" || k === "%") {
    e.preventDefault();
    chooseOperator(k);
  } else if (k === "(" || k === ")") inputToken(k);
  else if (k === "Enter" || k === "=") {
    e.preventDefault();
    equals();
  } else if (k === "Backspace") backspace();
  else if (k === "Escape") clearAll();
});

refreshDisplay();
