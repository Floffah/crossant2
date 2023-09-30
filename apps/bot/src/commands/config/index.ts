import { handleReactionBoardCommand } from "@/commands/config/reactionBoard";
import { Command, CommandGroup } from "@/types/commands";

export const configCommand: Command = {
    name: "config",
    group: CommandGroup.CONFIG,
    description: "Manage your server's configuration",
    build: (builder) =>
        builder.addSubcommandGroup((group) =>
            group
                .setName("reaction-board")
                .setDescription("Manage your server's reaction board")
                .addSubcommand((cmd) =>
                    cmd
                        .setName("create")
                        .setDescription("Create a new reaction board")
                        .addStringOption((opt) =>
                            opt
                                .setName("emoji")
                                .setDescription(
                                    "The emoji to use for this reaction board",
                                )
                                .setRequired(true),
                        )
                        .addChannelOption((opt) =>
                            opt
                                .setName("channel")
                                .setDescription(
                                    "The channel to use for this reaction board",
                                )
                                .setRequired(true),
                        )
                        .addNumberOption((opt) =>
                            opt
                                .setName("min-reactions")
                                .setDescription(
                                    "The minimum number of reactions required to trigger this reaction board",
                                )
                                .setRequired(false),
                        ),
                )
                .addSubcommand((cmd) =>
                    cmd
                        .setName("delete")
                        .setDescription("Delete a reaction board")
                        .addStringOption((opt) =>
                            opt
                                .setName("id")
                                .setDescription(
                                    "The ID of the reaction board to delete",
                                )
                                .setRequired(true),
                        )
                        .addBooleanOption((opt) =>
                            opt
                                .setName("delete-messages")
                                .setDescription(
                                    "Whether to delete the messages in the reaction board channel",
                                )
                                .setRequired(false),
                        ),
                )
                .addSubcommand((cmd) =>
                    cmd
                        .setName("list")
                        .setDescription("List all reaction boards"),
                )
                .addSubcommand((cmd) =>
                    cmd
                        .setName("edit")
                        .setDescription("Edit a reaction board")
                        .addNumberOption((opt) =>
                            opt
                                .setName("min-reactions")
                                .setDescription(
                                    "The minimum number of reactions required to trigger this reaction board",
                                )
                                .setRequired(false),
                        ),
                ),
        ),
    execute: async (interaction) => {
        const group = interaction.options.getSubcommandGroup();

        if (group === "reaction-board") {
            await handleReactionBoardCommand(interaction);
        }
    },
};
