const Parser = require('rss-parser')
const parser = new Parser()

const request = require('request')

function reload (rssLink) {
  return new Promise((resolve, reject) => {
    parser.parseURL(rssLink).then(feed => {
      resolve(feed)
    }).catch(err => reject(err))
  })
}

function getHtml (link) {
  return new Promise((resolve, reject) => {
    request(
      { uri: link },
      function (error, response, body) {
        if (error) reject(error)
        else resolve(body)
      }
    )
  })
}

// reload().then(feed => {
//     console.log(feed);
// });

module.exports = {
  reload,
  getHtml
}
