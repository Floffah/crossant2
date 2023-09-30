import { Logger, noConflict } from "loglevel";

export const logger = noConflict() as Logger;
logger.enableAll();
