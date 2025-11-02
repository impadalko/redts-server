import { parse } from "@deno/std/flags/mod.ts";
import { main } from "./server.ts";

main(parse(Deno.args));
