const axios = require('axios');
module.exports = async (channelSent, cardTitle, searchModifier) => {

    const paramsRequest = {
        sort : 'id'
    };

    //Default to fuzzy search (fname), however use exact if specified
    if (searchModifier === 'exact') {
        paramsRequest.name = cardTitle;
    } else {
        paramsRequest.fname = cardTitle;
    }

    const response = await axios({
        method : 'get',
        url : 'https://db.ygoprodeck.com/api/v6/cardinfo.php',
        params : paramsRequest,
        // Some non 200/300's are ok - see below
        validateStatus : () => true
    });
    if (response.status === 400) {
        //This is usually just that the user's card wasn't found - would be silly to log all of these
        return channelSent.send(`Card '${cardTitle}' not found`);
    } else if (response.status !== 200) {
        //This is assuming we don't ever receive redirects
        throw `Non ok status ${response.status} - ${JSON.stringify(response.data)}`;
    }
    const cardFirst = response.data[0];
    if (!cardFirst){
        //This should never happen!
        throw `No cardFirst for '${cardTitle}'`;
    }

    const fieldsEmbed = [
        {
            name : 'classification',
            value : cardFirst.type,
            inline : true
        },
        {
            name : 'type',
            value : cardFirst.race,
            inline : true
        },
        {
            name : 'archetype',
            value : cardFirst.archetype || 'none',
            inline : true
        }
    ];
    if (cardFirst.level) {
        fieldsEmbed.push(
            {
                name : 'level / rank',
                value: cardFirst.level,
                inline : true
            }
        );
    }
    if (cardFirst.linkval) {
        fieldsEmbed.push(
            {
                name : 'link rating',
                value: cardFirst.linkval,
                inline : true
            }
        );
    }
    if (cardFirst.attribute) {
        //Its a monster
        fieldsEmbed.push(
            {
                name : 'attribute',
                value: cardFirst.attribute,
                inline : true
            },
            {
                name : 'atk',
                value: cardFirst.atk,
                inline : true
            },
            {
                name : 'def',
                value: cardFirst.def,
                inline : true
            }
        );
    }

    return channelSent.send({
        embed : {
            color : 0xFCBA03, //a yellow to match qli scout :)
            image : {
                url : (cardFirst.card_images[0] || {}).image_url
            },
            title : cardFirst.name,
            description : cardFirst.desc,
            fields: fieldsEmbed,
            footer : {
                text : `${cardFirst.id} | made by logan`
            }
        }
    });
};
