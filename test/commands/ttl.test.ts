import {
  assertEquals,
  assertStringIncludes,
} from "@deno/std@0.182.0/testing/asserts.ts";
import { afterEach, describe, it } from "@deno/std@0.182.0/testing/bdd.ts";

import { Stub, stub } from "@deno/std@0.186.0/testing/mock.ts";

import ttlProcessor from "@src/commands/ttl.ts";
import storage from "@src/storage.ts";
import inputLengthValidator from "@src/commands/validators/inputLengthValidator.ts";
import notNullValidator from "@src/commands/validators/notNullValidator.ts";
import { ErrorType } from "@src/dataTypes.ts";

describe("TTL Processor", () => {
  let inputLengthValidatorStub: Stub;
  let notNullValidatorStub: Stub;
  let storageStub: Stub;

  const command = "get";
  const args = ["key"];
  const returnedValue = 1;

  afterEach(() => {
    if (inputLengthValidatorStub) inputLengthValidatorStub.restore();
    if (notNullValidatorStub) notNullValidatorStub.restore();
    if (storageStub) storageStub.restore();
  });

  it("should return an error when input length validator returns an error", () => {
    mockInputLengthValidator(new ErrorType(""));

    const output = ttlProcessor.process(command, args);

    assertEquals(output.type, "error");
  });

  it("should return an error when not null validator returns an error", () => {
    mockInputLengthValidator(undefined);
    mockNotNullValidator(new ErrorType(""));

    const output = ttlProcessor.process(command, args);

    assertEquals(output.type, "error");
  });

  it("should return the value returned by storage", () => {
    mockInputLengthValidator(undefined);
    mockNotNullValidator(undefined);
    storageStub = stub(storage, "ttl", () => returnedValue);

    const output = ttlProcessor.process(command, args);

    assertEquals(output.type, "integer");
    assertStringIncludes(output.encode(), returnedValue.toString());
  });

  const mockInputLengthValidator = (returnValue: ErrorType | undefined) => {
    inputLengthValidatorStub = stub(
      inputLengthValidator,
      "validate",
      () => returnValue,
    );
  };

  const mockNotNullValidator = (returnValue: ErrorType | undefined) => {
    notNullValidatorStub = stub(
      notNullValidator,
      "validate",
      () => returnValue,
    );
  };
});
