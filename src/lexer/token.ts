/** TokenType represents all tokens parsable by the language */
export enum TokenType {
  // Literal Types
  Number,
  Identifier,

  // Keywords
  Let,

  // Grouping operators
  BinaryOperator,
  Equals,
  OpenParen,
  ClosedParen,
}

/** Token represents a single token from the source code */
export interface Token {
  value: string;
  type: TokenType;
}

/** newToken returns token of given value and type */
export function newToken(value: string = "", type: TokenType): Token {
  return { value, type };
}
