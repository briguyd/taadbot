import { OnReactAdd, OnReactRemove, OnMessage } from "./discord-event-handlers";
import { MessageReaction, User, Message, Role } from "discord.js";
import { FightBotModule } from "./fight-bot-module";
import { EmojiCharacters, enumKeys } from "../emojicharacters";
import * as logger from "winston";
const Keyv = require("keyv");
@FightBotModule.register
export class SelfRoleAssignment
  implements OnReactAdd, OnReactRemove, OnMessage {
  private keyv = new Keyv("sqlite://database.sqlite", {
    namespace: "selfroleassignment"
  });
  constructor() {
    this.keyv.on("error", (err: any) =>
      console.error("Keyv connection error:", err)
    );
  }

  onMessageCommands: string[] = ["self-role-assign"];

  async onReactRemove(
    messageReaction: MessageReaction,
    user: User
  ): Promise<boolean> {
    // get the stored messages => role/emoji arrays from the db
    // if we find it, then continue
    const rolesAndEmojis = await this.keyv.get(messageReaction.message.id);
    if (rolesAndEmojis) {
      for (const roleObj of rolesAndEmojis) {
        // if the emoji matches the new reaction
        if (roleObj.emoji === messageReaction.emoji.name) {
          // get the member from the user, and add the role to them
          messageReaction.message.guild
            ?.member(user)
            ?.roles.remove(roleObj.roleId);
        }
      }
    }
    return true;
  }

  async onReactAdd(
    messageReaction: MessageReaction,
    user: User
  ): Promise<boolean> {
    // get the stored messages => role/emoji arrays from the db
    // if we find it, then continue
    const rolesAndEmojis = await this.keyv.get(messageReaction.message.id);
    if (rolesAndEmojis) {
      for (const roleObj of rolesAndEmojis) {
        // if the emoji matches the new reaction
        if (roleObj.emoji === messageReaction.emoji.name) {
          // for (const [, user] of messageReaction.users.cache) {
          messageReaction.message.guild
            ?.member(user)
            ?.roles.add(roleObj.roleId);
        }
      }
    }
    return true;
  }

  async onMessage(msg: Message, args: string[]): Promise<boolean> {
    // TODO: make sure the user who sends the message has the rights to assign these roles
    // logger.info(msg.member?.roles.cache);
    if (!msg.member?.permissions.has("MANAGE_ROLES")) {
      msg.reply("You don't have the required permission to assign roles");
      return false;
    }
    if (msg.guild) {
      let message = "React to give yourself a role.\n\n";
      const emojiKeys = enumKeys(EmojiCharacters);
      const rolesAndEmojis = [];
      for (let roleNum = 0; roleNum < args.length; roleNum++) {
        const arg = args[roleNum];
        message += EmojiCharacters[emojiKeys[roleNum + 1]] + " ";
        const role = msg.guild.roles.cache.find(role => role.name === arg);
        if (role) {
          rolesAndEmojis.push({
            roleId: role.id,
            emoji: EmojiCharacters[emojiKeys[roleNum + 1]]
          });
          message += role.name;
        }
        message += "\n\n";
      }
      const roleMsg = await msg.channel.send(message);
      msg.delete();
      for (let roleNum = 0; roleNum < args.length; roleNum++) {
        await roleMsg.react(EmojiCharacters[emojiKeys[roleNum + 1]]);
      }

      this.keyv.set(roleMsg.id, rolesAndEmojis);
    }
    return true;
  }
}
