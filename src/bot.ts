import * as discord from "discord.js";
import * as logger from "winston";
import { Client, TextChannel, Message, GuildAuditLogs } from "discord.js";
const config = require("../config.json");

export class Bot {
  private PIN_EMOJI = "📌";
  private client: Client;

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
    if (oldCh.topic !== newCh.topic) {
      newCh.guild
        .fetchAuditLogs({
          limit: 1,
          type: GuildAuditLogs.Actions.CHANNEL_UPDATE
        })
        .then(audit => {
          if (audit && audit.entries) {
            const first = audit.entries.first();
            if (first) {
              const userId = first.executor.id;
              if (first.changes) {
                for (const change of first.changes) {
                  if (change.key === "topic") {
                    newCh.send(
                      "<@" + userId + "> changed topic to `" + newCh.topic + "`"
                    );
                  }
                }
              }
            }
          }
        });
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
    if (messageReaction.emoji.name === this.PIN_EMOJI) {
      messageReaction.message.pin();
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
    if (messageReaction.emoji.name === this.PIN_EMOJI) {
      let shouldUnpin = true;
      if (messageReaction.message.reactions) {
        for (let [reactKey, reaction] of messageReaction.message.reactions
          .cache) {
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
    if (msg.content.substring(0, 1) == "!") {
      var args = msg.content.substring(1).split(" ");
      var cmd = args[0];

      args = args.splice(1);
      switch (cmd) {
        // !ping
        case "ping":
          msg.reply("Pong!");
          break;
        // Just add any case commands if you want to..
        case "test-your-might":
          msg.channel.send("MORTAL KOMBAT!");
          break;
        case "fight":
          let fightMessage =
            "<@" + msg.author.id + "> has declared a fight with ";
          for (let [mentionedKey, mentionedUser] of msg.mentions.users) {
            if (mentionedUser.bot) {
              msg.reply("You can't fight with a bot, idiot.");
              return;
            }
            fightMessage += "<@" + mentionedUser.id + ">";
          }

          // to: config.fight-channel,
          msg.channel.send(fightMessage).then((message: any) => message.pin());

          break;
      }
    }
  }
}
