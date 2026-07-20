"""Command-line interface for the calculator package."""

from __future__ import annotations

import argparse
import sys

if __package__ in (None, ""):
    # Allow running this file directly (python src/calculator/cli.py) by
    # putting the src/ directory (the package's parent) on sys.path.
    import os

    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from calculator.operations import add, divide, multiply, subtract

OPERATIONS = {
    "add": add,
    "sub": subtract,
    "mul": multiply,
    "div": divide,
}


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="calculator",
        description="Evaluate a single arithmetic operation.",
    )
    parser.add_argument("operation", choices=sorted(OPERATIONS))
    parser.add_argument("a", type=float)
    parser.add_argument("b", type=float)
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        result = OPERATIONS[args.operation](args.a, args.b)
    except ZeroDivisionError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    print(result)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
