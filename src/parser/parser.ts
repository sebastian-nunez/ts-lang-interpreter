import { Expr, Identifier, NumericLiteral } from "../ast/expressions.ts";
import { Program, Stmt } from "../ast/statements.ts";
import { tokenize } from "../lexer/lexer.ts";
import { Token, TokenType } from "../lexer/token.ts";

/** Parser is the frontend for producing a valid AST from source code. */
export default class Parser {
  private tokens: Token[] = [];

  produceAST(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode);
    const program: Program = {
      kind: "Program",
      body: [],
    };

    while (!this.at_eof()) {
      program.body.push(this.parse_stmt());
    }

    return program;
  }

  /** parse_stmt handle complex statement types */
  private parse_stmt(): Stmt {
    // TODO: add FunctionaDeclaration, TryCatch, VariableDeclaration, Loops
    // For now, skip to parse_expr
    return this.parse_expr();
  }

  /** parse_expr handle expressions.
   *
   *  Orders of precedence:
   *  1. AdditiveExpr
   *  2. MultiplicativeExpr
   *  3. PrimaryExpr
   */
  private parse_expr(): Expr {
    // TODO: implement
    return this.parse_additive_expr();
  }

  /** parse_additive_expr handles addition and subtraction operations */
  private parse_additive_expr(): Expr {
    // TODO: implement
    return this.parse_multiplicative_expr();
  }

  /** parse_multiplicative_expr handles multiplication, division & modulo operations */
  private parse_multiplicative_expr(): Expr {
    // TODO: implement
    return this.parse_primary_expr();
  }

  /** parse_primary_expr parse literal values & grouping expressions. Throws errors. */
  private parse_primary_expr(): Expr {
    const token = this.at();

    switch (token.type) {
      case TokenType.Identifier: {
        const identifier: Identifier = {
          kind: "Identifier",
          symbol: this.next().value,
        };
        return identifier;
      }
      case TokenType.Number: {
        let value;
        try {
          value = parseFloat(this.next().value);
        } catch (e) {
          console.error(`Unable to parse the current token as a float: ${e}`);
          Deno.exit(1);
        }

        const number: NumericLiteral = {
          kind: "NumericLiteral",
          value,
        };
        return number;
      }
      default:
        console.error(
          `Unexpected token found during parsing: ${JSON.stringify(this.at())}`
        );
        Deno.exit(1);
    }
  }

  /** next consumes the current token and advances the tokens array to the next value */
  private next(): Token {
    const prev = this.tokens.shift();
    return prev!;
  }

  /** at returns the currently available token */
  private at(): Token {
    return this.tokens[0];
  }

  /** at_eof determines if the parsing is complete and the end of file (EOF) has been reached. */
  private at_eof(): boolean {
    return this.at().type === TokenType.EOF;
  }
}
