import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export interface Command {
    name: string;
    group: CommandGroup;
    description: string;
    build: (builder: SlashCommandBuilder) => Partial<SlashCommandBuilder>;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    autocomplete?: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export enum CommandGroup {
    UTIL = "Util",
    CONFIG = "Config",
}
