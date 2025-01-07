import Parser from "./parser/parser.ts";
import Environment from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { newBoolean, newNull } from "./runtime/values.ts";

function repl() {
  const parser = new Parser();
  const env = new Environment();

  // Default global environment
  env.declareVar("true", newBoolean(true), true);
  env.declareVar("false", newBoolean(false), true);
  env.declareVar("null", newNull(), true);

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
    console.log(JSON.stringify(result, null, 2));
  }
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  repl();
}
