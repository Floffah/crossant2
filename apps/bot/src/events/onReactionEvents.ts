import {
    BaseMessageOptions,
    ChannelType,
    Message,
    MessageReaction,
    PartialMessageReaction,
    PartialUser,
    User,
} from "discord.js";

import { prisma } from "@crossant/database";

import { createEmbed } from "@/lib/message/embed";
import { EventListeners } from "@/types/events";

const buildReactionBoardMessage = (
    emoji: string,
    count: number,
    message: Message,
): BaseMessageOptions => ({
    content: `${emoji} **${count}**\n[Jump to message](${message.url})`,
    embeds: [
        createEmbed((embed) => {
            if (message.content) {
                embed = embed.setDescription(message.content);
            }

            if (message.attachments.size > 0) {
                const attachment = message.attachments.first();

                if (attachment) {
                    embed = embed.setImage(attachment.url);
                }
            }

            embed = embed
                .setAuthor({
                    name: message.author.tag,
                    iconURL:
                        message.author.avatarURL({ size: 256 }) ?? undefined,
                })
                .setFooter(null);

            return embed;
        }),
    ],
});
const handleReactionCountChange = async (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
) => {
    const guild = reaction.message.guild;

    if (
        user.bot ||
        !reaction ||
        !reaction.emoji ||
        !reaction.message ||
        !reaction.message.guildId ||
        !reaction.message.channelId ||
        !guild
    ) {
        return;
    }

    const identifier = reaction.emoji.identifier;

    if (!identifier) {
        return;
    }

    const reactionBoard = await prisma.reactionBoard.findFirst({
        where: {
            guildId: reaction.message.guildId,
            emoji: identifier,
        },
    });

    if (!reactionBoard) {
        return;
    }

    reaction = await reaction.fetch();

    const boardMessage = await prisma.reactionBoardMessage.findFirst({
        where: {
            reactionBoardId: reactionBoard.id,
            messageId: reaction.message.id,
        },
    });

    const boardChannel = await guild.channels.fetch(reactionBoard.channelId);
    if (!boardChannel || boardChannel.type !== ChannelType.GuildText) {
        return;
    }

    if (boardMessage) {
        const message = await boardChannel.messages.fetch(
            boardMessage.boardMessageId,
        );

        if (reaction.count < reactionBoard.minReactions) {
            if (boardChannel) {
                const message = await boardChannel.messages.fetch(
                    boardMessage.boardMessageId,
                );
                await message.delete();

                await prisma.reactionBoardMessage.delete({
                    where: {
                        id: boardMessage.id,
                    },
                });
            }

            return;
        } else {
            await message.edit(
                buildReactionBoardMessage(
                    reaction.emoji.toString(),
                    reaction.count,
                    await reaction.message.fetch(),
                ),
            );
        }
    } else if (reaction.count >= reactionBoard.minReactions) {
        const message = await boardChannel.send(
            buildReactionBoardMessage(
                reaction.emoji.toString(),
                reaction.count,
                await reaction.message.fetch(),
            ),
        );

        await prisma.reactionBoardMessage.create({
            data: {
                reactionBoardId: reactionBoard.id,
                messageId: reaction.message.id,
                boardMessageId: message.id,
            },
        });
    }
};

export const onReactionEvents: EventListeners = {
    messageReactionAdd: handleReactionCountChange,
    messageReactionRemove: handleReactionCountChange,
};
