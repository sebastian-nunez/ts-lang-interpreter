import { Program, Stmt } from "../ast/statements.ts";
import { NullVal, NumberVal, RuntimeVal } from "./values.ts";
import { BinaryExpr, NumericLiteral } from "../ast/expressions.ts";

/** evaluate evaluates AST node statements into real runtime values */
export function evaluate(astNode: Stmt): RuntimeVal {
  switch (astNode.kind) {
    case "Program":
      return eval_program(astNode as Program);
    case "NumericLiteral":
      return eval_numeric_literal(astNode as NumericLiteral);
    case "NullLiteral":
      return eval_null_literal();
    case "BinaryExpr":
      return eval_binary_expr(astNode as BinaryExpr);
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

function eval_program(program: Program): RuntimeVal {
  let lastEvaluated: RuntimeVal = {
    type: "null",
    value: "null",
  } as NullVal;

  for (const statement of program.body) {
    lastEvaluated = evaluate(statement);
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

function eval_binary_expr(binaryExpr: BinaryExpr): RuntimeVal {
  const lhs = evaluate(binaryExpr.left);
  const rhs = evaluate(binaryExpr.right);

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
