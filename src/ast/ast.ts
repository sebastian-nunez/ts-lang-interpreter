/** AstNode represents a single node within the abstract syntax tree (AST) */
export type AstNode =
  | "Program"
  | "NumericLiteral"
  | "NullLiteral"
  | "Identifier"
  | "BinaryExpr"
  | "UnaryExpr"
  | "CallExpr"
  | "FunctionDeclaration";
