import {
  assertEquals,
  assertStringIncludes,
} from "@deno/std@0.182.0/testing/asserts.ts";
import { afterEach, describe, it } from "@deno/std@0.182.0/testing/bdd.ts";

import { returnsNext, Stub, stub } from "@deno/std@0.186.0/testing/mock.ts";

import setProcessor from "@src/commands/set.ts";
import storage from "@src/storage.ts";
import inputLengthValidator from "@src/commands/validators/inputLengthValidator.ts";
import notNullValidator from "@src/commands/validators/notNullValidator.ts";
import { ErrorType } from "@src/dataTypes.ts";

describe("Set Processor", () => {
  let inputLengthValidatorStub: Stub;
  let notNullValidatorStub: Stub;
  let storageStub: Stub;

  const command = "set";
  const key = "key";
  const storedValue = "storedValue";
  const args = [key, storedValue];

  afterEach(() => {
    if (inputLengthValidatorStub) inputLengthValidatorStub.restore();
    if (notNullValidatorStub) notNullValidatorStub.restore();
    if (storageStub) storageStub.restore();
  });

  it("should return an error when input length validator returns an error", () => {
    mockInputLengthValidator(new ErrorType(""));

    const output = setProcessor.process(command, args);

    assertEquals(output.type, "error");
  });

  it("should return an error when not null validator returns an error for first arg", () => {
    mockInputLengthValidator(undefined);
    mockNotNullValidator([new ErrorType("")]);

    const output = setProcessor.process(command, args);

    assertEquals(output.type, "error");
  });

  it("should return an error when not null validator returns an error for second arg", () => {
    mockInputLengthValidator(undefined);
    mockNotNullValidator([undefined, new ErrorType("")]);

    const output = setProcessor.process(command, args);

    assertEquals(output.type, "error");
  });

  it("should return an ok string after calling storage", () => {
    mockInputLengthValidator(undefined);
    mockNotNullValidator([undefined, undefined]);
    storageStub = stub(storage, "set");

    const output = setProcessor.process(command, args);

    assertEquals(output.type, "simpleString");
    assertStringIncludes(output.encode(), "OK");

    assertEquals(storageStub.calls[0].args[0], key);
    assertEquals(storageStub.calls[0].args[1], storedValue);
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
