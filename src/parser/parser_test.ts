// deno-lint-ignore-file no-explicit-any
import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals } from "@std/assert";
import Parser from "./parser.ts";
import { VariableDeclaration } from "../ast/statements.ts";
import {
  AssignmentExpr,
  Identifier,
  NumericLiteral,
} from "../ast/expressions.ts";

describe("Parser", () => {
  it("parses simple identifier expression", () => {
    const sourceCode = "x";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    assertEquals(program.body[0].kind, "Identifier");
    assertEquals((program.body[0] as any).symbol, "x");
  });

  it("parses numeric literal expression", () => {
    const sourceCode = "10";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    assertEquals(program.body[0].kind, "NumericLiteral");
    assertEquals((program.body[0] as any).value, 10);
  });

  it("parses simple addition expression", () => {
    const sourceCode = "5 + 3";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as any;
    assertEquals(expr.kind, "BinaryExpr");
    assertEquals(expr.operator, "+");
    assertEquals(expr.left.kind, "NumericLiteral");
    assertEquals(expr.left.value, 5);
    assertEquals(expr.right.kind, "NumericLiteral");
    assertEquals(expr.right.value, 3);
  });

  it("parses addition with left-hand precedence", () => {
    const sourceCode = "10 + 5 - 3";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as any;
    assertEquals(expr.kind, "BinaryExpr");
    assertEquals(expr.operator, "-");
    assertEquals((expr.left as any).kind, "BinaryExpr");
    assertEquals((expr.left as any).operator, "+");
    assertEquals((expr.left as any).left.kind, "NumericLiteral");
    assertEquals((expr.left as any).left.value, 10);
    assertEquals((expr.left as any).right.kind, "NumericLiteral");
    assertEquals((expr.left as any).right.value, 5);
    assertEquals(expr.right.kind, "NumericLiteral");
    assertEquals(expr.right.value, 3);
  });

  it("parses parenthesis for grouping", () => {
    const sourceCode = "(2 + 3) * 4";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as any;
    assertEquals(expr.kind, "BinaryExpr");
    assertEquals(expr.operator, "*");
    assertEquals((expr.left as any).kind, "BinaryExpr");
    assertEquals((expr.left as any).operator, "+");
    assertEquals((expr.left as any).left.kind, "NumericLiteral");
    assertEquals((expr.left as any).left.value, 2);
    assertEquals((expr.left as any).right.kind, "NumericLiteral");
    assertEquals((expr.left as any).right.value, 3);
    assertEquals(expr.right.kind, "NumericLiteral");
    assertEquals(expr.right.value, 4);
  });

  it("parses multiplication and division expression", () => {
    const sourceCode = "10 * 5 / 2";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as any;
    assertEquals(expr.kind, "BinaryExpr");
    assertEquals(expr.operator, "/");
    assertEquals((expr.left as any).kind, "BinaryExpr");
    assertEquals((expr.left as any).operator, "*");
    assertEquals((expr.left as any).left.kind, "NumericLiteral");
    assertEquals((expr.left as any).left.value, 10);
    assertEquals((expr.left as any).right.kind, "NumericLiteral");
    assertEquals((expr.left as any).right.value, 5);
    assertEquals(expr.right.kind, "NumericLiteral");
    assertEquals(expr.right.value, 2);
  });

  it("parses a const variable declaration", () => {
    const sourceCode = "const x = 2;";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as VariableDeclaration;
    assertEquals(expr.kind, "VariableDeclaration");
    assertEquals(expr.identifier, "x");
    assertEquals(expr.constant, true);
    assertEquals(expr.value, {
      kind: "NumericLiteral",
      value: 2,
    } as NumericLiteral);
  });

  it("parses a let variable declaration without assignment", () => {
    const sourceCode = "let x;";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as VariableDeclaration;
    assertEquals(expr.kind, "VariableDeclaration");
    assertEquals(expr.identifier, "x");
    assertEquals(expr.constant, false);
    assertEquals(expr.value, undefined);
  });

  it("parses a let variable declaration with assignment", () => {
    const sourceCode = "let x = 2;";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as VariableDeclaration;
    assertEquals(expr.kind, "VariableDeclaration");
    assertEquals(expr.identifier, "x");
    assertEquals(expr.constant, false);
    assertEquals(expr.value, {
      kind: "NumericLiteral",
      value: 2,
    } as NumericLiteral);
  });

  it("parses a let assignment", () => {
    const sourceCode = "x = 2;";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as AssignmentExpr;
    assertEquals(expr.kind, "AssignmentExpr");
    assertEquals(expr.assignee, {
      kind: "Identifier",
      symbol: "x",
    } as Identifier);
    assertEquals(expr.value, {
      kind: "NumericLiteral",
      value: 2,
    } as NumericLiteral);
  });
});
