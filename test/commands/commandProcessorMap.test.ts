import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { describe, it } from "https://deno.land/std@0.182.0/testing/bdd.ts";

import commandProcessorMap from "src/commands/commandProcessorMap.ts";
import unknownProcessor from "src/commands/unknown.ts";

describe("Command Processor Map", () => {
  const bogusCommand = "BOGUS";
  const validCommand = "PING";

  it("should return unknown processor when command is not in the map", () => {
    const processor = commandProcessorMap.get(bogusCommand);

    assertEquals(processor, unknownProcessor);
  });

  it("should return the processor when command is known", () => {
    const processor = commandProcessorMap.get(validCommand);

    assertNotEquals(processor, unknownProcessor);
  });
});
