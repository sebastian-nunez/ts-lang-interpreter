import { Stmt } from "./statements.ts";

/**  Expr unlike statements, expressions result in a value at runtime.  */
export interface Expr extends Stmt {}

/** AssignmentExpr represents a user-defined variable or symbol in source. */
export interface AssignmentExpr extends Expr {
  kind: "AssignmentExpr";
  assignee: Expr; // By making it a Expr, we can do this like `x.foo = bar`
  value: Expr;
}

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

/** PropertyLiteral represents a property of an object within the source code. e.g. `person.firstname` */
export interface PropertyLiteral extends Expr {
  kind: "PropertyLiteral";
  key: string;
  value?: Expr; // Allow short-hand declarations. e.g. `{ key: key }` === `{ key }`
}

/** ObjectLiteral represents an object within the source code. e.g. `const person = { firstname: "Sebastian" }` */
export interface ObjectLiteral extends Expr {
  kind: "ObjectLiteral";
  properties: PropertyLiteral[];
}

// TODO: implement UnaryExpr, CallExpr
