import { Collection } from "discord.js";
import { groupBy } from "lodash";

import { Command, CommandGroup } from "@/types/commands";

export function createCommandRegister() {
    return new CommandRegister();
}

class CommandRegister {
    commands = new Collection<string, Command>();

    register(...commands: Command[]) {
        for (const command of commands) {
            this.commands.set(command.name, command);
        }
        return this;
    }

    getGrouped() {
        return groupBy(Array.from(this.commands.values()), "group") as Record<
            CommandGroup,
            Command[]
        >;
    }
}
