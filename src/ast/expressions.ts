import { Stmt } from "./statements.ts";

/**  Expr unlike statements, expressions result in a value at runtime.  */
export interface Expr extends Stmt {}

/**
 * BinaryExpr is operation with two sides separated by a operator.
 * The two sides can be any "complex expression".
 *
 * Supported operators: `+`, `-`, `/`, `*`, `%`
 */
export interface BinaryExpr extends Expr {
  kind: "BinaryExpr";
  left: Expr;
  right: Expr;
  operator: string;
}

/** IdentifierExpr represents a user-defined variable or symbol in source. */
export interface Identifier extends Expr {
  kind: "Identifier";
  symbol: string;
}

/** NumericLiteral represents a numeric constant inside the source code. */
export interface NumericLiteral extends Expr {
  kind: "NumericLiteral";
  value: number;
}

/** NullLiteral represents null inside the source code. */
export interface NullLiteral extends Expr {
  kind: "NullLiteral";
  value: "null";
}

// TODO: implement UnaryExpr, CallExpr
