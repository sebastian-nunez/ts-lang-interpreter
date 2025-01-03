import { assert } from "@std/assert/assert";

/** isAlpha returns true is the character given an alphabetical letter */
export function isAlpha(char: string): boolean {
  assert(char.length === 1, "character length must equal 1");
  char = char.toLowerCase();
  return char >= "a" && char <= "z";
}

/** isInt returns true is the character given an integer */
export function isInt(char: string): boolean {
  assert(char.length === 1, "character length must equal 1");
  return char >= "0" && char <= "9";
}

/** isSkippable returns true if the character is whitespace like -> [\s, \t, \n, \r, \b] */
export function isSkippable(str: string): boolean {
  return (
    str === " " || str === "\n" || str === "\t" || str === "\r" || str === "\b"
  );
}
