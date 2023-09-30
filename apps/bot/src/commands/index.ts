import { configCommand } from "@/commands/config";
import { helpCommand } from "@/commands/util/help";
import { createCommandRegister } from "@/lib/command";

export const commands = createCommandRegister()
    .register(helpCommand)
    .register(configCommand);
