# scout
### A Yu-Gi-Oh! Discord bot

This bot provides news articles every 5th minute, and a card search by name via the prefix `scout!`.

Special thanks to:
* Twitter @ygorginization for news
* https://db.ygoprodeck.com/ for their card API

### Commands

`scout!<card name>/<search modifier>` - Searches a card by name and returns an informative embed. This can take in 1 of the following modifiers:

*   `exact` - Does the default fuzzy search not return the card you want? Use exact!

    If you ran `scout!stardust dragon`, due to the card id order this will actually return `Malefic Stardust Dragon` when you might be looking for `Stardust Dragon`.
    So instead, do `scout!stardust dragon/exact`
