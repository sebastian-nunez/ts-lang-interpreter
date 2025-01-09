import {
  AssignmentExpr,
  BinaryExpr,
  CallExpr,
  Expr,
  Identifier,
  MemberExpr,
  NumericLiteral,
  ObjectLiteral,
  PropertyLiteral,
  StringLiteral,
} from "../ast/expressions.ts";
import {
  FunctionDeclaration,
  Program,
  Stmt,
  VariableDeclaration,
} from "../ast/statements.ts";
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
    // TODO: add TryCatch, Loops, etc.
    // For now, skip to parse_expr
    switch (this.at().type) {
      case TokenType.Let:
      case TokenType.Const:
        return this.parse_var_declaration();
      case TokenType.Fn:
        return this.parse_function_declaration();
      default:
        return this.parse_expr();
    }
  }

  /** parse_var_declaration parses let and const variable declarations. Variations:
   *   - Declare: `let x;`
   *   - Declare and initialize: `(let | const) x = expression;`
   *  Throws errors.
   */
  private parse_var_declaration(): Stmt {
    const isConstant = this.next().type === TokenType.Const;
    const identifier = this.next_expect(
      TokenType.Identifier,
      "Expected identifier name following `let` or `const` keyword"
    ).value;

    if (this.at().type === TokenType.SemiColon) {
      // Variable declaration, no assignment
      this.next();
      if (isConstant) {
        throw new Error(
          "must assign value to constant expression. No value provided"
        );
      }

      return {
        kind: "VariableDeclaration",
        identifier,
        constant: false,
        value: undefined,
      } as VariableDeclaration;
    }

    this.next_expect(
      TokenType.Equals,
      "expected equals token after variable declaration with assignment"
    );

    const declaration: VariableDeclaration = {
      kind: "VariableDeclaration",
      identifier,
      constant: isConstant,
      value: this.parse_expr(),
    };
    this.next_expect(
      TokenType.SemiColon,
      "variable declaration statement must end with semicolon"
    );

    return declaration;
  }

  /** parse_function_declaration parses variable declaration using the `fn` keyword. Throws errors. */
  private parse_function_declaration(): Stmt {
    this.next(); // Consume `fn` keyword
    const name = this.next_expect(
      TokenType.Identifier,
      "expected function name following `fn` keyword"
    ).value;

    if (this.at().type !== TokenType.OpenParen) {
      throw new Error("expected open paren following function name");
    }

    const args = this.parse_function_args();
    const params: string[] = [];
    for (const arg of args) {
      if (arg.kind !== "Identifier") {
        console.log(arg);
        throw new Error(
          "inside function declaration expected parameters to be of type string."
        );
      }

      params.push((arg as Identifier).symbol);
    }

    this.next_expect(
      TokenType.OpenBrace,
      "Expected function body following declaration"
    );
    const body: Stmt[] = [];
    while (!this.at_eof() && this.at().type !== TokenType.ClosedBrace) {
      body.push(this.parse_stmt());
    }
    this.next_expect(
      TokenType.ClosedBrace,
      "closing brace expected inside function declaration"
    );

    const fn: FunctionDeclaration = {
      kind: "FunctionDeclaration",
      name,
      params,
      body,
    };
    return fn;
  }

  /**
   * parse_expr handles expressions.
   *
   * Orders of precedence (from lowest to highest):
   *
   *  - AssignmentExpr
   *  - ObjectExpr
   *  - LogicalExpr
   *  - ComparisonExpr
   *  - AdditiveExpr
   *  - MultiplicativeExpr
   *  - MemberCallExpr
   *  - CallExpr
   *  - MemberExpr
   *  - UnaryExpr
   *  - PrimaryExpr
   *
   * Note: Lower numbers indicate higher precedence. This means PrimaryExpr
   * has the highest precedence and AssignmentExpr has the lowest.
   */
  private parse_expr(): Expr {
    // TODO: implement
    return this.parse_assignment_expr();
  }

  /** parse_assignment_expr handles variable assignment expressions. e.g. `x = 2;` */
  private parse_assignment_expr(): Expr {
    const left = this.parse_object_expr();

    if (this.at().type === TokenType.Equals) {
      this.next(); // Advance past =
      const right = this.parse_assignment_expr();
      this.next_expect(
        TokenType.SemiColon,
        "expected semicolon after variable assignment expression"
      );

      const expr: AssignmentExpr = {
        kind: "AssignmentExpr",
        assignee: left,
        value: right,
      };
      return expr;
    }

    return left;
  }

  /**
   * parse_object_expr handles object creation.
   *
   *   - `const obj = { firstname: "Sebastian", lastname: "Nunez" }`
   *   - `const obj = { name }`
   */
  private parse_object_expr(): Expr {
    if (this.at().type !== TokenType.OpenBrace) {
      return this.parse_additive_expr();
    }

    this.next(); // advance past '{'
    const properties: PropertyLiteral[] = [];
    while (!this.at_eof() && this.at().type !== TokenType.ClosedBrace) {
      // Three cases to handle:
      // 1. `{ key }` OR `{ key, }`
      // 2. `{ key: value }`
      // 3. `{key1: val1, key2: val2 }`

      const key = this.next_expect(
        TokenType.Identifier,
        "object literal key expected"
      ).value;

      if (this.at().type == TokenType.Comma) {
        // Allows shorthand key: { key, }
        this.next(); // advance past comma
        properties.push({ kind: "PropertyLiteral", key });
        continue;
      } else if (this.at().type == TokenType.ClosedBrace) {
        // Allows shorthand key: { key }
        properties.push({ kind: "PropertyLiteral", key });
        continue;
      }

      // { key: val }
      this.next_expect(
        TokenType.Colon,
        "missing colon following identifier in ObjectExpr"
      );
      const value = this.parse_expr();

      properties.push({ kind: "PropertyLiteral", value, key });
      if (this.at().type != TokenType.ClosedBrace) {
        this.next_expect(
          TokenType.Comma,
          "expected comma or closing bracket following property"
        );
      }
    }

    this.next_expect(
      TokenType.ClosedBrace,
      "expected a closing brace at the end of an object expression"
    );
    return {
      kind: "ObjectLiteral",
      properties,
    } as ObjectLiteral;
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
    let left = this.parse_call_member_expr();

    while (
      this.at().value === "/" ||
      this.at().value === "*" ||
      this.at().value === "%"
    ) {
      const operator = this.next().value;
      const right = this.parse_call_member_expr();

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

  /**
   * parse_call_member_expr parses function call on an object with a member function
   * (e.g. `foo.Func()`). Allows us to recursively evaluate member expressions.
   *
   * Throws errors.
   */
  private parse_call_member_expr(): Expr {
    // foo.X () --> evaluate foo.X part
    const member = this.parse_member_access_expr();

    if (this.at().type === TokenType.OpenParen) {
      // Function call needed
      return this.parse_call_expr(member);
    }

    return member; // Just a member evaluation was needed: foo.X
  }

  /** parse_call_expr parses a call expression. Throws errors. */
  private parse_call_expr(caller: Expr): Expr {
    let callExpr: CallExpr = {
      kind: "CallExpr",
      caller,
      args: this.parse_function_args(),
    };

    // Recursively evaluate call expressions e.g. foo.Func1()() where Func1 returns a function to call.
    // Effectively, we can now chain the function calls.
    if (this.at().type == TokenType.OpenParen) {
      callExpr = this.parse_call_expr(callExpr) as CallExpr;
    }

    return callExpr;
  }

  /** parse_function_call_args parses arguments of function call. Throws errors. */
  private parse_function_args(): Expr[] {
    this.next_expect(
      TokenType.OpenParen,
      "expected open parenthesis when parsing function arguments"
    );

    const args: Expr[] =
      this.at().type === TokenType.ClosedParen
        ? [] // We have something like `func()` so no args
        : this.helper_parse_args_list();

    this.next_expect(
      TokenType.ClosedParen,
      "expected closed parenthesis after function arguments"
    );
    return args;
  }

  /** helper_parse_args_list is a helper function for parse_function_args. */
  private helper_parse_args_list(): Expr[] {
    // We can to allow something like `foo(x = 5, y = "Bar")` where we can assign variables THEN get their values as args.
    // This would first set `x = 5` and `y = "Bar"` in the outer scope.
    const args = [this.parse_assignment_expr()];

    // We are parsing a comma separated arguments list e.g. func(arg1, arg2, ...)
    // However, we already parsed `arg1` and should be at a comma
    while (this.at().type == TokenType.Comma && this.next()) {
      args.push(this.parse_assignment_expr());
    }

    return args;
  }

  /**
   * parse_member_access_expr parses a member access expression on an object.
   *
   * Member access can be either through the:
   *   - "Dot notation": `foo.bar`
   *   - "Bracket notation": `foo["bar"]` or `foo[ComputedVal()]`
   *
   * When using the "bracket notation", there is the possibility to have an inner
   * "computed" value (e.g. `foo[ComputedVal()]`, where `ComputedVal()` returns the key to be indexed.)
   *
   * Throws errors.
   */
  private parse_member_access_expr(): Expr {
    let obj = this.parse_primary_expr();

    while (
      this.at().type === TokenType.Dot ||
      this.at().type === TokenType.OpenBracket
    ) {
      const operator = this.next(); // "." or "["
      const isComputed = operator.type === TokenType.OpenBracket;
      let property: Expr; // Member being access

      if (isComputed) {
        // this allows obj[ComputedValue()]
        property = this.parse_expr(); // Inner value must be computed first

        this.next_expect(
          TokenType.ClosedBracket,
          "missing closing bracket in computed value"
        );
      } else {
        // non-computed values aka foo.Bar
        property = this.parse_primary_expr(); // for `foo.Bar` get the "Bar"

        // We need to verify the items parsed, form a valid identifier
        if (property.kind !== "Identifier") {
          throw `can not use dot operator without right hand side being a identifier`;
        }
      }

      obj = {
        kind: "MemberExpr",
        object: obj,
        property,
        isComputed,
      } as MemberExpr;
    }

    return obj;
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
      case TokenType.String: {
        const str: StringLiteral = {
          kind: "StringLiteral",
          value: this.next().value,
        };
        return str;
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
      throw new Error(
        `Parser error:\n${error}, got ${JSON.stringify(
          prev
        )} - expected: ${type}`
      );
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
