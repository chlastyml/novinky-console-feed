const consoleEdit = require('./consoleEdit')
const consoleBlock = require('./consoleBlock')
const storage = require('./storage')
const getContentData = require('./data').getContentData

async function drawCanvas (actualNew = 0) {
  const feed = storage.feed

  if (!feed) {
    process.stdout.write('UNDEFINED!!!')
    return
  }

  const title = feed.title
  const items = feed.items

  if (feed.items.length <= actualNew) {
    process.stdout.write('ERROR !')
    return
  }

  const mainNew = feed.items[actualNew]

  console.log()
  console.log()
  console.log(JSON.stringify(mainNew, null, 2))
  console.log()
  console.log(mainNew.link)
  console.log()

  let canvas = `${new Date(mainNew.pubDate).toLocaleTimeString()} - ${title}`

  canvas += '\n' + createMenuItem(items, actualNew)
  canvas += '\n\n'

  canvas += await getContent(mainNew.link)

  canvas += `\n\nCela zprava na ${mainNew.link}`

  process.stdout.write('\x1B[2J\x1B[0f')
  process.stdout.write(canvas)
}

function createMenuItem (items, actualNew) {
  const maxArticles = 20
  const menuSize = 10

  let menuIndexStart = actualNew - Math.round(menuSize / 2)
  if (menuIndexStart < 0) {
    menuIndexStart = 0
  }

  let menuIndexEnd = menuIndexStart + menuSize
  if (menuIndexEnd >= maxArticles) {
    menuIndexStart = maxArticles - menuSize
    menuIndexEnd = maxArticles
  }

  let result = ''

  for (let i = menuIndexStart; i < menuIndexEnd; i++) {
    if (i >= maxArticles - 1) { break }
    const item = items[i]

    const orderNumber = i.toString() // .padStart(1);
    const articleTime = new Date(item.pubDate).toLocaleTimeString().padStart(9)

    const linkEx = item.link.indexOf('www.novinky.cz') > -1 ? '' : '(EXT) '

    let article = `(${orderNumber}) ${articleTime} => ${linkEx}${item.title}`

    if (article.length > process.stdout.columns) {
      article = article.substring(0, process.stdout.columns - 4) + '...'
    }

    if (i === actualNew) {
      result += consoleEdit.reverse(`\n${article}`)
    } else {
      result += `\n${article}`
    }
  }

  return result
}

function getContent (link) {
  return new Promise((resolve, reject) => {
    getContentData(link).then(result => {
      const content = createContent(result)
      resolve(content)
    }).catch(err => reject(err))
  })
}

function createContent (data) {
  let content = ''

  // head
  content += consoleBlock.central(data.title, consoleEdit.special.title(consoleEdit.red(data.title))) + '\n'
  content += consoleEdit.red(consoleBlock.centralWritefy(data.perex)) + '\n'

  data.content.forEach(element => {
    if (element.hasTitle) {
      content += consoleEdit.bold(consoleBlock.central(element.title)) + '\n'
    }
    content += consoleBlock.centralWritefy(element.text) + '\n'
  })

  content += '\n\n'
  content += data.discussion.text
  content += '\n'
  content += data.discussion.link
  content += '\n'

  return content
}

module.exports = {
  drawCanvas
}
