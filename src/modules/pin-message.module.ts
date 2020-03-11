import { OnReactAdd, OnReactRemove } from "./discord-event-handlers";
import { MessageReaction, User } from "discord.js";

import { FightBotModule } from "./fight-bot-module";

@FightBotModule.register
export class PinMessage implements OnReactAdd, OnReactRemove {
  private PIN_EMOJI = "📌";

  async onReactRemove(
    messageReaction: MessageReaction,
    user: User
  ): Promise<boolean> {
    if (messageReaction.emoji.name === this.PIN_EMOJI) {
      let shouldUnpin = true;
      if (messageReaction.message.reactions) {
        for (let [, reaction] of messageReaction.message.reactions.cache) {
          if (reaction.emoji.name === this.PIN_EMOJI) {
            shouldUnpin = false;
            break;
          }
        }
      }
      if (shouldUnpin) {
        messageReaction.message.unpin();
      }
    }
    return true;
  }

  async onReactAdd(
    messageReaction: MessageReaction,
    user: User
  ): Promise<boolean> {
    if (messageReaction.emoji.name === this.PIN_EMOJI) {
      messageReaction.message.pin();
    }
    return true;
  }
}
