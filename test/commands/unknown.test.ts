import { assertEquals } from "@deno/std@0.182.0/testing/asserts.ts";
import { describe, it } from "@deno/std@0.182.0/testing/bdd.ts";

import unknownProcessor from "@src/commands/unknown.ts";

describe("Unknown Processor", () => {
  it("should return an error containing the command", () => {
    const output = unknownProcessor.process("COMMAND", []);

    assertEquals(output.type, "error");
    assertEquals(output.payload, "Unknown command COMMAND");
  });
});
