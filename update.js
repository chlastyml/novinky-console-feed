const sleep = require('./helper').sleep;
const loader = require('./loader');
const menu = require('./menu');
const draw = require('./draw');
const storage = require('./storage');

let continueUpdating = true;

function end() {
    continueUpdating = false;
}

async function startUpdate() {
    while (continueUpdating) {
        const feed = await loader.reload();

        if(!storage.feed || feed.toString() != storage.feed.toString()){
            menu.resetSelectedArticle();
            storage.feed = feed;
            await draw.drawCanvas();
        }

        // await sleep(60 * 1000); // 1 minute
        // console.log(new Date());
        
        await sleep( 1000); // 1 minute

    }
}

module.exports = {
    end,
    startUpdate
}