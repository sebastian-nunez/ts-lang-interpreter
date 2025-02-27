import { describe, it } from "jsr:@std/testing/bdd";
import { newToken, Token, TokenType } from "./token.ts";
import { tokenize } from "./lexer.ts";
import { assertEquals } from "@std/assert/equals";

describe("tokenize()", () => {
  it("should tokenize single character tokens", () => {
    const source = "( ) + - * / =";
    const expected: Token[] = [
      newToken(TokenType.OpenParen, "("),
      newToken(TokenType.ClosedParen, ")"),
      newToken(TokenType.BinaryOperator, "+"),
      newToken(TokenType.BinaryOperator, "-"),
      newToken(TokenType.BinaryOperator, "*"),
      newToken(TokenType.BinaryOperator, "/"),
      newToken(TokenType.Equals, "="),
      newToken(TokenType.EOF, "EOF"),
    ];
    assertEquals(tokenize(source), expected);
  });

  it("should tokenize numbers", () => {
    const source = "123 45 0 9876543210";
    const expected: Token[] = [
      newToken(TokenType.Number, "123"),
      newToken(TokenType.Number, "45"),
      newToken(TokenType.Number, "0"),
      newToken(TokenType.Number, "9876543210"),
      newToken(TokenType.EOF, "EOF"),
    ];
    assertEquals(tokenize(source), expected);
  });

  it("should tokenize identifiers and keywords", () => {
    const source = "let myVariable anotherVariable let";
    const expected: Token[] = [
      newToken(TokenType.Let, "let"),
      newToken(TokenType.Identifier, "myVariable"),
      newToken(TokenType.Identifier, "anotherVariable"),
      newToken(TokenType.Let, "let"),
      newToken(TokenType.EOF, "EOF"),
    ];
    assertEquals(tokenize(source), expected);
  });

  it("should tokenize const identifier", () => {
    const source = "const myVar";
    const expected: Token[] = [
      newToken(TokenType.Const, "const"),
      newToken(TokenType.Identifier, "myVar"),
      newToken(TokenType.EOF, "EOF"),
    ];
    assertEquals(tokenize(source), expected);
  });

  it("should tokenize semi colon", () => {
    const source = ";";
    const expected: Token[] = [
      newToken(TokenType.SemiColon, ";"),
      newToken(TokenType.EOF, "EOF"),
    ];
    assertEquals(tokenize(source), expected);
  });

  it("should tokenize colon", () => {
    const source = ":";
    const expected: Token[] = [
      newToken(TokenType.Colon, ":"),
      newToken(TokenType.EOF, "EOF"),
    ];
    assertEquals(tokenize(source), expected);
  });

  it("should tokenize comma", () => {
    const source = ",";
    const expected: Token[] = [
      newToken(TokenType.Comma, ","),
      newToken(TokenType.EOF, "EOF"),
    ];
    assertEquals(tokenize(source), expected);
  });

  it("should tokenize open and close braces", () => {
    const source = "{}";
    const expected: Token[] = [
      newToken(TokenType.OpenBrace, "{"),
      newToken(TokenType.ClosedBrace, "}"),
      newToken(TokenType.EOF, "EOF"),
    ];
    assertEquals(tokenize(source), expected);
  });

  it("should tokenize open and close brackets", () => {
    const source = "[]";
    const expected: Token[] = [
      newToken(TokenType.OpenBracket, "["),
      newToken(TokenType.ClosedBracket, "]"),
      newToken(TokenType.EOF, "EOF"),
    ];
    assertEquals(tokenize(source), expected);
  });

  it("should tokenize a dot", () => {
    const source = ".";
    const expected: Token[] = [
      newToken(TokenType.Dot, "."),
      newToken(TokenType.EOF, "EOF"),
    ];
    assertEquals(tokenize(source), expected);
  });

  it("should tokenize fn keyword", () => {
    const source = "fn";
    const expected: Token[] = [
      newToken(TokenType.Fn, "fn"),
      newToken(TokenType.EOF, "EOF"),
    ];
    assertEquals(tokenize(source), expected);
  });

  it("should tokenize a simple string", () => {
    const source = `"some string!"`;
    const expected: Token[] = [
      newToken(TokenType.String, "some string!"),
      newToken(TokenType.EOF, "EOF"),
    ];
    assertEquals(tokenize(source), expected);
  });

  it("should tokenize an empty string", () => {
    const source = `""`;
    const expected: Token[] = [
      newToken(TokenType.String, ""),
      newToken(TokenType.EOF, "EOF"),
    ];
    assertEquals(tokenize(source), expected);
  });

  it("should tokenize a complex expression", () => {
    const source = "let x = 10 + 5 * (2 - 1)";
    const expected: Token[] = [
      newToken(TokenType.Let, "let"),
      newToken(TokenType.Identifier, "x"),
      newToken(TokenType.Equals, "="),
      newToken(TokenType.Number, "10"),
      newToken(TokenType.BinaryOperator, "+"),
      newToken(TokenType.Number, "5"),
      newToken(TokenType.BinaryOperator, "*"),
      newToken(TokenType.OpenParen, "("),
      newToken(TokenType.Number, "2"),
      newToken(TokenType.BinaryOperator, "-"),
      newToken(TokenType.Number, "1"),
      newToken(TokenType.ClosedParen, ")"),
      newToken(TokenType.EOF, "EOF"),
    ];
    assertEquals(tokenize(source), expected);
  });

  it("should tokenize skippable characters", () => {
    const source = " \t\n123";
    const expected: Token[] = [
      newToken(TokenType.Number, "123"),
      newToken(TokenType.EOF, "EOF"),
    ];
    assertEquals(tokenize(source), expected);
  });
});
