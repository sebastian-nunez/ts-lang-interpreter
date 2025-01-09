import { isAlpha, isInt, isSkippable } from "../utils/strings.ts";
import { newToken, Token, TokenType } from "./token.ts";

/** KEYWORDS is a constant lookup for keywords and known identifiers + symbols */
const KEYWORDS: Record<string, TokenType> = {
  // Keys are case-sensitive
  let: TokenType.Let,
  const: TokenType.Const,
  fn: TokenType.Fn,
};

/** tokenize receives source code and returns all the extracted tokens. Throws an error if any token is not recognized */
export function tokenize(sourceCode: string): Token[] {
  const tokens: Token[] = [];
  const src = sourceCode.split("");

  // TODO: this is NOT a memory efficient implementation! shift() on it's own is expensive, regardless, just learning :)
  while (src.length > 0) {
    if (src[0] === "(") {
      tokens.push(newToken(TokenType.OpenParen, src.shift()));
    } else if (src[0] === ")") {
      tokens.push(newToken(TokenType.ClosedParen, src.shift()));
    } else if (src[0] === "{") {
      tokens.push(newToken(TokenType.OpenBrace, src.shift()));
    } else if (src[0] === "}") {
      tokens.push(newToken(TokenType.ClosedBrace, src.shift()));
    } else if (src[0] === "[") {
      tokens.push(newToken(TokenType.OpenBracket, src.shift()));
    } else if (src[0] === "]") {
      tokens.push(newToken(TokenType.ClosedBracket, src.shift()));
    } else if (
      src[0] === "+" ||
      src[0] === "-" ||
      src[0] === "*" ||
      src[0] === "/" ||
      src[0] === "%"
    ) {
      tokens.push(newToken(TokenType.BinaryOperator, src.shift()));
    } else if (src[0] === "=") {
      tokens.push(newToken(TokenType.Equals, src.shift()));
    } else if (src[0] === ";") {
      tokens.push(newToken(TokenType.SemiColon, src.shift()));
    } else if (src[0] === ":") {
      tokens.push(newToken(TokenType.Colon, src.shift()));
    } else if (src[0] === ",") {
      tokens.push(newToken(TokenType.Comma, src.shift()));
    } else if (src[0] === ".") {
      tokens.push(newToken(TokenType.Dot, src.shift()));
    } else if (src[0] === '"') {
      src.shift(); // Consume open quotation

      // TODO: add escape sequence support
      const strArr = [];
      while (src.length > 0 && src[0] !== '"') {
        strArr.push(src.shift());
      }

      src.shift(); // Consume close quotation
      tokens.push(newToken(TokenType.String, strArr.join("")));
    } else {
      // Handle multi-character tokens
      if (isInt(src[0])) {
        let num = "";
        while (src.length > 0 && isInt(src[0])) {
          num += src.shift();
        }
        tokens.push(newToken(TokenType.Number, num));
      } else if (isAlpha(src[0])) {
        const identifierArr = [];
        while (src.length > 0 && isAlpha(src[0])) {
          identifierArr.push(src.shift());
        }
        const identifier = identifierArr.join("");

        // TokenType is an enum, so values are represented as numbers
        const reservedToken = KEYWORDS[identifier];
        if (typeof reservedToken === "number") {
          tokens.push(newToken(reservedToken, identifier));
        } else {
          tokens.push(newToken(TokenType.Identifier, identifier));
        }
      } else if (isSkippable(src[0])) {
        src.shift();
      } else {
        const char = src[0]; // Store the invalid character
        const charCode = char.charCodeAt(0);
        console.error(
          `Unrecognized token found in source code: ${charCode} -> '${char}'`
        );
        Deno.exit(1);
      }
    }
  }

  tokens.push(newToken(TokenType.EOF, "EOF"));
  return tokens;
}
