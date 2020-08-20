import { Client, TextChannel, MessageEmbed } from "discord.js";
import { FightBotModule } from "./fight-bot-module";
import * as logger from "winston";
const config = require("../../config.json");
const fetch = require('node-fetch');
@FightBotModule.register
export class LibsynFeed {

  private lastUpdateMap = new Map<string, Date>();

  constructor(private client: Client) {

    if (config && config.libsynFeeds && config.libsynFeeds.length > 0) {
      for (const feed of config.libsynFeeds) {
        logger.info('Adding libsyn feed for ' + feed.feedURL);
        this.lastUpdateMap.set(feed.feedURL, new Date());
        this.checkFeed(feed, this.lastUpdateMap, this.client);
        setInterval(this.checkFeed, 60 * 1000, feed, this.lastUpdateMap, this.client);
      }

    }
  }

  private async checkFeed(feedConfig: any, lastUpdateMap: Map<string, Date>, client: Client) {
    const response = await fetch(feedConfig.feedURL);
    const body = await response.text();

    let Parser = require('rss-parser');
    let parser = new Parser();
    const lastUpdate = lastUpdateMap.get(feedConfig.feedURL) || new Date();
    parser.parseString(body, function (err: any, feed: any) {
      if (err) {
        logger.error(err);
      }
      let newUpdateTimestamp = lastUpdateMap.get(feedConfig.feedURL) || new Date();
      for (const item of feed.items) {
        const updateTimestamp = new Date(item.isoDate);
        if (updateTimestamp > lastUpdate) {
          if (updateTimestamp > newUpdateTimestamp) {
            newUpdateTimestamp = updateTimestamp;
          }
          this.postFeedItem(item, feedConfig, client);
        }
      }


      lastUpdateMap.set(feedConfig.feedURL, newUpdateTimestamp);
      feed = null;
    });
    parser = null;
    Parser = null;
  }

  private postFeedItem(item: any, feed: any, client: Client) {
    const embed = new MessageEmbed()
      .setColor('#fd6e88')
      .setTitle(item.title)
      .setDescription(item.contentSnippet)
      .setURL(item.link)
      .setImage(item.itunes.image)
      .setAuthor(feed.title, feed.image.url)
      .setTimestamp(new Date(item.pubDate));
    client.channels.fetch('' + feed.postChannel).then((channel: TextChannel) => channel.send(embed)).catch(console.error);
  }
}
