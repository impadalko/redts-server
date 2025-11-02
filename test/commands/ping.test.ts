import { assertEquals } from "@deno/std@0.182.0/testing/asserts.ts";
import { describe, it } from "@deno/std@0.182.0/testing/bdd.ts";

import pingProcessor from "@src/commands/ping.ts";

describe("Ping Processor", () => {
  it("should return a simple string containing pong", () => {
    const output = pingProcessor.process("", []);

    assertEquals(output.type, "simpleString");
    assertEquals(output.payload, "PONG");
  });
});
