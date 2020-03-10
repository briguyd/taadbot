import { OnMessage } from "./discord-event-handlers";
import { Message } from "discord.js";
import * as logger from "winston";
import { FightBotModule } from "./fight-bot-module";

@FightBotModule.register
export class Roll implements OnMessage {
  onMessage(msg: Message) {}
}
