import { assertEquals } from "@deno/std@0.182.0/testing/asserts.ts";
import { afterEach, describe, it } from "@deno/std@0.182.0/testing/bdd.ts";

import { Stub, stub } from "@deno/std@0.186.0/testing/mock.ts";

import existsProcessor from "@src/commands/exists.ts";
import storage from "@src/storage.ts";
import inputLengthValidator from "@src/commands/validators/inputLengthValidator.ts";
import notNullValidator from "@src/commands/validators/notNullValidator.ts";
import { ErrorType } from "@src/dataTypes.ts";

describe("Get Processor", () => {
  let inputLengthValidatorStub: Stub;
  let notNullValidatorStub: Stub;
  let storageStub: Stub;

  const command = "del";
  const args = ["key"];
  const multipleArgs = ["key1", "key2"];

  afterEach(() => {
    if (inputLengthValidatorStub) inputLengthValidatorStub.restore();
    if (notNullValidatorStub) notNullValidatorStub.restore();
    if (storageStub) storageStub.restore();
  });

  it("should return an error when input length validator returns an error", () => {
    mockInputLengthValidator(new ErrorType(""));

    const output = existsProcessor.process(command, args);

    assertEquals(output.type, "error");
  });

  it("should return an error when not null validator returns an error", () => {
    mockInputLengthValidator(undefined);
    mockNotNullValidator(new ErrorType(""));

    const output = existsProcessor.process(command, args);

    assertEquals(output.type, "error");
  });

  it("should return the amount of existing keys when they are present", () => {
    mockInputLengthValidator(undefined);
    mockNotNullValidator(undefined);
    storageStub = stub(storage, "exists", () => true);

    let output = existsProcessor.process(command, args);

    assertEquals(output.type, "integer");
    assertEquals(output.payload, 1);

    output = existsProcessor.process(command, multipleArgs);

    assertEquals(output.type, "integer");
    assertEquals(output.payload, 2);
  });

  it("should return zero when no keys are present", () => {
    mockInputLengthValidator(undefined);
    mockNotNullValidator(undefined);
    storageStub = stub(storage, "exists", () => false);

    const output = existsProcessor.process(command, args);

    assertEquals(output.type, "integer");
    assertEquals(output.payload, 0);
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
