import { Client, TextChannel, MessageEmbed } from "discord.js";
import { FightBotModule } from "./fight-bot-module";
import * as logger from "winston";
const config = require("../../config.json");
@FightBotModule.register
export class LibsynFeed {
  private lastUpdateTimestamp = new Date();

  constructor(private client: Client) {

    if (config && config.libsynFeeds && config.libsynFeeds.length > 0) {
      for (const feed of config.libsynFeeds) {
        logger.info('Adding libsyn feed for ' + feed.feedURL);
        this.checkFeed(feed);
        setInterval(this.checkFeed.bind(this, feed), 60 * 1000);
      }

    }
  }

  private checkFeed(feedConfig: any) {
    const Parser = require('rss-parser');
    const parser = new Parser();


    (async () => {
      let feed = await parser.parseURL(feedConfig.feedURL);
      let newUpdateTimestamp = this.lastUpdateTimestamp;
      feed.items.forEach((item: any) => {
        const updateTimestamp = new Date(item.isoDate);
        if (updateTimestamp > this.lastUpdateTimestamp) {
          if (updateTimestamp > newUpdateTimestamp) {
            newUpdateTimestamp = updateTimestamp;
          }
          this.postFeedItem(item, feed);
        }
      });
      this.lastUpdateTimestamp = newUpdateTimestamp;
    })();
  }

  private postFeedItem(item: any, feed: any) {
    const embed = new MessageEmbed()
      .setColor('#fd6e88')
      .setTitle(item.title)
      .setDescription(item.contentSnippet)
      .setURL(item.link)
      .setImage(item.itunes.image)
      .setAuthor(feed.title, feed.image.url)
      .setTimestamp(new Date(item.pubDate));
    this.client.channels.fetch('' + feed.postChannel).then((channel: TextChannel) => channel.send(embed)).catch(console.error);
  }
}
