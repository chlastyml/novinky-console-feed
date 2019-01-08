const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const draw = require('./draw');
const storage = require('./storage');
const update = require('./update').update;

const fs = require('fs');
// Load config.json
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

process.stdin.on('keypress', function (chunk, key) {
    // process.stdout.write('\nGet Chunk: ' + key.name + '\n');

    if (key && key.name == 'down') menuDown();
    if (key && key.name == 'up') menuUp();


    if (key && key.name == 'left') menuLeft();
    if (key && key.name == 'right') menuRight();

    if (key && key.name == 'r') {
        storage.articleSelected = 0;
        setMenu();
    }


    if (key && key.name == 'q') process.exit();
    if (key && key.ctrl && key.name == 'c') process.exit();

    if (key) {
        const numb = Number.parseInt(key.name);

        if (Number.isInteger(numb)) {
            storage.articleSelected = numb;
            setMenu();
        }
    }

    // console.log({ rss: config.rss.urls[storage.page] , title: storage.feed.title, page: storage.page, count: storage.countPage });
});

function menuUp() {
    if (storage.articleSelected !== 0)
        storage.articleSelected = storage.articleSelected - 1;
    setMenu();
}

function menuDown() {
    storage.articleSelected = storage.articleSelected + 1;
    setMenu();
}

function menuLeft() {
    if (storage.page !== 0) {
        storage.page = storage.page - 1;
        update();
    }
}

function menuRight() {
    if (storage.page < storage.countPage - 1) {
        storage.page = storage.page + 1;
        update();
    }
}


function setMenu() {
    draw.drawCanvas(storage.articleSelected);
}
