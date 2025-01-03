import { describe, it } from "jsr:@std/testing/bdd";
import { newToken, Token, TokenType } from "./token.ts";
import { tokenize } from "./lexer.ts";
import { assertEquals } from "@std/assert/equals";
import { assertThrows } from "@std/assert/throws";

describe("tokenize()", () => {
  it("should tokenize single character tokens", () => {
    const source = "( ) + - * / =";
    const expected: Token[] = [
      newToken("(", TokenType.OpenParen),
      newToken(")", TokenType.ClosedParen),
      newToken("+", TokenType.BinaryOperator),
      newToken("-", TokenType.BinaryOperator),
      newToken("*", TokenType.BinaryOperator),
      newToken("/", TokenType.BinaryOperator),
      newToken("=", TokenType.Equals),
    ];
    assertEquals(tokenize(source), expected);
  });

  it("should tokenize numbers", () => {
    const source = "123 45 0 9876543210";
    const expected: Token[] = [
      newToken("123", TokenType.Number),
      newToken("45", TokenType.Number),
      newToken("0", TokenType.Number),
      newToken("9876543210", TokenType.Number),
    ];
    assertEquals(tokenize(source), expected);
  });

  it("should tokenize identifiers and keywords", () => {
    const source = "let myVariable anotherVariable let";
    const expected: Token[] = [
      newToken("let", TokenType.Let),
      newToken("myVariable", TokenType.Identifier),
      newToken("anotherVariable", TokenType.Identifier),
      newToken("let", TokenType.Let),
    ];
    assertEquals(tokenize(source), expected);
  });

  it("should tokenize a complex expression", () => {
    const source = "let x = 10 + 5 * (2 - 1)";
    const expected: Token[] = [
      newToken("let", TokenType.Let),
      newToken("x", TokenType.Identifier),
      newToken("=", TokenType.Equals),
      newToken("10", TokenType.Number),
      newToken("+", TokenType.BinaryOperator),
      newToken("5", TokenType.Number),
      newToken("*", TokenType.BinaryOperator),
      newToken("(", TokenType.OpenParen),
      newToken("2", TokenType.Number),
      newToken("-", TokenType.BinaryOperator),
      newToken("1", TokenType.Number),
      newToken(")", TokenType.ClosedParen),
    ];
    assertEquals(tokenize(source), expected);
  });

  it("should tokenize skippable characters", () => {
    const source = " \t\n123";
    const expected: Token[] = [newToken("123", TokenType.Number)];
    assertEquals(tokenize(source), expected);
  });

  it("should handle unrecognized tokens", () => {
    const source = "@!";
    assertThrows(() => tokenize(source));
  });
});
