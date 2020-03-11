import { Message, TextChannel, MessageReaction, User } from "discord.js";

export interface OnMessage {
  onMessage(msg: Message, args: string[]): Promise<boolean>;
  onMessageCommands: string[];
}

export interface OnChannelUpdate {
  onChannelUpdate(oldCh: TextChannel, newCh: TextChannel): Promise<boolean>;
}

export interface OnReactAdd {
  onReactAdd(messageReaction: MessageReaction, user: User): Promise<boolean>;
}

export interface OnReactRemove {
  onReactRemove(messageReaction: MessageReaction, user: User): Promise<boolean>;
}
