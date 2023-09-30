import { commands } from "@/commands";
import { createEmbed } from "@/lib/message/embed";
import { EventListeners } from "@/types/events";

export const onCommandEvents: EventListeners = {
    interactionCreate: async (interaction) => {
        if (interaction.isCommand() && interaction.isChatInputCommand()) {
            const command = commands.commands.get(interaction.commandName);

            if (!command) {
                await interaction.reply({
                    content: "Unknown command",
                    ephemeral: true,
                });
                return;
            }
            try {
                await command.execute(interaction);
            } catch (e) {
                console.error(e);
                const embed = createEmbed((embed) =>
                    embed
                        .setColor("#b91c1c")
                        .setDescription(
                            "Encountered an error while trying to run this command. Please contact bot owners for mor information.",
                        ),
                );

                if (interaction.replied) {
                    interaction.editReply({
                        embeds: [embed],
                    });
                } else {
                    interaction.reply({
                        embeds: [embed],
                    });
                }
            }
        }
    },
};
