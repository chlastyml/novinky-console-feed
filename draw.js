const parse = require('node-html-parser').parse;

const loader = require('./loader');
const consoleEdit = require('./consoleEdit');

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

    let canvas = `${new Date(mainNew.pubDate).toLocaleTimeString()} - ${title}`;
    

    canvas += "\n";

    for (let i = 0; i < 20; i++) {
        if (i >= items.length - 1) { break; }
        const item = items[i];

        const orderNumber = i.toString().padStart(2);
        const articleTime = new Date(item.pubDate).toLocaleTimeString().padStart(9);

        const article = `(${orderNumber}) ${articleTime} => ${item.title}`;

        if(i == actualNew){
            canvas += consoleEdit.bold(`\n${article}`);
        }else{
            canvas += `\n${article}`;
        }
    }

    canvas += await getContent(mainNew.link);

    canvas += "\n\n";

    process.stdout.write('\033c');
    process.stdout.write(canvas);
}

function getContent(link) {
    return new Promise((resolve, reject) => {
        loader.getHtml(link).then(body => {
            const root = parse(body);

            // Init variable
            const titleNode = findNode(root, { name: "tagName", value: "h1" });
            const perexNode = findNode(root, { name: "rawAttrs", value: "class=\"perex\"" })
            const contentNode = findNode(root, { name: "id", value: "articleBody" });

            let content = "";

            // head
            content += '\n\n';
            content += consoleEdit.special.title(titleNode.rawText);
            content += '\n';
            content += consoleEdit.red(perexNode.rawText);
            content += '\n';
            
            // content
            contentNode.childNodes.forEach(child => {
                if (child.tagName) {
                    // paragraf
                    if (child.tagName === "p" && child.rawAttrs === "") {
                        content += `\n${child.rawText}`;
                    }
                    // nadpis
                    if (child.tagName[0] === 'h') {
                        content += '\n\n\x1b[1m' + child.rawText + '\x1b[0m';
                    }
                }
            });

            resolve(content);
        });
    });
}

function findNode(root, con) {
    for (let i = 0; i < root.childNodes.length; i++) {
        const child = root.childNodes[i];
        const childValue = child[con.name];
        if (childValue && childValue === con.value) {
            return child;
        }

        const found = findNode(child, con);

        if (found) {
            return found;
        }
    }

    return undefined;
}

function splitVety(str) {
    let result = "";
    const res = str.split('. ');
    for (let i = 0; i < res.length; i++) {
        const veta = res[i];
        if (veta.length < 10) {
            result += `${veta}`;
        } else {
            result += `\n${veta}`;
        }
        if (veta[veta.length - 1] !== '.') {
            result += `.`;
        }
    }
    return result;
}

module.exports = {
    drawCanvas
}