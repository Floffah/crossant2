import { BaseMessageOptions, ColorResolvable } from "discord.js";
import { last } from "lodash";

import { createEmbed } from "@/lib/message/embed";

type Levels = "none" | "error" | "info" | "success";

function _createMessageComponent(
    level: undefined | Levels,
    message: string | (() => string),
) {
    return {
        level,
        message: typeof message === "string" ? message : message(),
    };
}

export type MessageComponent = ReturnType<typeof _createMessageComponent>;
export const createMessageComponent = Object.assign(_createMessageComponent, {
    error: (message: string | (() => string)): MessageComponent =>
        createMessageComponent("error", message),
    info: (message: string | (() => string)): MessageComponent =>
        createMessageComponent("info", message),
    success: (message: string | (() => string)): MessageComponent =>
        createMessageComponent("success", message),
    none: (message: string | (() => string)): MessageComponent =>
        createMessageComponent("none", message),
});
const levelCopyMap: Record<Levels, string> = {
    none: "",
    error: ":exclamation:",
    info: ":grey_exclamation:",
    success: ":white_check_mark:",
};
const levelColourMap: Record<Levels, ColorResolvable> = {
    none: "#ec6809",
    info: "#ec6809",
    error: "#b91c1c",
    success: "#15803d",
};

function _createMessage(
    components: MessageComponent[],
    opts: { raw?: boolean } = {},
): BaseMessageOptions {
    const message = components
        .map((c) => {
            if (!c.level || c.level === "none") {
                return c.message;
            }

            return `${levelCopyMap[c.level]} ${c.message}`;
        })
        .join("\n\n");

    if (opts.raw) {
        return {
            content: message,
        };
    }

    return {
        embeds: [
            createEmbed((embed) =>
                embed
                    .setColor(levelColourMap[last(components)?.level ?? "none"])
                    .setDescription(message),
            ),
        ],
    };
}

export const createMessage = Object.assign(
    (...components: MessageComponent[]) => _createMessage(components),
    {
        raw: (...components: MessageComponent[]) =>
            _createMessage(components, { raw: true }),
        _: _createMessage,
    },
);
