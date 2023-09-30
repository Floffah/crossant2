import { ChatInputCommandInteraction } from "discord.js";

import { MessageComponent, createMessage } from "@/lib/message/messageBuilder";

class IncrementalResponse {
    private _components: MessageComponent[] = [];

    constructor(
        private interaction: ChatInputCommandInteraction,
        private ephemeral = false,
        private _opts: { raw?: boolean } = {},
    ) {}

    async add(...components: MessageComponent[]) {
        this._components.push(...components);

        const message = createMessage._(this._components, this._opts);

        if (this.interaction.replied) {
            await this.interaction.editReply(message);
        } else {
            await this.interaction.reply({
                ephemeral: this.ephemeral,
                ...message,
            });
        }
    }
}

export function createIncrementalResponse(
    interaction: ChatInputCommandInteraction,
    ephemeral = false,
    opts: { raw?: boolean } = {},
) {
    return new IncrementalResponse(interaction, ephemeral, opts);
}
