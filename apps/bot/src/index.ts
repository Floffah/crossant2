import "reflect-metadata";

import { events } from "./events";
import {
    Client,
    ClientEvents,
    GatewayIntentBits,
    IntentsBitField,
    Partials,
    SlashCommandBuilder,
} from "discord.js";

import { prisma } from "@crossant/database";

import { commands } from "@/commands";
import { runtimeConfig } from "@/lib/context";
import { logger } from "@/lib/logger";
import { startWebhookPSRV } from "@/server";

require("dotenv").config();

export const client = new Client({
    partials: [Partials.Reaction, Partials.Channel, Partials.Message],
    intents: new IntentsBitField([
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,
    ]),
});

async function init() {
    await client.login();

    const allCommands = Array.from(commands.commands.values());

    const discordCommands = allCommands.map((command) =>
        command.build(
            new SlashCommandBuilder()
                .setName(command.name)
                .setDescription(command.description),
        ),
    ) as SlashCommandBuilder[];

    await client.application?.commands.set(discordCommands);

    const helpGuild = await client.guilds.fetch(runtimeConfig.dev.testGuildId);
    if (helpGuild) {
        await helpGuild.commands.set([]);
    }

    for (const eventListener of events) {
        for (const event of Object.keys(eventListener)) {
            client.on(event, (...args) => {
                try {
                    (eventListener[event as keyof ClientEvents] as any)(
                        ...args,
                    );
                } catch (e) {
                    console.error(e);
                }
            });
        }
    }

    logger.info("Bot started. Logged in as %s", client.user?.tag);

    startWebhookPSRV();
}

logger.info("Starting bot");
init();
