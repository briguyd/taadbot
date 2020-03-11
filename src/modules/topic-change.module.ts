import { OnChannelUpdate } from "./discord-event-handlers";
import { TextChannel, GuildAuditLogs } from "discord.js";

import { FightBotModule } from "./fight-bot-module";

@FightBotModule.register
export class TopicChange implements OnChannelUpdate {
  async onChannelUpdate(
    oldCh: TextChannel,
    newCh: TextChannel
  ): Promise<boolean> {
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
    return true;
  }
}
