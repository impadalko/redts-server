import InputDecoder from "./inputDecoder.ts";
import commandProcessorMap from "./commands/commandProcessorMap.ts";

class ConnectionProcessor {
  inputDecoder: InputDecoder;
  outputEncoder: TextEncoder;
  bufferSize: number;

  constructor(bufferSize = 1024) {
    this.inputDecoder = new InputDecoder();
    this.outputEncoder = new TextEncoder();
    this.bufferSize = bufferSize;
  }

  async process(
    connection: Deno.Conn,
  ): Promise<void> {
    while (true) {
      const buffers: Uint8Array[] = [];
      let readBytes = 0;
      // Connection will get stuck when the amount of total bytes is a multiple of the buffer size.
      // This seems to be very unlikely to become an issue given that the buffer size is already very
      // large compared to usual payload.
      // TODO: allow for response of any sizes to be processed correctly.
      do {
        const buffer = new Uint8Array(this.bufferSize);
        const read = await connection.read(buffer);
        readBytes = read ?? 0;
        buffers.push(buffer);
      } while (readBytes == this.bufferSize);

      const parsedInput = this.inputDecoder.decode(buffers);
      const [command, ...args] = parsedInput;

      if (command) {
        const commandProcessor = commandProcessorMap.get(command);

        const commandOutput = commandProcessor.process(command, args);

        await connection.write(
          this.outputEncoder.encode(commandOutput.encode()),
        );
      }
    }
  }
}

export default ConnectionProcessor;
