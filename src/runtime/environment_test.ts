import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import Environment from "./environment.ts";
import { NumberVal } from "./values.ts";

describe("Environment", () => {
  it("should declare a new variable", () => {
    const env = new Environment();
    const value: NumberVal = { value: 10, type: "number" };

    const declaredValue = env.declareVar("x", value);

    assertEquals(declaredValue, value);
  });

  it("should declare a new constant", () => {
    const env = new Environment();
    const value: NumberVal = { value: 2, type: "number" };

    env.declareVar("num", value, true);

    assertThrows(() =>
      env.assignVar("num", { value: 2, type: "number" } as NumberVal)
    );
  });

  it("should throw an error if declaring an existing variable", () => {
    const env = new Environment();
    const value: NumberVal = { value: 10, type: "number" };

    env.declareVar("x", value);

    assertThrows(() =>
      env.declareVar("x", { value: 20, type: "number" } as NumberVal)
    );
  });

  it("should assign a value to an existing variable", () => {
    const env = new Environment();
    const initialValue: NumberVal = { value: 10, type: "number" };

    env.declareVar("x", initialValue);
    const newValue: NumberVal = { value: 20, type: "number" };
    const assignedValue = env.assignVar("x", newValue);

    assertEquals(assignedValue, newValue);
    assertEquals(env.lookupVar("x"), newValue);
  });

  it("should throw an error if assigning to a non-existent variable", () => {
    const env = new Environment();

    assertThrows(() =>
      env.assignVar("y", { value: 30, type: "number" } as NumberVal)
    );
  });

  it("should lookup an existing variable", () => {
    const env = new Environment();
    const value: NumberVal = { value: 2, type: "number" };

    env.declareVar("num", value);

    const lookedUpValue = env.lookupVar("num");
    assertEquals(lookedUpValue, value);
  });

  it("should throw an error if looking up a non-existent variable", () => {
    const env = new Environment();
    assertThrows(() => env.lookupVar("z"));
  });

  it("should resolve variables in parent environments", () => {
    const parentEnv = new Environment();
    const parentValue: NumberVal = { value: 100, type: "number" };
    parentEnv.declareVar("parentVar", parentValue);

    const childEnv = new Environment(parentEnv);
    const childValue: NumberVal = { value: 999, type: "number" };
    childEnv.declareVar("childVar", childValue);

    assertEquals(parentEnv.lookupVar("parentVar"), parentValue);
    assertEquals(childEnv.lookupVar("childVar"), childValue);
    assertEquals(childEnv.lookupVar("parentVar"), parentValue);
    assertThrows(() => parentEnv.lookupVar("childVar"));
  });
});
