// deno-lint-ignore-file no-explicit-any
import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import Parser from "./parser.ts";
import { FunctionDeclaration, VariableDeclaration } from "../ast/statements.ts";
import {
  AssignmentExpr,
  CallExpr,
  Identifier,
  MemberExpr,
  NumericLiteral,
  ObjectLiteral,
  PropertyLiteral,
  StringLiteral,
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

  it("parses string literal expression", () => {
    const sourceCode = `"hello, this is a string!"`;
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    assertEquals(program.body[0].kind, "StringLiteral");
    assertEquals((program.body[0] as any).value, "hello, this is a string!");
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

  it("parses a const variable declaration with a string", () => {
    const sourceCode = `const x = "some string";`;
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as VariableDeclaration;
    assertEquals(expr.kind, "VariableDeclaration");
    assertEquals(expr.identifier, "x");
    assertEquals(expr.constant, true);
    assertEquals(expr.value, {
      kind: "StringLiteral",
      value: "some string",
    } as StringLiteral);
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

  it("parses a simple shorthand object expression", () => {
    const sourceCode = "{ x }";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as ObjectLiteral;
    assertEquals(expr.kind, "ObjectLiteral");
    assertEquals(expr.properties[0], {
      kind: "PropertyLiteral",
      key: "x",
    } as PropertyLiteral);
  });

  it("parses a simple shorthand object expression ending in comma", () => {
    const sourceCode = "{ x, }";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as ObjectLiteral;
    assertEquals(expr.kind, "ObjectLiteral");
    assertEquals(expr.properties[0], {
      kind: "PropertyLiteral",
      key: "x",
    } as PropertyLiteral);
  });

  it("parses a simple object expression with value", () => {
    const sourceCode = "{ x: 2 }";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as ObjectLiteral;
    assertEquals(expr.kind, "ObjectLiteral");
    assertEquals(expr.properties[0], {
      kind: "PropertyLiteral",
      key: "x",
      value: {
        kind: "NumericLiteral",
        value: 2,
      } as NumericLiteral,
    } as PropertyLiteral);
  });

  it("parses a simple object expression with multiple keys and values", () => {
    const sourceCode = "{ x: 2, y: 1 }";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as ObjectLiteral;
    assertEquals(expr.kind, "ObjectLiteral");
    assertEquals(expr.properties[0], {
      kind: "PropertyLiteral",
      key: "x",
      value: {
        kind: "NumericLiteral",
        value: 2,
      } as NumericLiteral,
    } as PropertyLiteral);
    assertEquals(expr.properties[1], {
      kind: "PropertyLiteral",
      key: "y",
      value: {
        kind: "NumericLiteral",
        value: 1,
      } as NumericLiteral,
    } as PropertyLiteral);
  });

  it("parses a simple member access on an object", () => {
    const sourceCode = "obj.foo";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as MemberExpr;
    assertEquals(expr.kind, "MemberExpr");
    assertEquals(expr.object, {
      kind: "Identifier",
      symbol: "obj",
    } as Identifier);
    assertEquals(expr.property, {
      kind: "Identifier",
      symbol: "foo",
    } as Identifier);
    assertEquals(expr.isComputed, false);
  });

  it("parses nested member access on an object", () => {
    const sourceCode = "obj.foo.bar";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as MemberExpr;
    assertEquals(expr.kind, "MemberExpr");
    assertEquals(expr.property, {
      kind: "Identifier",
      symbol: "bar",
    } as Identifier);
    assertEquals(expr.object, {
      kind: "MemberExpr",
      object: {
        kind: "Identifier",
        symbol: "obj",
      } as Identifier,
      property: {
        kind: "Identifier",
        symbol: "foo",
      } as Identifier,
      isComputed: false,
    } as MemberExpr);
    assertEquals(expr.isComputed, false);
  });

  it("parses a basic function call without args", () => {
    const sourceCode = "func()";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as CallExpr;
    assertEquals(expr.kind, "CallExpr");
    assertEquals(expr.caller, {
      kind: "Identifier",
      symbol: "func",
    } as Identifier);
    assertEquals(expr.args, []);
  });

  it("parses a basic function call with a single arg", () => {
    const sourceCode = "func(1)";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as CallExpr;
    assertEquals(expr.kind, "CallExpr");
    assertEquals(expr.caller, {
      kind: "Identifier",
      symbol: "func",
    } as Identifier);
    assertEquals(expr.args, [
      {
        kind: "NumericLiteral",
        value: 1,
      } as NumericLiteral,
    ]);
  });

  it("parses a basic function call with multiple args", () => {
    const sourceCode = "func(1, 2, 3)";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as CallExpr;
    assertEquals(expr.kind, "CallExpr");
    assertEquals(expr.caller, {
      kind: "Identifier",
      symbol: "func",
    } as Identifier);
    assertEquals(expr.args, [
      {
        kind: "NumericLiteral",
        value: 1,
      } as NumericLiteral,
      {
        kind: "NumericLiteral",
        value: 2,
      } as NumericLiteral,
      {
        kind: "NumericLiteral",
        value: 3,
      } as NumericLiteral,
    ]);
  });

  it("parses a function call on a member expression", () => {
    const sourceCode = "obj.func()";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as CallExpr;
    assertEquals(expr.kind, "CallExpr");
    assertEquals(expr.caller, {
      kind: "MemberExpr",
      object: {
        kind: "Identifier",
        symbol: "obj",
      } as Identifier,
      property: {
        kind: "Identifier",
        symbol: "func",
      } as Identifier,
      isComputed: false,
    } as MemberExpr);
    assertEquals(expr.args, []);
  });

  it("parses a function call on a member expression with simple args", () => {
    const sourceCode = "obj.func(1, 2)";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as CallExpr;
    assertEquals(expr.kind, "CallExpr");
    assertEquals(expr.caller, {
      kind: "MemberExpr",
      object: {
        kind: "Identifier",
        symbol: "obj",
      } as Identifier,
      property: {
        kind: "Identifier",
        symbol: "func",
      } as Identifier,
      isComputed: false,
    } as MemberExpr);
    assertEquals(expr.args, [
      {
        kind: "NumericLiteral",
        value: 1,
      } as NumericLiteral,
      {
        kind: "NumericLiteral",
        value: 2,
      } as NumericLiteral,
    ]);
  });

  it("parses a function call on a member expression with function arg", () => {
    const sourceCode = "obj.func(bar())";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as CallExpr;
    assertEquals(expr.kind, "CallExpr");
    assertEquals(expr.caller, {
      kind: "MemberExpr",
      object: {
        kind: "Identifier",
        symbol: "obj",
      } as Identifier,
      property: {
        kind: "Identifier",
        symbol: "func",
      } as Identifier,
      isComputed: false,
    } as MemberExpr);
    assertEquals(expr.args, [
      {
        kind: "CallExpr",
        caller: {
          kind: "Identifier",
          symbol: "bar",
        } as Identifier,
        args: [],
      } as CallExpr,
    ]);
  });

  it("parses a function call on a member expression with complex function arg", () => {
    const sourceCode = "obj.func(bar(1, 2))";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as CallExpr;
    assertEquals(expr.kind, "CallExpr");
    assertEquals(expr.caller, {
      kind: "MemberExpr",
      object: {
        kind: "Identifier",
        symbol: "obj",
      } as Identifier,
      property: {
        kind: "Identifier",
        symbol: "func",
      } as Identifier,
      isComputed: false,
    } as MemberExpr);
    assertEquals(expr.args, [
      {
        kind: "CallExpr",
        caller: {
          kind: "Identifier",
          symbol: "bar",
        } as Identifier,
        args: [
          {
            kind: "NumericLiteral",
            value: 1,
          } as NumericLiteral,
          {
            kind: "NumericLiteral",
            value: 2,
          } as NumericLiteral,
        ],
      } as CallExpr,
    ]);
  });

  it("parses a simple function declaration expression", () => {
    const sourceCode = "fn func() {}";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as FunctionDeclaration;
    assertEquals(expr.kind, "FunctionDeclaration");
    assertEquals(expr.name, "func");
    assertEquals(expr.params, []);
    assertEquals(expr.body, []);
  });

  it("parses a simple function declaration expression with params", () => {
    const sourceCode = "fn func(x, y) {}";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as FunctionDeclaration;
    assertEquals(expr.kind, "FunctionDeclaration");
    assertEquals(expr.name, "func");
    assertEquals(expr.params, ["x", "y"]);
    assertEquals(expr.body, []);
  });

  it("parses a simple function declaration expression with params and body", () => {
    const sourceCode = "fn func(x, y) { print(x, y) }";
    const parser = new Parser();
    const program = parser.produceAST(sourceCode);

    assertEquals(program.body.length, 1);
    const expr = program.body[0] as FunctionDeclaration;
    assertEquals(expr.kind, "FunctionDeclaration");
    assertEquals(expr.name, "func");
    assertEquals(expr.params, ["x", "y"]);
    assertEquals(expr.body, [
      {
        kind: "CallExpr",
        caller: {
          kind: "Identifier",
          symbol: "print",
        } as Identifier,
        args: [
          {
            kind: "Identifier",
            symbol: "x",
          } as Identifier,
          {
            kind: "Identifier",
            symbol: "y",
          } as Identifier,
        ],
      } as CallExpr,
    ]);
  });

  it("should fail to parse a function without parenthesis for the params", () => {
    const sourceCode = "fn func x {}";
    const parser = new Parser();
    assertThrows(() => parser.produceAST(sourceCode));
  });

  it("should fail to parse a function without a valid name", () => {
    const sourceCode = "fn 1func";
    const parser = new Parser();
    assertThrows(() => parser.produceAST(sourceCode));
  });

  it("should fail to parse a function with invalid param names", () => {
    const sourceCode = "fn func(1invalid) {}";
    const parser = new Parser();
    assertThrows(() => parser.produceAST(sourceCode));
  });

  it("should fail to parse a function without function body braces", () => {
    const sourceCode = "fn func(invalid)";
    const parser = new Parser();
    assertThrows(() => parser.produceAST(sourceCode));
  });
});
