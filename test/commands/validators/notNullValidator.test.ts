import {
  assertEquals,
  assertNotEquals,
} from "@deno/std@0.182.0/testing/asserts.ts";
import { describe, it } from "@deno/std@0.182.0/testing/bdd.ts";

import validator from "@src/commands/validators/notNullValidator.ts";

describe("Not Null Validator", () => {
  it("should return an error when the argument is null", () => {
    const output = validator.validate(null, "arg");

    assertNotEquals(output, undefined);
    assertEquals(output!.type, "error");
  });

  it("should return undefined when the argument is not null", () => {
    const output = validator.validate("notNull", "arg");

    assertEquals(output, undefined);
  });
});
