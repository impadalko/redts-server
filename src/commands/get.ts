import storage from "src/storage.ts";
import { DataType, NilType, SimpleStringType } from "src/dataTypes.ts";
import Processor from "./processor.ts";
import inputLengthValidator from "./validators/inputLengthValidator.ts";
import notNullValidator from "./validators/notNullValidator.ts";

const getProcessor: Processor = {
  process(_command: string | null, _args: (string | null)[]): DataType {
    const lengthValidationError = inputLengthValidator.validate(
      _command,
      _args,
      1,
    );
    if (lengthValidationError) return lengthValidationError;

    const nullKeyValidationError = notNullValidator.validate(_args[0], "key");
    if (nullKeyValidationError) return nullKeyValidationError;
    const key = _args[0]!;

    const value = storage.get(key);
    if (value) return new SimpleStringType(value);

    return new NilType();
  },
};

export default getProcessor;
