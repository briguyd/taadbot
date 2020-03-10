import { Message, TextChannel } from "discord.js";

export interface OnMessage {
  onMessage(msg: Message, args: string[]): void;
  onMessageCommands: string[];
}

export interface onChannelUpdate {
  onChannelUpdate(oldCh: TextChannel, newCh: TextChannel): void;
}
