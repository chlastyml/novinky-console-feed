const Parser = require('rss-parser');
const parser = new Parser();
const helper = require('./demo');

process.stdout.write('\033c');

const url = 'https://www.novinky.cz/rss2/';

parser.parseURL(url).then(async feed => {
    let fps = "";

    while (true) {
        let start = new Date();
        feed = await reload();
        await drawCanvas(feed);
        // await sleep(10000)
        let timeMs = new Date() - start;
        fps = `FPS: ${Math.round(1000 / timeMs)}`;
        console.log(fps);
    }
});

function reload() {
    return new Promise((resolve, reject) => {
        parser.parseURL(url).then(feed => {
            resolve(feed);
        }).catch(err => reject(err));
    });
}

function sleep(time) {
    if (time < 10) time = 10;
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}


async function drawCanvas(feed, actualNew = 0) {
    if (!feed) {
        process.stdout.write("UNDEFINED!!!");
        return;
    }

    const title = feed.title;
    const items = feed.items;

    if (feed.items.length <= actualNew) {
        process.stdout.write("ERROR !");
        return;
    }

    const mainNew = feed.items[actualNew];

    let canvas = `\n${new Date(mainNew.pubDate).toLocaleTimeString()} - ${title}`;
    canvas += await helper.getContent(mainNew.link);

    // canvas += `\n${new Date(mainNew.pubDate).toLocaleTimeString()} === ${mainNew.title}`;
    // canvas += `\n\n${mainNew.content}\n`;
    // canvas += `\n${mainNew.link}\n\n`;

    for (let i = 0; i < 10; i++) {
        if (i >= items.length - 1) { break; }
        const item = items[i];
        canvas += `\n${new Date(item.pubDate).toLocaleTimeString()} => ${item.title}`;
    }

    canvas += `\n\n${loading('Waiting....................................')}\n\n\n`;

    process.stdout.write('\033c');
    process.stdout.write(canvas);
}

let counter = 0;
let addDots = true;
function loading(loadingText) {
    if (addDots) {
        counter++;
    } else {
        counter--;
    }

    if (counter === 0) {
        addDots = true;
    }
    if (counter === loadingText.length - 1) {
        addDots = false;
    }
    return loadingText.substring(0, counter);
}