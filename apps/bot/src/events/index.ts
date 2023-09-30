import { onCommandEvents } from "@/events/onCommand";
import { onReactionEvents } from "@/events/onReactionEvents";
import { EventListeners } from "@/types/events";

export const events: EventListeners[] = [onCommandEvents, onReactionEvents];
