import { beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import { NumberVal, RuntimeVal, StringVal } from "./values.ts";
import { Program, VariableDeclaration } from "../ast/statements.ts";
import { evaluate } from "./interpreter.ts"; // assuming `evaluate` is in `interpreter.ts`
import Environment from "./environment.ts";
import {
  AssignmentExpr,
  BinaryExpr,
  NumericLiteral,
  StringLiteral,
} from "../ast/expressions.ts";

describe("Interpreter", () => {
  let env: Environment;

  beforeEach(() => {
    env = new Environment();
  });

  it("should evaluate a numeric literal", () => {
    const ast: Program = {
      kind: "Program",
      body: [
        {
          kind: "NumericLiteral",
          value: 42,
        } as NumericLiteral,
      ],
    };
    const expected: RuntimeVal = { type: "number", value: 42 } as NumberVal;

    const result = evaluate(ast, env);

    assertEquals(result, expected);
  });

  it("should evaluate a string literal", () => {
    const ast: Program = {
      kind: "Program",
      body: [
        {
          kind: "StringLiteral",
          value: "hello world",
        } as StringLiteral,
      ],
    };
    const expected: RuntimeVal = {
      type: "string",
      value: "hello world",
    } as StringVal;

    const result = evaluate(ast, env);

    assertEquals(result, expected);
  });

  it("should evaluate a variable declaration", () => {
    const ast: VariableDeclaration = {
      kind: "VariableDeclaration",
      identifier: "x",
      value: {
        kind: "NumericLiteral",
        value: 10,
      } as NumericLiteral,
      constant: false,
    };
    const expected: RuntimeVal = { type: "number", value: 10 } as NumberVal;

    const result = evaluate(ast, env);
    assertEquals(result, expected);
  });

  it("should evaluate a binary expression (addition)", () => {
    const ast: BinaryExpr = {
      kind: "BinaryExpr",
      operator: "+",
      left: {
        kind: "NumericLiteral",
        value: 3,
      } as NumericLiteral,
      right: {
        kind: "NumericLiteral",
        value: 5,
      } as NumericLiteral,
    };
    const expected: RuntimeVal = { type: "number", value: 8 } as NumberVal;

    const result = evaluate(ast, env);

    assertEquals(result, expected);
  });

  it("should evaluate a binary expression (subtraction)", () => {
    const ast: BinaryExpr = {
      kind: "BinaryExpr",
      operator: "-",
      left: {
        kind: "NumericLiteral",
        value: 3,
      } as NumericLiteral,
      right: {
        kind: "NumericLiteral",
        value: 5,
      } as NumericLiteral,
    };
    const expected: RuntimeVal = { type: "number", value: -2 } as NumberVal;

    const result = evaluate(ast, env);

    assertEquals(result, expected);
  });

  it("should evaluate a binary expression (multiplication)", () => {
    const ast: BinaryExpr = {
      kind: "BinaryExpr",
      operator: "*",
      left: {
        kind: "NumericLiteral",
        value: 3,
      } as NumericLiteral,
      right: {
        kind: "NumericLiteral",
        value: 5,
      } as NumericLiteral,
    };
    const expected: RuntimeVal = { type: "number", value: 15 } as NumberVal;

    const result = evaluate(ast, env);

    assertEquals(result, expected);
  });

  it("should evaluate a binary expression (division)", () => {
    const ast: BinaryExpr = {
      kind: "BinaryExpr",
      operator: "/",
      left: {
        kind: "NumericLiteral",
        value: 3,
      } as NumericLiteral,
      right: {
        kind: "NumericLiteral",
        value: 5,
      } as NumericLiteral,
    };
    const expected: RuntimeVal = { type: "number", value: 0.6 } as NumberVal;

    const result = evaluate(ast, env);

    assertEquals(result, expected);
  });

  it("should fail evaluate a binary expression (division by 0)", () => {
    const ast: BinaryExpr = {
      kind: "BinaryExpr",
      operator: "/",
      left: {
        kind: "NumericLiteral",
        value: 3,
      } as NumericLiteral,
      right: {
        kind: "NumericLiteral",
        value: 0,
      } as NumericLiteral,
    };

    assertThrows(() => evaluate(ast, env));
  });

  it("should evaluate a binary expression (mod)", () => {
    const ast: BinaryExpr = {
      kind: "BinaryExpr",
      operator: "%",
      left: {
        kind: "NumericLiteral",
        value: 5,
      } as NumericLiteral,
      right: {
        kind: "NumericLiteral",
        value: 3,
      } as NumericLiteral,
    };
    const expected: RuntimeVal = { type: "number", value: 2 } as NumberVal;

    const result = evaluate(ast, env);

    assertEquals(result, expected);
  });

  it("should fail evaluate a binary expression (mod by 0)", () => {
    const ast: BinaryExpr = {
      kind: "BinaryExpr",
      operator: "%",
      left: {
        kind: "NumericLiteral",
        value: 3,
      } as NumericLiteral,
      right: {
        kind: "NumericLiteral",
        value: 0,
      } as NumericLiteral,
    };

    assertThrows(() => evaluate(ast, env));
  });

  it("should fail evaluate a binary expression due to unknown operator", () => {
    const ast: BinaryExpr = {
      kind: "BinaryExpr",
      operator: "#",
      left: {
        kind: "NumericLiteral",
        value: 3,
      } as NumericLiteral,
      right: {
        kind: "NumericLiteral",
        value: 0,
      } as NumericLiteral,
    };

    assertThrows(() => evaluate(ast, env));
  });

  it("should successfully evaluate a variable assignment", () => {
    const ast: Program = {
      kind: "Program",
      body: [
        {
          kind: "VariableDeclaration",
          identifier: "y",
          value: {
            kind: "NumericLiteral",
            value: 20,
          } as NumericLiteral,
          constant: false,
        } as VariableDeclaration,
        {
          kind: "AssignmentExpr",
          operator: "=",
          assignee: { kind: "Identifier", symbol: "y" },
          value: {
            kind: "NumericLiteral",
            value: 30,
          },
        } as AssignmentExpr,
      ],
    };
    const expected: RuntimeVal = { type: "number", value: 30 } as NumberVal;

    const result = evaluate(ast, env);
    assertEquals(result, expected);
  });

  it("should fail to evaluate a variable assignment given invalid identifier (for varname)", () => {
    const ast: Program = {
      kind: "Program",
      body: [
        {
          kind: "VariableDeclaration",
          identifier: "1var",
          value: {
            kind: "NumericLiteral",
            value: 20,
          } as NumericLiteral,
          constant: false,
        } as VariableDeclaration,
        {
          kind: "AssignmentExpr",
          operator: "=",
          assignee: { kind: "Identifier", symbol: "y" },
          value: {
            kind: "NumericLiteral",
            value: 30,
          },
        } as AssignmentExpr,
      ],
    };

    assertThrows(() => evaluate(ast, env));
  });
});
