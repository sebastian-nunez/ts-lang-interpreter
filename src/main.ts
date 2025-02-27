import Parser from "./parser/parser.ts";
import { createGlobalEnv } from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";

function repl() {
  const parser = new Parser();
  const env = createGlobalEnv();

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
    const result = evaluate(program, env);
    console.log(result);
  }
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  repl();
}
