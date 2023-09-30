import { ChatInputCommandInteraction } from "discord.js";

import { handleReactionBoardCreateCommand } from "@/commands/config/reactionBoard/create";
import { handleReactionBoardDeleteCommand } from "@/commands/config/reactionBoard/delete";
import { handleReactionBoardListCommand } from "@/commands/config/reactionBoard/list";

export async function handleReactionBoardCommand(
    interaction: ChatInputCommandInteraction,
) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "create") {
        await handleReactionBoardCreateCommand(interaction);
    } else if (subcommand === "delete") {
        await handleReactionBoardDeleteCommand(interaction);
    } else if (subcommand === "list") {
        await handleReactionBoardListCommand(interaction);
    }
}
