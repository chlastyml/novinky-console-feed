const fs = require('fs');
const Parser = require('rss-parser');
const parser = new Parser();

const request = require("request");

// Load config.json
let config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

function reload() {
    return new Promise((resolve, reject) => {
        parser.parseURL(config.rss.url).then(feed => {
            resolve(feed);
        }).catch(err => reject(err));
    });
}

function getHtml(link) {
    return new Promise((resolve, reject) => {
        request(
            { uri: link },
            function (error, response, body) {
                resolve(body);
            }
        );
    });
}

// reload().then(feed => {
//     console.log(feed);
// });


module.exports = {
    reload,
    getHtml
};