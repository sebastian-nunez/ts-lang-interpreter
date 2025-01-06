import { AstNode } from "./ast.ts";

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
