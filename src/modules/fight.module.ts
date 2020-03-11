import { OnMessage } from "./discord-event-handlers";
import { Message } from "discord.js";
import * as logger from "winston";
import { FightBotModule } from "./fight-bot-module";

@FightBotModule.register
export class Fight implements OnMessage {
  public onMessageCommands = ["fight"];
  async onMessage(msg: Message, args: string[]): Promise<boolean> {
    let fightMessage = "<@" + msg.author.id + "> has declared a fight with ";
    for (let [, mentionedUser] of msg.mentions.users) {
      if (mentionedUser.bot) {
        msg.reply("You can't fight with a bot, idiot.");
        return false;
      }
      fightMessage += "<@" + mentionedUser.id + ">";
    }

    // to: config.fight-channel,
    msg.channel.send(fightMessage).then((message: any) => message.pin());
    return true;
  }
}
