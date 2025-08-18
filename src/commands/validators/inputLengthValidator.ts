import { ErrorType } from "src/dataTypes.ts";

const validator = {
  validate(
    _command: string | null,
    _args: (string | null)[],
    length: number,
  ): ErrorType | undefined {
    if (_args.length >= length) return;
    return new ErrorType(
      `ERR wrong number of arguments for '${_command}' command`,
    );
  },
};

export default validator;
