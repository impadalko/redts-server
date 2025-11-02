import storage from "src/storage.ts";
import { DataType, IntegerType } from "src/dataTypes.ts";
import Processor from "./processor.ts";
import inputLengthValidator from "./validators/inputLengthValidator.ts";
import notNullValidator from "./validators/notNullValidator.ts";

const ttlProcessor: Processor = {
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

    const ttl = storage.ttl(key);
    return new IntegerType(ttl);
  },
};

export default ttlProcessor;
