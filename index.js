let Parser = require('rss-parser');
const readline = require('readline');

let parser = new Parser();
process.stdout.write('\033c');

let url = 'https://www.novinky.cz/rss2/';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});





let feed = undefined;
parser.parseURL(url).then(async feed => {
    let fps = "";

    while (true) {
        let start = new Date();
        // feed = await reload();
        await sleep(1000);
        drawCanvas(feed);
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


function drawCanvas(feed, actualNew = 0) {
    process.stdout.write('\033c');

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

    let canvas = `\n${title}\n`;

    canvas += `\n\n${mainNew.title}`;
    canvas += `\n\n${new Date(mainNew.pubDate).toLocaleTimeString()}`;
    canvas += `\n\n${mainNew.content}`;
    canvas += `\n\n${mainNew.link}`;

    for (let i = 0; i < 10; i++) {
        if (i >= items.length - 1) { break; }
        const item = items[i];
        canvas += `\n${new Date(item.pubDate).toLocaleTimeString()} => ${item.title}`;
    }

    canvas += `\n\n${loading('Waiting....................................')}\n\n\n`;

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