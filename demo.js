const parse = require('node-html-parser').parse;
const request = require("request");

function getContent(link) {
    return new Promise((resolve, reject) => {
        request(
            { uri: link },
            function (error, response, body) {
                const root = parse(body);

                const titleNode = findNode(root, { name: "tagName", value: "h1" });
                const perexNode = findNode(root, { name: "rawAttrs", value: "class=\"perex\"" })
                const contentNode = findNode(root, { name: "id", value: "articleBody" });

                let content = '\n\n\x1b[4m\x1b[1m\x1b[7m' + titleNode.rawText + '\x1b[0m \x1b[31m\n' + perexNode.rawText + '\x1b[0m\n';
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
            }
        );
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
    getContent
};