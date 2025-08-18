import { ErrorType } from "src/dataTypes.ts";

const validator = {
  validate(
    arg: string | null,
    argName: string,
  ): ErrorType | undefined {
    if (arg !== null) return;

    return new ErrorType(`ERR required argument ${argName} set as nil`);
  },
};

export default validator;
