import Environment from "./environment.ts";

/** ValueType represents the types of values encountered at runtime */
export type ValueType =
  | "null"
  | "number"
  | "string"
  | "boolean"
  | "object"
  | "nativeFn";

/** RuntimeVal represents a value encountered at runtime */
export interface RuntimeVal {
  type: ValueType;
}

/** NullVal defines a value of undefined meaning */
export interface NullVal extends RuntimeVal {
  type: "null";
  value: null;
}
export function newNull(): NullVal {
  return {
    type: "null",
    value: null,
  };
}

/** NumberVal runtime value that has access to the raw native JavaScript number type */
export interface NumberVal extends RuntimeVal {
  type: "number";
  value: number;
}
export function newNumber(value: number = 0): NumberVal {
  return {
    type: "number",
    value,
  };
}

/** StringVal runtime value that has access to the raw native JavaScript string type */
export interface StringVal extends RuntimeVal {
  type: "string";
  value: string;
}
export function newString(value: string = ""): StringVal {
  return {
    type: "string",
    value,
  };
}

/** BooleanVal runtime value that has access to the raw native JavaScript boolean type */
export interface BooleanVal extends RuntimeVal {
  type: "boolean";
  value: boolean;
}
export function newBoolean(value: boolean = true): BooleanVal {
  return {
    type: "boolean",
    value,
  };
}

/** ObjectVal runtime value that has access to the raw native JavasScript object type */
export interface ObjectVal extends RuntimeVal {
  type: "object";
  properties: Map<string, RuntimeVal>;
}
export function newObject(
  properties = new Map<string, RuntimeVal>()
): ObjectVal {
  return {
    type: "object",
    properties,
  };
}

/** FunctionCall represents a callable function at runtime. */
export type FunctionCall = (args: RuntimeVal[], env: Environment) => RuntimeVal;

/**  NativeFnVal is a runtime native function defined in the global scope of the program. */
export interface NativeFnVal extends RuntimeVal {
  type: "nativeFn";
  call: FunctionCall;
}
export function newNativeFn(call: FunctionCall): NativeFnVal {
  return {
    type: "nativeFn",
    call,
  };
}
