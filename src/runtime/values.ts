/** ValueType represents the types of values encountered at runtime */
export type ValueType = "null" | "number" | "boolean";

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

/** NumberVal runtime value that has access to the raw native JavasScript number type */
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

/** BooleanVal runtime value that has access to the raw native JavasScript boolean type */
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
