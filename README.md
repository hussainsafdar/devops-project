# Calculator GUI

A professional, **browser-based** GUI calculator built with **Node.js**. It is a
port of the original Python command-line calculator (`src/calculator/`) — the
same arithmetic semantics are preserved, but wrapped in a polished web
interface that opens in your default browser.

This is a real calculator: it uses a genuine arithmetic engine (shunting-yard
expression evaluator) that honours operator precedence, associativity,
parentheses, unary minus, decimals and percent — exactly like a real calculator.

## Features

- Real math: `3 + 4 × 5 = 23`, `(3 + 4) × 5 = 35`, `0.1 + 0.2 = 0.3`
- Live result preview as you type
- Full keyboard support (digits, `+ - * / %`, `( )`, `Enter`, `Esc`, `Backspace`)
- Chained operations and parentheses
- Sign/percent helpers and backspace
- Friendly divide-by-zero error handling

## Layout

- `src/calculator.js` — the real math engine (ported operations + evaluator)
- `server.js` — tiny Node static server that serves the UI and opens the browser
- `public/index.html`, `public/styles.css`, `public/app.js` — the interface
- `test/calculator.test.js` — Node test suite (real arithmetic assertions)

## Requirements

- [Node.js](https://nodejs.org/) (v18+)

## Setup & Run

```bash
npm start
```

This starts a local server and automatically opens
`http://localhost:3000` in your default browser. No external dependencies
and no install step required.

## Tests

```bash
npm test
```

## Original CLI

The original Python project still works as before:

```bash
pip install -e ".[dev]"
calculator add 2 3      # 5.0
calculator div 1 0      # error: cannot divide by zero
pytest
```
