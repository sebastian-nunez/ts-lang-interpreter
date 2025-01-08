/** AstNode represents a single node within the abstract syntax tree (AST) */
export type AstNode =
  // Statements
  | "Program"
  | "VariableDeclaration"

  // Expressions
  | "AssignmentExpr"
  | "NumericLiteral"
  | "ObjectLiteral"
  | "PropertyLiteral"
  | "Identifier"
  | "BinaryExpr"
  | "UnaryExpr"
  | "CallExpr"
  | "FunctionDeclaration";
