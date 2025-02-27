/** AstNode represents a single node within the abstract syntax tree (AST) */
export type AstNode =
  // Statements
  | "Program"
  | "VariableDeclaration"
  | "FunctionDeclaration"

  // Expressions
  | "AssignmentExpr"
  | "MemberExpr"
  | "NumericLiteral"
  | "StringLiteral"
  | "ObjectLiteral"
  | "PropertyLiteral"
  | "Identifier"
  | "BinaryExpr"
  | "UnaryExpr"
  | "CallExpr"
  | "FunctionDeclaration";
