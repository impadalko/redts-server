import storage from "@src/storage.ts";
import { DataType, SimpleStringType } from "@src/dataTypes.ts";
import Processor from "./processor.ts";
import inputLengthValidator from "./validators/inputLengthValidator.ts";
import notNullValidator from "./validators/notNullValidator.ts";

const setProcessor: Processor = {
  process(command: string | null, args: (string | null)[]): DataType {
    const lengthValidationError = inputLengthValidator.validate(
      command,
      args,
      2,
    );
    if (lengthValidationError) return lengthValidationError;

    const nullKeyValidationError = notNullValidator.validate(args[0], "key");
    if (nullKeyValidationError) return nullKeyValidationError;
    const key = args[0]!;

    const nullValueValidationError = notNullValidator.validate(
      args[1],
      "value",
    );
    if (nullValueValidationError) return nullValueValidationError;
    const value = args[1]!;

    storage.set(key, value);
    return new SimpleStringType("OK");
  },
};

export default setProcessor;
