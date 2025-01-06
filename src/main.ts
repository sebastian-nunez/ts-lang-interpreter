import Parser from "./parser/parser.ts";
import { evaluate } from "./runtime/interpreter.ts";

function repl() {
  const parser = new Parser();
  console.log("Repl v0.1");

  while (true) {
    const input = prompt("> ");

    if (!input || input.includes("exit")) {
      Deno.exit(1);
    }

    console.log("----- Parsed AST -----");
    const program = parser.produceAST(input);
    console.log(JSON.stringify(program, null, 2));

    console.log("----- Evaluated result -----");
    const result = evaluate(program);
    console.log(JSON.stringify(result, null, 2));
  }
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  repl();
}
