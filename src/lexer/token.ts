/** TokenType represents all tokens parsable by the language */
export enum TokenType {
  // Literal Types
  Number,
  Identifier,

  // Keywords
  Let,
  Const,

  // Grouping operators
  BinaryOperator,
  Equals,
  Comma,
  Colon,
  SemiColon,
  OpenBrace,
  ClosedBrace,
  OpenParen,
  ClosedParen,
  OpenBracket,
  ClosedBracket,
  EOF,
}

/** Token represents a single token from the source code */
export interface Token {
  type: TokenType;
  value: string;
}

/** newToken returns token of given value and type */
export function newToken(type: TokenType, value: string = ""): Token {
  return { type, value };
}
