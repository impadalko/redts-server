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

  it("Exists returns true when querying a present key", () => {
    storage.set(presentKey, storedValue);
    const value = storage.exists(presentKey);

    assertEquals(value, true);
  });

  it("Exists returns false when querying an absent key", () => {
    const value = storage.exists(absentKey);

    assertEquals(value, false);
  });

  it("Expire returns false when updating an absent key", () => {
    const value = storage.expire(absentKey, 0);

    assertEquals(value, false);
  });

  it("Expire sets the ttl when updating a present key", () => {
    storage.set(presentKey, storedValue);
    const value = storage.expire(presentKey, 10);
    assertEquals(value, true);

    const ttl = storage.ttl(presentKey);
    assertEquals(ttl > 0 && ttl <= 10, true);
  });

  it("Key expires after ttl", async () => {
    storage.set(presentKey, storedValue);
    storage.expire(presentKey, 1);

    let value = storage.get(presentKey);
    assertEquals(value, storedValue);

    await new Promise((resolve) => setTimeout(resolve, 1100));

    value = storage.get(presentKey);
    assertEquals(value, undefined);
  });

  it("TTL returns -2 when querying an absent key", () => {
    const value = storage.ttl(absentKey);

    assertEquals(value, -2);
  });

  it("TTL returns -1 when querying a present key without ttl", () => {
    storage.set(presentKey, storedValue);
    const value = storage.ttl(presentKey);

    assertEquals(value, -1);
  });
});
