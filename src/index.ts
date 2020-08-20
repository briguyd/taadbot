import { Bot } from "./bot";
import * as winston from "winston";

const newLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple())
    })
  ],
});
winston.add(newLogger);


const bot = new Bot();
bot.start();

export { bot };
