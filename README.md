# TypeScript Custom Language Interpreter

This project is a demonstration of building a custom programming language interpreter using [TypeScript](https://www.typescriptlang.org/) and [Deno](https://deno.com/).

It provides a foundational understanding of the core components involved in creating an [interpreter](<https://en.wikipedia.org/wiki/Interpreter_(computing)>), including [lexical analysis](https://en.wikipedia.org/wiki/Lexical_analysis) (tokenization), parsing ([abstract syntax tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) generation), and [run-time execution](https://en.wikipedia.org/wiki/Runtime_system).

## Syntax

```rust
fn makeAdder (offset) {

  fn add (x, y)  {
    x + y + offset
  }

  add
}

const adder = makeAdder(1);

print(adder(10, 5))
```

## Tech stack

- **Language:** [TypeScript](https://www.typescriptlang.org/) - used for writing the interpreter itself.
- **Runtime:** [Deno](https://deno.com/) - a JavaScript/TypeScript runtime environment used to execute the interpreter code.

## Getting started

### Running locally

1. [Install Deno](https://docs.deno.com/runtime/getting_started/installation/)
2. Install dependencies: `deno install`
3. Run the app: `deno run dev`
