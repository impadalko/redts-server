import storage from "@src/storage.ts";
import { DataType, IntegerType } from "@src/dataTypes.ts";
import Processor from "./processor.ts";
import inputLengthValidator from "./validators/inputLengthValidator.ts";
import notNullValidator from "./validators/notNullValidator.ts";

const existsProcessor: Processor = {
  process(command: string | null, args: (string | null)[]): DataType {
    const lengthValidationError = inputLengthValidator.validate(
      command,
      args,
      1,
    );
    if (lengthValidationError) return lengthValidationError;

    let existingKeys = 0;
    for (const arg of args) {
      const nullKeyValidationError = notNullValidator.validate(arg, "key");
      if (nullKeyValidationError) return nullKeyValidationError;
      const key = arg!;

      if (storage.exists(key)) existingKeys++;
    }

    return new IntegerType(existingKeys);
  },
};

export default existsProcessor;
