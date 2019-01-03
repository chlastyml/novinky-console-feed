let Parser = require('rss-parser');
let parser = new Parser();
var beep = require('beepbeep')
beep();
process.stdout.write('\033c');

let url = 'https://www.novinky.cz/rss2/';

let counter = 0;
let addDots = true;

parser.parseURL(url).then(async feed => {
    console.log(feed.title);
    
    for (let i = 5; i >= 0; i--) {
        showFirstItemFromFeed(feed, i);
    }

    animateDots();

    while (true) {
        let start = new Date();
        feed = await reload(feed);
        let timeMs = new Date() - start;
        await sleep(1000 - timeMs);
    }
});

function reload(feedOld) {
    return new Promise((resolve, reject) => {
        parser.parseURL(url).then(feed => {
            if (compareFirstItemsFromFeeds(feed, feedOld)) {
                showFirstItemFromFeed(feed);
            }

            resolve(feed);
        }).catch(err => reject(err));
    });
}

function showFirstItemFromFeed(feed, number = 0) {
    const item = feed.items[number];
    const output = `${new Date(item.pubDate).toLocaleTimeString()} => ${item.title} \n`;


    process.stdout.clearLine();  // clear current text
    process.stdout.cursorTo(0);  // move cursor to beginning of line
    process.stdout.write(output);
}

function compareFirstItemsFromFeeds(firstFeed, secondFeed) {
    const fItem = firstFeed.items[0];
    const sItem = secondFeed.items[0];

    return fItem.guid != sItem.guid;
}

function animateDots() {
    return new Promise(async (resolve, reject) => {
        while(true){
            animate();
            await sleep(100);
        }
    });
}

function animate() {
    process.stdout.clearLine();  // clear current text
    process.stdout.cursorTo(0);  // move cursor to beginning of line

    // Calculate
    if (addDots) {
        counter++;
    } else {
        counter--;
    }

    if (counter === 0) {
        addDots = true;
    }
    if (counter === 30) {
        addDots = false;
    }

    let result = `Waiting....................................`;

    // Print
    
    process.stdout.write(result.substring(0, counter));
    
}

function sleep(time) {
    if (time < 10) time = 10;
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}