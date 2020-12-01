const axios = require('axios');
const cheerio = require('cheerio');
const nodeSchedule = require('node-schedule');

module.latestUrl = null;
module.exports = {
    start : (channelNews) => {
        nodeSchedule.scheduleJob('*/5 * * * *', async () => {
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
                //Post to discord channel
                return channelNews.send(latestUrl);
            }
        });
    }
};
