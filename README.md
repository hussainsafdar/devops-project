# calculator

A small sample Python project: an arithmetic library with a command-line interface.

## Layout

- `src/calculator/operations.py` — the arithmetic functions
- `src/calculator/cli.py` — argparse-based command-line entry point
- `tests/` — pytest suite

## Usage

```bash
pip install -e ".[dev]"
calculator add 2 3      # 5.0
calculator div 1 0      # error: cannot divide by zero
```

## Tests

```bash
pytest
```
