/** ValueType represents the types of values encountered at runtime */
export type ValueType = "null" | "number" | "identifier";

/** RuntimeVal represents a value encountered at runtime */
export interface RuntimeVal {
  type: ValueType;
}

/** NullVal defines a value of undefined meaning */
export interface NullVal extends RuntimeVal {
  type: "null";
  value: null;
}

/** NumberVal runtime value that has access to the raw native JavasScript number type */
export interface NumberVal extends RuntimeVal {
  type: "number";
  value: number;
}
