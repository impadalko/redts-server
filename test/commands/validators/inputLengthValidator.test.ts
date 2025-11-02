import {
  assertEquals,
  assertNotEquals,
} from "@deno/std@0.182.0/testing/asserts.ts";
import { describe, it } from "@deno/std@0.182.0/testing/bdd.ts";

import validator from "@src/commands/validators/inputLengthValidator.ts";

describe("Input Length Validator", () => {
  it("should return an error when the input length is smaller than expected", () => {
    const output = validator.validate("", [], 1);

    assertNotEquals(output, undefined);
    assertEquals(output!.type, "error");
  });

  it("should return undefined when the input length is equal to expected", () => {
    const output = validator.validate("", ["arg"], 1);

    assertEquals(output, undefined);
  });

  it("should return undefined when the input length is greater than expected", () => {
    const output = validator.validate("", ["arg1", "arg2"], 1);

    assertEquals(output, undefined);
  });
});
