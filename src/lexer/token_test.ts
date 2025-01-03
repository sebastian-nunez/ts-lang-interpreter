import { describe, it } from "jsr:@std/testing/bdd";
import { newToken, TokenType } from "./token.ts";
import { assertEquals } from "@std/assert/equals";

describe("newToken()", () => {
  it("should create a token given empty value parameter", () => {
    const value = "";
    const type = TokenType.Equals;

    const result = newToken(type, value);

    assertEquals(result, { value, type });
  });

  it("should create a token given non-empty value", () => {
    const value = "=";
    const type = TokenType.Equals;

    const result = newToken(type, value);

    assertEquals(result, { value, type });
  });
});
