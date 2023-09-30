import {
    ActionRowBuilder,
    BaseMessageOptions,
    ButtonBuilder,
    ButtonComponent,
    ButtonStyle,
    ChatInputCommandInteraction,
} from "discord.js";
import { last } from "lodash";

import { prisma } from "@crossant/database";

import { createEmbed } from "@/lib/message/embed";

export function createPaginatedMessage<DataType>(
    interaction: ChatInputCommandInteraction,
    opts: {
        title: string;
        itemsPerPage: number;
        onUpdate: (message: BaseMessageOptions) => Promise<void> | void;
        onNoData: () => Promise<void> | void;
        getData: (opts: {
            skip: number;
            take: number;
            cursor?: any;
        }) => Promise<DataType[]>;
        formatData: (data: DataType) => string;
    },
) {
    return new Promise<void>(async (resolve, reject) => {
        let lastInteraction = Date.now();

        let page = 0,
            lastPage: number | undefined = undefined,
            done = false;

        const formatPage = async () => {
            const rawData = await opts.getData({
                skip: page * opts.itemsPerPage,
                take: opts.itemsPerPage + 1,
            });

            if (page === 0 && rawData.length === 0) {
                lastPage = -1;
                await opts.onNoData();
                done = true;
                return;
            }

            if (rawData.length <= opts.itemsPerPage) {
                lastPage = page;
            }

            const data = rawData
                .slice(0, opts.itemsPerPage)
                .map(opts.formatData)
                .map((str, i) => `${i + 1 + page * opts.itemsPerPage}. ${str}`)
                .join("\n");

            const message: BaseMessageOptions = {
                embeds: [
                    createEmbed((embed) =>
                        embed.setTitle(opts.title).setDescription(data),
                    ),
                ],
                components: [
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId("previous")
                            .setEmoji("⬅️")
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(page === 0),
                        new ButtonBuilder()
                            .setCustomId("next")
                            .setEmoji("➡️")
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(lastPage === page),
                    ),
                ],
            };

            await opts.onUpdate(message);
        };

        try {
            await formatPage();
        } catch (e) {
            const errorMessage = e.message ?? `${e}`;

            if (errorMessage.includes("Unknown")) {
                done = true;
            }

            reject(e);
        }

        if (done) {
            resolve();
            return;
        }

        const collector = interaction.channel?.createMessageComponentCollector({
            filter: (i) => i.user.id === interaction.user.id,
            time: 60000,
        });

        if (!collector) {
            reject("No collector");
            return;
        }

        collector.on("collect", async (i) => {
            if (i.customId === "previous") {
                page--;
            } else if (i.customId === "next") {
                page++;
            }

            lastInteraction = Date.now();

            try {
                await formatPage();
                await i.deferUpdate();
            } catch (e) {
                const errorMessage = e.message ?? `${e}`;

                if (errorMessage.includes("Unknown")) {
                    done = true;
                }

                reject(e);
            }

            if (done) {
                collector.stop();
                resolve();
            }
        });

        collector.on("end", async () => {
            if (lastInteraction + 60000 < Date.now()) {
                await interaction.editReply({
                    components: [],
                });
            }
        });
    });
}
