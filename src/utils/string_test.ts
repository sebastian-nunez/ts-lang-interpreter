import { assertEquals, assertThrows } from "@std/assert";
import { describe, it } from "jsr:@std/testing/bdd";
import { isAlpha, isInt, isSkippable } from "./strings.ts";

describe("isAlpha()", () => {
  it("should return true given valid characters", () => {
    const chars = ["A", "a", "z", "D"];

    for (const char of chars) {
      const result = isAlpha(char);
      assertEquals(result, true);
    }
  });

  it("should return false given invalid characters", () => {
    const chars = ["!", "3", ")"];

    for (const char of chars) {
      const result = isAlpha(char);
      assertEquals(result, false);
    }
  });

  it("should throw an error given multiple characters", () => {
    const chars = ["AA", "Ac"];

    for (const char of chars) {
      assertThrows(() => isAlpha(char));
    }
  });
});

describe("isInt()", () => {
  it("should return true given valid integers", () => {
    const chars = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

    for (const char of chars) {
      const result = isInt(char);
      assertEquals(result, true);
    }
  });

  it("should return false given invalid integers", () => {
    const chars = ["!", "E", ")"];

    for (const char of chars) {
      const result = isInt(char);
      assertEquals(result, false);
    }
  });

  it("should throw an error given multiple characters", () => {
    const chars = ["33", "42"];

    for (const char of chars) {
      assertThrows(() => isInt(char));
    }
  });
});

describe("isSkippable()", () => {
  it("should return true given newline", () => {
    const str = "\n";
    const result = isSkippable(str);
    assertEquals(result, true);
  });

  it("should return true given space", () => {
    const str = " ";
    const result = isSkippable(str);
    assertEquals(result, true);
  });

  it("should return true given tab'", () => {
    const str = "\t";
    const result = isSkippable(str);
    assertEquals(result, true);
  });

  it("should return true given return'", () => {
    const str = "\r";
    const result = isSkippable(str);
    assertEquals(result, true);
  });

  it("should return true given backspace'", () => {
    const str = "\b";
    const result = isSkippable(str);
    assertEquals(result, true);
  });
});
