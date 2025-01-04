import {
  BinaryExpr,
  Expr,
  Identifier,
  NullLiteral,
  NumericLiteral,
} from "../ast/expressions.ts";
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
    // TODO: add FunctionDeclaration, TryCatch, VariableDeclaration, Loops, etc.
    // For now, skip to parse_expr
    return this.parse_expr();
  }

  /**
   * parse_expr handles expressions.
   *
   * Orders of precedence (from lowest to highest):
   *
   *  - AssignmentExpr
   *  - MemberExpr
   *  - FunctionCall
   *  - LogicalExpr
   *  - ComparisonExpr
   *  - AdditiveExpr
   *  - MultiplicativeExpr
   *  - UnaryExpr
   *  - PrimaryExpr
   *
   * Note: Lower numbers indicate higher precedence. This means PrimaryExpr
   * has the highest precedence and AssignmentExpr has the lowest.
   */
  private parse_expr(): Expr {
    // TODO: implement
    return this.parse_additive_expr();
  }

  /**
   * parse_additive_expr handles addition and subtraction operations.
   *
   * Implements left-hand precedence. So, `10 + 5 - 5` is treated as `(10 + 5) - 5`,
   * where the items in the parenthesis is actually its own additive expression.
   */
  private parse_additive_expr(): Expr {
    let left = this.parse_multiplicative_expr();

    while (this.at().value === "+" || this.at().value === "-") {
      const operator = this.next().value;
      const right = this.parse_multiplicative_expr();

      // Keep parsing the left side recursively
      const expr: BinaryExpr = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      };
      left = expr;
    }

    return left;
  }

  /** parse_multiplicative_expr handles multiplication, division & modulo operations */
  private parse_multiplicative_expr(): Expr {
    let left = this.parse_primary_expr();

    while (
      this.at().value === "/" ||
      this.at().value === "*" ||
      this.at().value === "%"
    ) {
      const operator = this.next().value;
      const right = this.parse_primary_expr();

      // Keep parsing the left side recursively
      const expr: BinaryExpr = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      };
      left = expr;
    }

    return left;
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
      case TokenType.Null: {
        this.next(); // advance past "null"
        const nullLiteral: NullLiteral = {
          kind: "NullLiteral",
          value: "null",
        };
        return nullLiteral;
      }
      case TokenType.OpenParen: {
        // Open parenthesis, indicates we have another inner expression to evaluate
        this.next(); // Open parenthesis
        const value = this.parse_expr(); // Inner expression
        this.next_expect(TokenType.ClosedParen, "Unmatched parenthesis"); // Closing parenthesis
        return value;
      }
      default:
        console.error(
          `Unexpected token found during parsing: ${JSON.stringify(
            this.at(),
            null,
            2
          )}`
        );
        Deno.exit(1);
    }
  }

  /** next consumes the current token and advances the tokens array to the next value */
  private next(): Token {
    const prev = this.tokens.shift() as Token;
    return prev;
  }

  /**
   * next_expect returns the current token and then advances the tokens array to the next value,
   * while checking the type of expected token.
   *
   * Exits the program if the values do not match.
   */
  private next_expect(type: TokenType, error: string | Error) {
    const prev = this.tokens.shift() as Token;
    if (!prev || prev.type !== type) {
      console.error(
        `Parser error:\n${error}, got ${JSON.stringify(
          prev
        )} - expected: ${type}`
      );
      Deno.exit(1);
    }

    return prev;
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
