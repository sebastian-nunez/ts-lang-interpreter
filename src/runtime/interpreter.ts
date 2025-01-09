import { Program, Stmt, VariableDeclaration } from "../ast/statements.ts";
import {
  NativeFnVal,
  newNull,
  newObject,
  NullVal,
  NumberVal,
  RuntimeVal,
  StringVal,
} from "./values.ts";
import {
  AssignmentExpr,
  BinaryExpr,
  CallExpr,
  Identifier,
  NumericLiteral,
  ObjectLiteral,
  StringLiteral,
} from "../ast/expressions.ts";
import Environment from "./environment.ts";

/** evaluate evaluates AST node statements into real runtime values */
export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    // Statements
    case "Program":
      return eval_program(astNode as Program, env);
    case "VariableDeclaration":
      return eval_var_declaration(astNode as VariableDeclaration, env);
    // Expressions
    case "NumericLiteral":
      return eval_numeric_literal(astNode as NumericLiteral);
    case "StringLiteral":
      return eval_string_literal(astNode as StringLiteral);
    case "Identifier":
      return eval_identifier(astNode as Identifier, env);
    case "ObjectLiteral":
      return eval_object_expr(astNode as ObjectLiteral, env);
    case "CallExpr":
      return eval_function_call_expr(astNode as CallExpr, env);
    case "BinaryExpr":
      return eval_binary_expr(astNode as BinaryExpr, env);
    case "AssignmentExpr":
      return eval_assignment_expr(astNode as AssignmentExpr, env);

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
  let lastEvaluated: RuntimeVal = newNull();

  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }
  return lastEvaluated;
}

function eval_var_declaration(
  declaration: VariableDeclaration,
  env: Environment
): RuntimeVal {
  const value = declaration?.value
    ? evaluate(declaration.value, env)
    : newNull();
  return env.declareVar(declaration.identifier, value, declaration.constant);
}

function eval_numeric_literal(numericLiteral: NumericLiteral): RuntimeVal {
  const numVal: NumberVal = {
    type: "number",
    value: numericLiteral.value,
  };

  return numVal;
}

function eval_string_literal(str: StringLiteral): RuntimeVal {
  const strVal: StringVal = {
    type: "string",
    value: str.value,
  };
  return strVal;
}

function eval_identifier(identifier: Identifier, env: Environment): RuntimeVal {
  const val = env.lookupVar(identifier.symbol);
  return val;
}

function eval_object_expr(obj: ObjectLiteral, env: Environment): RuntimeVal {
  const objVal = newObject();

  for (const { key, value } of obj.properties) {
    const runtimeVal =
      value === undefined // Shorthand was used `{ foo }` same as `{ foo: foo }`. So we expect, `foo` to be defined.
        ? env.lookupVar(key)
        : evaluate(value, env);

    objVal.properties.set(key, runtimeVal);
  }

  return objVal;
}

function eval_function_call_expr(
  callExpr: CallExpr,
  env: Environment
): RuntimeVal {
  const args = callExpr.args.map((arg) => evaluate(arg, env));
  const fnVal = evaluate(callExpr.caller, env); // get the function identifier

  // Can only call on native function or user-defined functions
  if (fnVal.type !== "nativeFn") {
    throw new Error(
      "cannot call value that is not a function: " + JSON.stringify(fnVal)
    );
  }

  const result = (fnVal as NativeFnVal).call(args, env);
  return result;
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
  return { type: "null", value: null } as NullVal;
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

function eval_assignment_expr(
  expr: AssignmentExpr,
  env: Environment
): RuntimeVal {
  // We can only assign values to identifiers
  if (expr.assignee.kind !== "Identifier") {
    throw new Error(
      `can not assign an expression of kind '${expr.assignee.kind}' to a variable. Only identifier assignment is supported`
    );
  }

  const identifier = expr.assignee as Identifier;
  return env.assignVar(identifier.symbol, evaluate(expr.value, env)); // Throws
}
