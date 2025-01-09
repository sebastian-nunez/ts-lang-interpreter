import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals } from "@std/assert";
import {
  newBoolean,
  newNull,
  newNumber,
  newObject,
  newString,
  RuntimeVal,
} from "./values.ts";

describe("newNull()", () => {
  it("should create a NullVal", () => {
    const nullVal = newNull();
    assertEquals(nullVal, { type: "null", value: null });
  });
});

describe("newNumber()", () => {
  it("should create a NumberVal with default value", () => {
    const numVal = newNumber();
    assertEquals(numVal, { type: "number", value: 0 });
  });

  it("should create a NumberVal with a specific value", () => {
    const numVal = newNumber(42);
    assertEquals(numVal, { type: "number", value: 42 });
  });
});

describe("newString()", () => {
  it("should create a StringVal with default value", () => {
    const strVal = newString();
    assertEquals(strVal, { type: "string", value: "" });
  });

  it("should create a StringVal with a specific value", () => {
    const strVal = newString("hello");
    assertEquals(strVal, { type: "string", value: "hello" });
  });
});

describe("newBoolean()", () => {
  it("should create a BooleanVal with default value", () => {
    const boolVal = newBoolean();
    assertEquals(boolVal, { type: "boolean", value: true });
  });

  it("should create a BooleanVal with a specific value", () => {
    const boolVal = newBoolean(false);
    assertEquals(boolVal, { type: "boolean", value: false });
  });
});

describe("newObject()", () => {
  it("should create an ObjectVal with default properties", () => {
    const objVal = newObject();
    assertEquals(objVal, { type: "object", properties: new Map() });
  });

  it("should create an ObjectVal with specific properties", () => {
    const properties = new Map<string, RuntimeVal>();
    properties.set("name", newString("John"));
    properties.set("age", newNumber(30));

    const objVal = newObject(properties);
    assertEquals(objVal, { type: "object", properties });
  });
});
