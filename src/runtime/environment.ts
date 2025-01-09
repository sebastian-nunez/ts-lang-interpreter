import {
  newBoolean,
  newNativeFn,
  newNull,
  newNumber,
  RuntimeVal,
} from "./values.ts";

export default class Environment {
  private variables: Map<string, RuntimeVal>;
  private constants: Set<string>;
  private parent?: Environment;

  constructor(parent?: Environment) {
    this.variables = new Map<string, RuntimeVal>();
    this.constants = new Set<string>();
    this.parent = parent;
  }

  // declareVar declares a new environment variables. Throws an Error if the varName already exists.
  declareVar(
    varName: string,
    value: RuntimeVal,
    isConstant: boolean = false
  ): RuntimeVal {
    if (this.variables.has(varName)) {
      throw new Error(`can not declare '${varName}' since it already exists`);
    }

    this.variables.set(varName, value);
    if (isConstant) {
      this.constants.add(varName);
    }

    return value;
  }

  // assignVar assigns an existing environment variable a new value. Throws an Error if the varName does not exist.
  assignVar(varName: string, value: RuntimeVal): RuntimeVal {
    const env = this.resolveEnv(varName); //  Throws

    if (env.constants.has(varName)) {
      throw new Error(
        `cannot reassign to variable '${varName}' as it was declared constant`
      );
    }

    env.variables.set(varName, value);
    return value;
  }

  // assignVar retrieves an existing environment variable. Throws an Error if the varName does not exist.
  lookupVar(varname: string): RuntimeVal {
    const env = this.resolveEnv(varname); // Throws
    return env.variables.get(varname)!;
  }

  // resolveEnv attempts to recursively find the environment the varName belongs to by climbing the parent chain.
  // Throws an Error if no parent environment was found.
  resolveEnv(varName: string): Environment {
    if (this.variables.has(varName)) {
      return this;
    }

    if (!this.parent) {
      throw new Error(
        `can not resolve '${varName}' as it does not exists. No environment found`
      );
    }

    return this.parent?.resolveEnv(varName);
  }
}

/** createGlobalEnv creates an environment with the language-specific global variables declared */
export function createGlobalEnv(): Environment {
  const env = new Environment();

  // Global variables
  env.declareVar("true", newBoolean(true), true);
  env.declareVar("false", newBoolean(false), true);
  env.declareVar("null", newNull(), true);

  // Global functions
  env.declareVar(
    "print",
    newNativeFn((args: RuntimeVal[], _env: Environment): RuntimeVal => {
      console.log(...args);
      return newNull();
    }),
    true
  );
  env.declareVar(
    "time",
    newNativeFn((_args: RuntimeVal[], _env: Environment): RuntimeVal => {
      return newNumber(Date.now());
    }),
    true
  );

  return env;
}
