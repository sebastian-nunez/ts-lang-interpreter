/** NodeType represents a single node within the abstract syntax tree (AST) */
export type NodeType =
  | "Program"
  | "NumericLiteral"
  | "NullLiteral"
  | "Identifier"
  | "BinaryExpr"
  | "UnaryExpr"
  | "CallExpr"
  | "FunctionDeclaration";
