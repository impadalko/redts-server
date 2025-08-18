export interface DataType {
  payload: unknown;
  type: string;
  encode: () => string;
}

export class ErrorType implements DataType {
  payload: string;
  type = "error";

  constructor(payload: string) {
    this.payload = payload;
  }

  encode(): string {
    return `-${this.payload}\r\n`;
  }
}

export class SimpleStringType implements DataType {
  payload: string;
  type = "simpleString";

  constructor(payload: string) {
    this.payload = payload;
  }

  encode(): string {
    return `+${this.payload}\r\n`;
  }
}

export class NilType implements DataType {
  payload = null;
  type = "nil";

  encode(): string {
    return `$-1\r\n`;
  }
}
