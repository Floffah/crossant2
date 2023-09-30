import { EmbedBuilder } from "discord.js";

/**
 * @deprecated
 */
export function createEmbedOld() {
    return new EmbedBuilder().setColor("#ec6809").setFooter({
        text: "Crossant Beta v0.0.1",
    });
}

export function createEmbed(builder: (builder: EmbedBuilder) => EmbedBuilder) {
    return builder(
        new EmbedBuilder().setColor("#ec6809").setFooter({
            text: "Crossant V2 Prerelease - EXPECT BUGS",
        }),
    );
}
