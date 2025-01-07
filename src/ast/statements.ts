import { AstNode } from "./ast.ts";
import { Expr } from "./expressions.ts";

/**
 * Stmt statements are not resolved to a value at runtime.
 * They contain one of more expressions internally.
 */
export interface Stmt {
  kind: AstNode;
}

/**
 * Represents the top-level program structure:
 * - Consists of a sequence of statements
 * - Only one program will be contained in a file
 */
export interface Program extends Stmt {
  kind: "Program";
  body: Stmt[];
}

/**
 * Represents a variable declaration with or without initializing to a value.
 * Declared variables can be mark as constant.
 */
export interface VariableDeclaration extends Stmt {
  kind: "VariableDeclaration";
  constant: boolean;
  identifier: string;
  value?: Expr; // Variables can be declared and initialized later (e.g. let x;)
}
