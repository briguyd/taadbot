import { Message, TextChannel, MessageReaction, User } from "discord.js";

export interface OnMessage {
  onMessage(msg: Message, args: string[]): void;
  onMessageCommands: string[];
}

export interface OnChannelUpdate {
  onChannelUpdate(oldCh: TextChannel, newCh: TextChannel): void;
}

export interface OnReactAdd {
  onReactAdd(messageReaction: MessageReaction, user: User): void;
}

export interface OnReactRemove {
  onReactRemove(messageReaction: MessageReaction, user: User): void;
}
