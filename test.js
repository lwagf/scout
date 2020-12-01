const latestTweets = require('util').promisify(require('latest-tweets'));
const axios = require('axios');
const cheerio = require('cheerio');
var module = {};

async function main() {
    let response;
    try {
        response = await axios({
            method : 'get',
            url : 'https://ygorganization.com/'
        });
    } catch (error) {
        return console.warn(`** Failed to GET ygorganization: ${error.toString()}`);
    }
    const $ = cheerio.load(response.data);
    const latestUrl = $('div.article-container > article a.more-link').attr("href");

    if (!latestUrl) {
        return console.warn('** !latestUrl not found');
    }

    if (latestUrl != module.latestUrl) {
        module.latestUrl = latestUrl;
        console.log('done', module, latestUrl);
    }
}
main();
