import storage from "src/storage.ts";
import { DataType, SimpleStringType } from "src/dataTypes.ts";
import Processor from "./processor.ts";
import inputLengthValidator from "./validators/inputLengthValidator.ts";
import notNullValidator from "./validators/notNullValidator.ts";

const setProcessor: Processor = {
  process(_command: string | null, _args: (string | null)[]): DataType {
    const lengthValidationError = inputLengthValidator.validate(
      _command,
      _args,
      2,
    );
    if (lengthValidationError) return lengthValidationError;

    const nullKeyValidationError = notNullValidator.validate(_args[0], "key");
    if (nullKeyValidationError) return nullKeyValidationError;
    const key = _args[0]!;

    const nullValueValidationError = notNullValidator.validate(
      _args[1],
      "value",
    );
    if (nullValueValidationError) return nullValueValidationError;
    const value = _args[1]!;

    storage.set(key, value);
    return new SimpleStringType("OK");
  },
};

export default setProcessor;
