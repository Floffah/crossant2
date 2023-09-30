import { ChannelType, ChatInputCommandInteraction } from "discord.js";

import { prisma } from "@crossant/database";

import { createIncrementalResponse } from "@/lib/message/incrementalResponse";
import { createMessageComponent } from "@/lib/message/messageBuilder";

export async function handleReactionBoardDeleteCommand(
    interaction: ChatInputCommandInteraction,
) {
    const member = await interaction.guild?.members.fetch(interaction.user);

    const response = createIncrementalResponse(interaction, true);

    if (!member) {
        await response.add(
            createMessageComponent.error(
                "Whoops! I couldn't find you in this server",
            ),
        );

        return;
    }

    if (!member.permissions.has("ManageChannels")) {
        await response.add(
            createMessageComponent.error(
                "Whoops! You need the `Manage Channels` permission to use this command",
            ),
        );

        return;
    }

    const id = interaction.options.getString("id", true);
    const deleteMessages =
        interaction.options.getBoolean("delete-messages", false) ?? false;

    const reactionBoard = await prisma.reactionBoard.findUnique({
        where: {
            id,
        },
    });

    if (!reactionBoard) {
        await response.add(
            createMessageComponent.error(
                "Whoops! I couldn't find a reaction board with that ID. You can use `/config reaction-board list` to find a list of ids!",
            ),
        );

        return;
    }

    if (deleteMessages) {
        const boardMessages = await prisma.reactionBoardMessage.findMany({
            where: {
                reactionBoardId: reactionBoard.id,
            },
        });
        const boardChannel = await interaction.guild?.channels.fetch(
            reactionBoard.channelId,
        );

        if (boardChannel && boardChannel.type === ChannelType.GuildText) {
            for (const boardMessage of boardMessages) {
                const message = await boardChannel?.messages.fetch(
                    boardMessage.messageId,
                );

                if (message) {
                    await message.delete();
                }
            }
        }

        await prisma.reactionBoardMessage.deleteMany({
            where: {
                reactionBoardId: reactionBoard.id,
            },
        });
    }

    await prisma.reactionBoard.delete({
        where: {
            id,
        },
    });

    await response.add(
        createMessageComponent.success(
            `Successfully deleted reaction board with id \`${id}\``,
        ),
    );
}
