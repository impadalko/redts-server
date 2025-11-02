import storage from "@src/storage.ts";
import { DataType, IntegerType } from "@src/dataTypes.ts";
import Processor from "./processor.ts";
import inputLengthValidator from "./validators/inputLengthValidator.ts";
import notNullValidator from "./validators/notNullValidator.ts";

const expireProcessor: Processor = {
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

    const nullTTLValidationError = notNullValidator.validate(args[1], "ttl");
    if (nullTTLValidationError) return nullTTLValidationError;
    const ttl = Number(args[1]!);

    const ttlSet = storage.expire(key, ttl);
    if (ttlSet) return new IntegerType(1);
    return new IntegerType(0);
  },
};

export default expireProcessor;
