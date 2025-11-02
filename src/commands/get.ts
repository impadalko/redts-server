import storage from "@src/storage.ts";
import { DataType, NilType, SimpleStringType } from "@src/dataTypes.ts";
import Processor from "./processor.ts";
import inputLengthValidator from "./validators/inputLengthValidator.ts";
import notNullValidator from "./validators/notNullValidator.ts";

const getProcessor: Processor = {
  process(command: string | null, args: (string | null)[]): DataType {
    const lengthValidationError = inputLengthValidator.validate(
      command,
      args,
      1,
    );
    if (lengthValidationError) return lengthValidationError;

    const nullKeyValidationError = notNullValidator.validate(args[0], "key");
    if (nullKeyValidationError) return nullKeyValidationError;
    const key = args[0]!;

    const value = storage.get(key);
    if (value) return new SimpleStringType(value);

    return new NilType();
  },
};

export default getProcessor;
