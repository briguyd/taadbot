import * as discord from 'discord.js';
import * as logger from 'winston';
import { Client, Message } from 'discord.js';
const config = require('../config.json');

export class Bot {

    private client: Client;

    constructor() {
        this.client = new discord.Client();
    }

    start() {
        logger.info('Bot starting');
        this.client.on('ready', this._onReady.bind(this));
        this.client.on('message', this._onMessage.bind(this));
        
        this.client.login(config.token);
    }

    _onReady(evt: any) {
        logger.info('Connected');
        logger.info('Logged in as: ');
        logger.info(this.client.user.username + ' - (' + this.client.user.id + ')');
    }

    _onMessage(msg: any) {
        // Our bot needs to know if it will execute a command
        // It will listen for messages that will start with `!`

        if (msg.content.substring(0, 1) == '!') {
            var args = msg.content.substring(1).split(' ');
            var cmd = args[0];

            args = args.splice(1);
            switch (cmd) {
                // !ping
                case 'ping':
                    msg.reply('Pong!');
                    break;
                // Just add any case commands if you want to..
                case 'test-your-might':
                    msg.channel.send('MORTAL KOMBAT!');
                    break;
                case 'fight':

                    let fightMessage = '<@' + msg.author.id + '> has declared a fight with ';
                    for (let [mentionedKey, mentionedUser] of msg.mentions.users) {
                        if (mentionedUser.bot) {
                            msg.reply('You can\'t fight with a bot, idiot.');
                            return;
                        }
                        fightMessage += '<@' + mentionedUser.id + '>';
                    }


                    // to: config.fight-channel,
                    msg.channel.send(fightMessage)
                        .then((message: any) => message.pin());

                    break;
            }
        }
    }
}