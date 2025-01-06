import { RuntimeVal } from "./values.ts";

export default class Environment {
  private variables: Map<string, RuntimeVal>;
  private parent?: Environment;

  constructor(parent?: Environment) {
    this.variables = new Map<string, RuntimeVal>();
    this.parent = parent;
  }

  // declareVar declares a new environment variables. Throws an Error if the varName already exists.
  declareVar(varName: string, value: RuntimeVal): RuntimeVal {
    if (this.variables.has(varName)) {
      throw new Error(`can not declare '${varName}' since it already exists`);
    }

    this.variables.set(varName, value);
    return value;
  }

  // assignVar assigns an existing environment variable a new value. Throws an Error if the varName does not exist.
  assignVar(varName: string, value: RuntimeVal): RuntimeVal {
    const env = this.resolveEnv(varName); //  Throws
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
