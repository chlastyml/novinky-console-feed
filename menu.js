const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const draw = require('./draw');

let articleSelected = 0;

function resetSelectedArticle() {
    articleSelected = 0;
}

process.stdin.on('keypress', function (chunk, key) {
    // process.stdout.write('Get Chunk: ' + key.name + '\n');

    if (key && key.name == 'down') menuDown();
    if (key && key.name == 'up') menuUp();

    if (key && key.name == 'r') {
        articleSelected = 0;
        setMenu();
    }


    if (key && key.name == 'q') process.exit();
    if (key && key.ctrl && key.name == 'c') process.exit();

    if (key) {
        const numb = Number.parseInt(key.name);

        if(Number.isInteger(numb)){
            articleSelected = numb;
            setMenu();
        }
    }
});

function menuUp() {
    if (articleSelected !== 0)
        articleSelected = articleSelected - 1;
    setMenu();
}

function menuDown() {
    articleSelected = articleSelected + 1;
    setMenu();
}


function setMenu() {
    draw.drawCanvas(articleSelected);
}

module.exports = {
    resetSelectedArticle
}