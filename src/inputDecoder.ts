import * as Uint8ArrayUtil from "@github/impadalko/redts-shared/main/src/uint8ArrayUtil.ts";

class InputDecoder {
  textDecoder: TextDecoder;
  separator = new Uint8Array([13, 10]); // \r\n

  constructor() {
    this.textDecoder = new TextDecoder();
  }

  decode(input: Uint8Array[]): (string | null)[] {
    const mergedInput = Uint8ArrayUtil.merge(input);
    const trimmedInput = Uint8ArrayUtil.trim(mergedInput);
    const tokens = Uint8ArrayUtil.split(trimmedInput, this.separator);

    if (tokens.length === 0) return [];

    const [firstToken, ...command] = tokens;

    // The input should be an array of bulk string and thus start with a * (42) as specified by the
    // protocol. If the input is not in this format, we assume it was passed as a plain string as
    // done by the redis server.
    const [tokenType, ..._] = firstToken;
    if (tokenType != 42) {
      return this.textDecoder.decode(trimmedInput)
        .replace(/\r\n$/g, "")
        .split(" ");
    }

    const output: (string | null)[] = [];
    let i = 0;
    while (i < command.length) {
      const [_, ...payload] = command[i];

      const stringSize = Number(
        this.textDecoder.decode(new Uint8Array(payload)),
      );
      if (stringSize === -1) {
        output.push(null);
      } else {
        let s = command[++i];
        // This is to cover the edge case where \r\n is part of the string.
        while (s.length < stringSize) {
          s = Uint8ArrayUtil.merge([s, this.separator, command[++i]]);
        }
        output.push(this.textDecoder.decode(s));
      }

      i++;
    }

    // Should we validate the output length?
    return output;
  }
}

export default InputDecoder;
