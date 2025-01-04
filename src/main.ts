import Parser from "./parser/parser.ts";

function repl() {
  const parser = new Parser();
  console.log("Repl v0.1");

  while (true) {
    const input = prompt("> ");

    if (!input || input.includes("exit")) {
      Deno.exit(1);
    }

    const program = parser.produceAST(input);
    console.log(JSON.stringify(program, null, 2));
  }
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  repl();
}
