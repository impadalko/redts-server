import Processor from "./processor.ts";
import pingProcessor from "./ping.ts";
import setProcessor from "./set.ts";
import getProcessor from "./get.ts";
import delProcessor from "./del.ts";
import existsProcessor from "./exists.ts";
import expireProcessor from "./expire.ts";
import ttlProcessor from "./ttl.ts";
import unknownProcessor from "./unknown.ts";

const processorMap = new Map<string, Processor>();
processorMap.set("PING", pingProcessor);
processorMap.set("SET", setProcessor);
processorMap.set("GET", getProcessor);
processorMap.set("DEL", delProcessor);
processorMap.set("EXISTS", existsProcessor);
processorMap.set("EXPIRE", expireProcessor);
processorMap.set("TTL", ttlProcessor);

const commandProcessorMap = {
  get(command: string): Processor {
    return processorMap.get(command.toUpperCase()) ?? unknownProcessor;
  },
};

export default commandProcessorMap;
