const sleep = require('./helper').sleep;
const loader = require('./loader');
const draw = require('./draw');
const storage = require('./storage');

const fs = require('fs');
// Load config.json
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

storage.countPage = config.rss.urls.length;

let continueUpdating = true;

function end() {
    continueUpdating = false;
}

async function startUpdate() {
    while (continueUpdating) {
        await update();

        await sleep(3 * 60 * 1000); // 3 minute
    }
}

async function update() {
    const feed = await loader.reload(config.rss.urls[storage.page]);

    if (feed.items[0].title != storage.lastTitle) {
        storage.articleSelected = 0;
        storage.lastTitle = feed.items[0].title;
        storage.feed = feed;
        await draw.drawCanvas(storage.articleSelected);
    }
}

module.exports = {
    end,
    startUpdate,
    update
}
