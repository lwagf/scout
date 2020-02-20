/*
 *  Scout - a Yu-Gi-Oh! discord bot
 *
 *  The bot has 2 main functions:
 *   -  Fetch news articles every 5th minute - schedule.js
 *   -  Provide a card text search - search.js
 */

const _packageJson = require('./package.json');
console.log(`Starting Scout ${_packageJson.version}`);
const _config = require('./config.json');
const botToken = _config.botToken;
if (!botToken) {
    return console.exception('No bot token in config - not continuing');
}
if (!_config.channelNews) {
    console.warn('** No channel specified for posting news **');
}
const discord = require('discord.js');
const Client = new discord.Client();
const moduleSchedule = require('./schedule.js');
const moduleSearch = require('./search.js');
const regexSearch = /scout!(.+)/;

Client.on('message', async (msg) => {
    const cardTitle = (msg.content.match(regexSearch) || [])[1];
    if (cardTitle && !msg.author.bot){
        const channelSent = msg.channel;
        return moduleSearch(channelSent, cardTitle).catch((error) => {
            console.warn(`** Couldn't return data for '${cardTitle}' (${error.toString()}) **`);
            channelSent.send('An error occured');
        });
    }
});

Client.on('ready', async () => {
    const countServers = Client.guilds.size;
    const user = Client.user;
    console.info(`Logged in as ${user.tag}!`);
    user.setActivity(`Serving YGO data on ${countServers} servers`);
    moduleSchedule.start();
});

async function main() {
    Client.login(botToken);
}

return main().catch((error) => console.exception(error));
