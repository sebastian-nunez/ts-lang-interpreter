# TypeScript Custom Language Interpreter

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

- **Language:** TypeScript
- **Runtime:** Deno

## Getting started

### Running locally

1. [Install Deno](https://docs.deno.com/runtime/getting_started/installation/)
2. Install dependencies: `deno install`
3. Run the app: `deno run dev`
