import * as discord from "discord.js";
import * as logger from "winston";
import { Client, TextChannel, Message, GuildAuditLogs } from "discord.js";
import { FightBotModule } from "./modules/fight-bot-module";
const config = require("../config.json");

// the module classes need to be declared for their decorators to fire off
require("./modules/roll.module.ts");
require("./modules/fight.module.ts");
require("./modules/pin-message.module.ts");
require("./modules/topic-change.module.ts");

export class Bot {
  private client: Client;
  private allModules: any[] = [];
  // private onMessageModules: Module[] = [];

  constructor() {
    this.client = new discord.Client({
      partials: ["MESSAGE", "CHANNEL", "REACTION"]
    });
  }

  start() {
    logger.info("Bot starting");
    this.client.on("ready", this._onReady.bind(this));
    this.client.on("message", this._onMessage.bind(this));
    this.client.on("messageReactionAdd", this._onReactAdd.bind(this));
    this.client.on("messageReactionRemove", this._onReactRemove.bind(this));
    this.client.on("channelUpdate", this._onChannelUpdate.bind(this));

    this.client.on("error", logger.error);
    this.client.login(config.token);

    const modules = FightBotModule.getImplementations();
    for (const module of modules) {
      logger.info("Adding module " + module.name);
      this.allModules.push(new module());
    }
  }

  _onReady(evt: any) {
    logger.info("Connected");
    if (this.client && this.client.user) {
      logger.info("Logged in as: ");
      logger.info(
        this.client.user.username + " - (" + this.client.user.id + ")"
      );
    }
  }

  _onChannelUpdate(oldCh: TextChannel, newCh: TextChannel) {
    for (const module of this.allModules) {
      if (module.onChannelUpdate) {
        module.onChannelUpdate(oldCh, newCh);
      }
    }
  }

  async _onReactAdd(
    messageReaction: discord.MessageReaction,
    user: discord.User
  ) {
    if (messageReaction.partial) {
      // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
      try {
        await messageReaction.fetch();
      } catch (error) {
        logger.error("Something went wrong when fetching the message: ", error);
        // Return as `reaction.message.author` may be undefined/null
        return;
      }
    }
    for (const module of this.allModules) {
      if (module.onReactAdd) {
        module.onReactAdd(messageReaction, user);
      }
    }
  }

  async _onReactRemove(
    messageReaction: discord.MessageReaction,
    user: discord.User
  ) {
    if (messageReaction.partial) {
      // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
      try {
        await messageReaction.fetch();
      } catch (error) {
        logger.error("Something went wrong when fetching the message: ", error);
        // Return as `reaction.message.author` may be undefined/null
        return;
      }
    }
    for (const module of this.allModules) {
      if (module.onReactRemove) {
        module.onReactRemove(messageReaction, user);
      }
    }
  }

  async _onMessage(msg: Message) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`

    if (msg.partial) {
      // If the message was removed the fetching might result in an API error, which we need to handle
      try {
        await msg.fetch();
      } catch (error) {
        logger.error("Something went wrong when fetching the message: ", error);
        // Return as `reaction.message.author` may be undefined/null
        return;
      }
    }
    if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;
    const args = msg.content.slice(config.prefix.length).split(/ +/);
    if (args) {
      const first = args.shift();
      if (first) {
        const command = first.toLowerCase();

        for (const module of this.allModules) {
          if (module.onMessage) {
            if (
              module.onMessageCommands &&
              module.onMessageCommands.includes(command)
            ) {
              module.onMessage(msg, args);
            }
          }
        }
      }
    }
  }
}
