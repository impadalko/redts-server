import Processor from "./processor.ts";
import pingProcessor from "./ping.ts";
import setProcessor from "./set.ts";
import getProcessor from "./get.ts";
import delProcessor from "./del.ts";
import unknownProcessor from "./unknown.ts";

const processorMap = new Map<string, Processor>();
processorMap.set("PING", pingProcessor);
processorMap.set("SET", setProcessor);
processorMap.set("GET", getProcessor);
processorMap.set("DEL", delProcessor);

const commandProcessorMap = {
  get(command: string): Processor {
    return processorMap.get(command.toUpperCase()) ?? unknownProcessor;
  },
};

export default commandProcessorMap;
