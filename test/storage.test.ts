import { assertEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { describe, it } from "https://deno.land/std@0.182.0/testing/bdd.ts";

import storage from "src/storage.ts";

describe("Storage", () => {
  const absentKey = "absentKey";
  const presentKey = "presentKey";
  const storedValue = "aValue";

  it("Get returns undefined when no value is set", () => {
    const value = storage.get(absentKey);

    assertEquals(value, undefined);
  });

  it("Get returns the value previously set", () => {
    storage.set(presentKey, storedValue);
    const value = storage.get(presentKey);

    assertEquals(value, storedValue);
  });

  it("Del returns true when deleting a present key", () => {
    storage.set(presentKey, storedValue);
    const value = storage.del(presentKey);

    assertEquals(value, true);
  });

  it("Del returns false when deleting an absent key", () => {
    const value = storage.del(absentKey);

    assertEquals(value, false);
  });
});
