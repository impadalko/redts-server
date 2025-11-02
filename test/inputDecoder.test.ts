import { assertEquals } from "@deno/std@0.182.0/testing/asserts.ts";
import { describe, it } from "@deno/std@0.182.0/testing/bdd.ts";

import InputDecoder from "@src/inputDecoder.ts";

describe("Input decoder", () => {
  const textEncoder = new TextEncoder();
  const inputDecoder = new InputDecoder();

  it("should decode an empty input as an empty array", () => {
    const decoded = inputDecoder.decode([]);

    assertEquals(decoded, []);
  });

  it("should decode a malformed input as a plain string", () => {
    const decoded = inputDecoder.decode([
      textEncoder.encode("Plain string input"),
    ]);

    assertEquals(decoded, ["Plain", "string", "input"]);
  });

  it("should remove trailing CRLF from a malformed input", () => {
    const decoded = inputDecoder.decode([
      textEncoder.encode("Plain string input\r\n"),
    ]);

    assertEquals(decoded, ["Plain", "string", "input"]);
  });

  it("should decode an array with a null bulk string correctly", () => {
    const decoded = inputDecoder.decode([
      textEncoder.encode("*1\r\n$-1\r\n"),
    ]);

    assertEquals(decoded, [null]);
  });

  it("should decode an array with one bulk string correctly", () => {
    const decoded = inputDecoder.decode([
      textEncoder.encode("*1\r\n$10\r\nBulkString\r\n"),
    ]);

    assertEquals(decoded, ["BulkString"]);
  });

  it("should decode an array with one bulk string with the separator (\\r\\n) in it correctly", () => {
    const decoded = inputDecoder.decode([
      textEncoder.encode("*1\r\n$12\r\nBulk\r\nString\r\n"),
    ]);

    assertEquals(decoded, ["Bulk\r\nString"]);
  });

  it("should decode an array with multiple strings correctly", () => {
    const decoded = inputDecoder.decode([
      textEncoder.encode("*3\r\n$4\r\nTest\r\n$6\r\nString\r\n$-1\r\n"),
    ]);

    assertEquals(decoded, ["Test", "String", null]);
  });
});
