import { createEmbedOld } from "@/lib/message/embed";
import { Command, CommandGroup } from "@/types/commands";

export const helpCommand: Command = {
    name: "help",
    group: CommandGroup.UTIL,
    description: "Shows a list of all commands this bot supports",
    build: (builder) => builder,
    execute: async (interaction) => {
        await interaction.reply({
            ephemeral: true,
            embeds: [
                createEmbedOld().setDescription(
                    "Crossant is still in beta and not stable for production use",
                ),
            ],
        });
    },
};
