import { ClientEvents } from "discord.js";

export type EventListeners = {
    [E in keyof Partial<ClientEvents>]: (...args: ClientEvents[E]) => void;
};
