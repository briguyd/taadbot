
const Discord = require('discord.js');
const logger = require('winston');
const config = require('./config.json');
const client = new Discord.Client();
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
// var bot = new Discord.Client({
//     token: config.token,
//     autorun: true
// });
client.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(client.user.username + ' - (' + client.user.id + ')');
});


client.on('message', msg => {
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
                    .then(message => message.pin());

                break;
        }
    }
});

client.on('messageDelete', function (event) {
});

client.login(config.token);