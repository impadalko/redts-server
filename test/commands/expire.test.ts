import {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std@0.182.0/testing/asserts.ts";
import {
  afterEach,
  describe,
  it,
} from "https://deno.land/std@0.182.0/testing/bdd.ts";

import {
  returnsNext,
  Stub,
  stub,
} from "https://deno.land/std@0.186.0/testing/mock.ts";

import expireProcessor from "src/commands/expire.ts";
import storage from "src/storage.ts";
import inputLengthValidator from "src/commands/validators/inputLengthValidator.ts";
import notNullValidator from "src/commands/validators/notNullValidator.ts";
import { ErrorType } from "src/dataTypes.ts";

describe("Expire Processor", () => {
  let inputLengthValidatorStub: Stub;
  let notNullValidatorStub: Stub;
  let storageStub: Stub;

  const command = "set";
  const key = "key";
  const ttl = "10";
  const args = [key, ttl];

  afterEach(() => {
    if (inputLengthValidatorStub) inputLengthValidatorStub.restore();
    if (notNullValidatorStub) notNullValidatorStub.restore();
    if (storageStub) storageStub.restore();
  });

  it("should return an error when input length validator returns an error", () => {
    mockInputLengthValidator(new ErrorType(""));

    const output = expireProcessor.process(command, args);

    assertEquals(output.type, "error");
  });

  it("should return an error when not null validator returns an error for first arg", () => {
    mockInputLengthValidator(undefined);
    mockNotNullValidator([new ErrorType("")]);

    const output = expireProcessor.process(command, args);

    assertEquals(output.type, "error");
  });

  it("should return an error when not null validator returns an error for second arg", () => {
    mockInputLengthValidator(undefined);
    mockNotNullValidator([undefined, new ErrorType("")]);

    const output = expireProcessor.process(command, args);

    assertEquals(output.type, "error");
  });

  it("should return 1 if the storage returns true", () => {
    mockInputLengthValidator(undefined);
    mockNotNullValidator([undefined, undefined]);
    storageStub = stub(storage, "expire", () => true);

    const output = expireProcessor.process(command, args);

    assertEquals(output.type, "integer");
    assertStringIncludes(output.encode(), "1");
  });

  it("should return 0 if the storage returns false", () => {
    mockInputLengthValidator(undefined);
    mockNotNullValidator([undefined, undefined]);
    storageStub = stub(storage, "expire", () => false);

    const output = expireProcessor.process(command, args);

    assertEquals(output.type, "integer");
    assertStringIncludes(output.encode(), "0");
  });

  const mockInputLengthValidator = (returnValue: ErrorType | undefined) => {
    inputLengthValidatorStub = stub(
      inputLengthValidator,
      "validate",
      () => returnValue,
    );
  };

  const mockNotNullValidator = (returnValues: (ErrorType | undefined)[]) => {
    notNullValidatorStub = stub(
      notNullValidator,
      "validate",
      returnsNext(returnValues),
    );
  };
});
