import { Message, TextChannel } from "discord.js";

export interface OnMessage {
  onMessage(msg: Message): void;
}

export interface onChannelUpdate {
  onChannelUpdate(oldCh: TextChannel, newCh: TextChannel): void;
}
