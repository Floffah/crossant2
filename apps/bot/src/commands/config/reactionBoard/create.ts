import {
    ChannelType,
    ChatInputCommandInteraction,
    TextChannel,
} from "discord.js";
import { trim } from "lodash";

import { prisma } from "@crossant/database";

import {
    MessageComponent,
    createMessage,
    createMessageComponent,
} from "@/lib/message/messageBuilder";

export async function handleReactionBoardCreateCommand(
    interaction: ChatInputCommandInteraction,
) {
    const member = await interaction.guild?.members.fetch(interaction.user);

    if (!member) {
        await interaction.reply({
            ephemeral: true,
            ...createMessage(
                createMessageComponent.error(
                    "Whoops! I couldn't find you in this server",
                ),
            ),
        });

        return;
    }

    if (!member.permissions.has("ManageChannels")) {
        await interaction.reply({
            ephemeral: true,
            ...createMessage(
                createMessageComponent.error(
                    "Whoops! You need the `Manage Channels` permission to use this command",
                ),
            ),
        });

        return;
    }

    const emoji = trim(interaction.options.getString("emoji", true));
    const channel = interaction.options.getChannel(
        "channel",
        true,
    ) as TextChannel;
    const minReactions =
        interaction.options.getNumber("min-reactions", false) ?? 1;

    if (channel.type !== ChannelType.GuildText) {
        await interaction.reply({
            ephemeral: true,
            ...createMessage(
                createMessageComponent.error(
                    "Whoops! The channel must be a text channel",
                ),
            ),
        });

        return;
    }

    if (!interaction.channel) {
        await interaction.reply({
            ephemeral: true,
            ...createMessage(
                createMessageComponent.error(
                    "Whoops! I couldn't find the channel you're trying to use",
                ),
            ),
        });

        return;
    }

    let reactionTestMessage = await interaction.channel.send({
        content: "Fetching emoji id...",
    });
    try {
        await reactionTestMessage.react(
            emoji.replace(/(^:|:$|^<:[A-z]+:|>$)/g, ""),
        );
    } catch (e) {
        if (e.message ?? `${e}`.includes("Unknown Emoji")) {
            await interaction.reply({
                ephemeral: true,
                ...createMessage(
                    createMessageComponent.error(
                        "Whoops! I couldn't find the emoji you're trying to use",
                    ),
                ),
            });
            await reactionTestMessage.delete();

            return;
        }
    }

    reactionTestMessage = await reactionTestMessage.fetch();

    const reaction = reactionTestMessage.reactions.cache.first();
    const emojiId = reaction?.emoji.identifier;

    await reactionTestMessage.delete();

    if (!emojiId) {
        await interaction.reply({
            ephemeral: true,
            ...createMessage(
                createMessageComponent.error(
                    "Whoops! I couldn't find the emoji you're trying to use",
                ),
            ),
        });

        return;
    }

    const response: MessageComponent[] = [
        createMessageComponent.info(() => {
            let response = "Creating reaction board with:\n";

            response += ` - Emoji: ${emoji}\n`;
            response += ` - Channel: ${channel}\n`;
            response += ` - Minimum reactions: ${minReactions}\n`;
            response += "...";

            return response;
        }),
    ];

    await interaction.reply({
        ephemeral: true,
        ...createMessage(...response),
    });

    const existingReactionBoard = await prisma.reactionBoard.findFirst({
        where: {
            guildId: interaction.guildId as string,
            emoji,
            channelId: channel.id,
        },
    });

    if (existingReactionBoard) {
        await interaction.editReply(
            createMessage(
                createMessageComponent.error(
                    "Whoops! It looks like you already have a reaction board with that emoji and channel",
                ),
            ),
        );

        return;
    }

    const reactionBoard = await prisma.reactionBoard.create({
        data: {
            guild: {
                connectOrCreate: {
                    where: {
                        id: interaction.guildId as string,
                    },
                    create: {
                        id: interaction.guildId as string,
                    },
                },
            },
            emoji: emojiId,
            channelId: channel.id,
            minReactions,
        },
    });

    response.push(
        createMessageComponent.success(
            `Successfully created reaction board with ID \`${reactionBoard.id}\``,
        ),
    );

    await interaction.editReply(createMessage(...response));

    await channel.send(
        createMessage(
            createMessageComponent.info(
                `This channel is now set up as a reaction board for ${emoji} (${emojiId})!`,
            ),
        ),
    );
}
