import { Program, Stmt } from "../ast/statements.ts";
import { NullVal, NumberVal, RuntimeVal } from "./values.ts";
import { BinaryExpr, Identifier, NumericLiteral } from "../ast/expressions.ts";
import Environment from "./environment.ts";

/** evaluate evaluates AST node statements into real runtime values */
export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    case "Program":
      return eval_program(astNode as Program, env);
    case "NumericLiteral":
      return eval_numeric_literal(astNode as NumericLiteral);
    case "NullLiteral":
      return eval_null_literal();
    case "Identifier":
      return eval_identifier(astNode as Identifier, env);
    case "BinaryExpr":
      return eval_binary_expr(astNode as BinaryExpr, env);
    default:
      console.error(
        `This AST node has not been setup for interpretation: ${JSON.stringify(
          astNode,
          null,
          2
        )}`
      );
      Deno.exit(0);
  }
}

function eval_program(program: Program, env: Environment): RuntimeVal {
  let lastEvaluated: RuntimeVal = {
    type: "null",
    value: "null",
  } as NullVal;

  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }
  return lastEvaluated;
}

function eval_numeric_literal(numericLiteral: NumericLiteral): RuntimeVal {
  const numVal: NumberVal = {
    type: "number",
    value: numericLiteral.value,
  };

  return numVal;
}

function eval_null_literal(): RuntimeVal {
  const nullVal: NullVal = {
    type: "null",
    value: "null",
  };

  return nullVal;
}

function eval_identifier(identifier: Identifier, env: Environment): RuntimeVal {
  const val = env.lookupVar(identifier.symbol);
  return val;
}

function eval_binary_expr(
  binaryExpr: BinaryExpr,
  env: Environment
): RuntimeVal {
  const lhs = evaluate(binaryExpr.left, env);
  const rhs = evaluate(binaryExpr.right, env);

  if (lhs.type === "number" && rhs.type === "number") {
    return eval_numeric_binary_expr(
      lhs as NumberVal,
      rhs as NumberVal,
      binaryExpr.operator
    );
  }
  // TODO: add support for string and so forth

  // One or both are NULL
  return { type: "null", value: "null" } as NullVal;
}

function eval_numeric_binary_expr(
  lhs: NumberVal,
  rhs: NumberVal,
  operator: string
): NumberVal {
  let result: number;

  switch (operator) {
    case "+":
      result = lhs.value + rhs.value;
      break;
    case "-":
      result = lhs.value - rhs.value;
      break;
    case "*":
      result = lhs.value * rhs.value;
      break;
    case "/":
      if (rhs.value === 0) {
        console.error("Interpreter error: division by zero");
        Deno.exit(1);
      }

      result = lhs.value / rhs.value;
      break;
    case "%":
      if (rhs.value === 0) {
        console.error("Interpreter error: division by zero");
        Deno.exit(1);
      }

      result = lhs.value % rhs.value;
      break;
    default:
      console.error(`Interpreter error: Unknown operator -> '${operator}'`);
      Deno.exit(1);
  }

  return { type: "number", value: result };
}
