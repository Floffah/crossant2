import { ChatInputCommandInteraction } from "discord.js";

import { ReactionBoard, prisma } from "@crossant/database";

import { createIncrementalResponse } from "@/lib/message/incrementalResponse";
import {
    createMessage,
    createMessageComponent,
} from "@/lib/message/messageBuilder";
import { createPaginatedMessage } from "@/lib/message/pagination";

export async function handleReactionBoardListCommand(
    interaction: ChatInputCommandInteraction,
) {
    const member = await interaction.guild?.members.fetch(interaction.user);

    if (!member) {
        await interaction.reply(
            createMessage(
                createMessageComponent.error(
                    "Whoops! I couldn't find you in this server",
                ),
            ),
        );

        return;
    }

    if (!member.permissions.has("ManageChannels")) {
        await interaction.reply(
            createMessage(
                createMessageComponent.error(
                    "Whoops! You need the `Manage Channels` permission to use this command",
                ),
            ),
        );

        return;
    }

    await createPaginatedMessage<ReactionBoard>(interaction, {
        title: "Reaction Board List for " + interaction.guild?.name,
        itemsPerPage: 10,
        onUpdate: async (message) => {
            if (interaction.replied) {
                await interaction.editReply(message);
            } else {
                await interaction.reply(message);
            }
        },
        onNoData: async () => {
            const message = createMessage(
                createMessageComponent.error(
                    "Whoops! I couldn't find any reaction boards in this server",
                ),
            );

            if (interaction.replied) {
                await interaction.editReply(message);
            } else {
                await interaction.reply(message);
            }
        },
        getData: async ({ skip, take, cursor }) =>
            await prisma.reactionBoard.findMany({
                where: {
                    guildId: interaction.guild?.id,
                },
                orderBy: {
                    id: "asc",
                },
                skip,
                take,
                cursor,
            }),
        formatData: (data) => {
            let emoji;
            if (data.emoji.includes(":")) {
                emoji = `<:${data.emoji}>`;
            } else {
                emoji = decodeURIComponent(data.emoji);
            }

            return `${emoji} in <#${data.channelId}> (min:${data.minReactions}) ||${data.id}||`;
        },
    });
}
