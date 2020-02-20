const latestTweets = require('latest-tweets');
const nodeSchedule = require('node-schedule');

module.exports = {
    start : (channelNews) => {
        let latestUrl;
        nodeSchedule.scheduleJob('*/5 * * * *', async () => {
            let tweets;
            try {
                tweets = await latestTweets('ygorganization');
            } catch (error) {
                return console.warn(`** Failed to retrieve tweets: ${error.toString()}`);
            }
            const tweetFirst = tweets[0];
            if (tweetFirst.url != latestUrl) {
                const content = tweetFirst.content;
                //Filter out the irrelevant tweets
                if (content.includes("[Today's Yu-Gi-Oh! OCG Card Intro") || content.includes("[Quiz for Everyone]")) {
                    return;
                }
                latestUrl = tweetFirst.url;
                //Post to discord channel
                return channelNews.send(content);
            }
        });
    }
};
