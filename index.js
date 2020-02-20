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
const regexSearch = /^scout!([^\/]+)(?:\/([^\/]+)+)*$/;

Client.on('message', async (msg) => {
    const match = msg.content.match(regexSearch) || [];
    const cardTitle = match[1];
    if (cardTitle && !msg.author.bot){
        const searchModifier = match[2];
        const channelSent = msg.channel;
        return moduleSearch(channelSent, cardTitle, searchModifier).catch((error) => {
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
    const channelNews = Client.channels.get(_config.channelNews);
    if (channelNews) {
        moduleSchedule.start(channelNews);
    } else {
        console.warn(`** Couldn't find channel ${_config.channelNews}`);
    }
});

async function main() {
    Client.login(botToken);
}

return main().catch((error) => console.exception(error));
