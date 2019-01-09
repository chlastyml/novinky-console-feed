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

    let article = `(${orderNumber}) ${articleTime} => ${item.title}`

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
      // resolve(JSON.stringify(result, null, 4))

      let content = ''

      // head
      content += consoleBlock.central(result.title, consoleEdit.special.title(consoleEdit.red(result.title))) + '\n'
      content += consoleEdit.red(consoleBlock.centralWritefy(result.perex)) + '\n'

      result.content.forEach(element => {
        if (element.hasTitle) {
          content += consoleEdit.bold(consoleBlock.central(element.title)) + '\n'
        }
        content += consoleBlock.centralWritefy(element.text) + '\n'
      })

      content += '\n\n'
      content += result.discussion.text
      content += '\n'
      content += result.discussion.link
      content += '\n'

      resolve(content)
    }).catch(err => reject(err))
    // loader.getHtml(link).then(body => {
    //   const root = parse(body)

    //   // Init variable
    //   const titleNode = findNode(root, { name: 'tagName', value: 'h1' })
    //   const perexNode = findNode(root, { name: 'rawAttrs', value: 'class="perex"' })
    //   const contentNode = findNode(root, { name: 'id', value: 'articleBody' })

    //   const discussionNode = findNode(root, { name: 'id', value: 'discussionEntry' })
    //   const discussionLinkNode = findNode(discussionNode, { name: 'tagName', value: 'a' })
    //   const discussionCount = discussionNode.childNodes[1].childNodes[2]

    //   let content = ''

    //   // head
    //   content += '\n\n'
    //   content += consoleEdit.special.title(consoleEdit.red(titleNode.rawText))
    //   const perex = `${consoleEdit.red(perexNode.rawText)}`
    //   content += perex ? `\n${perex}` : ''
    //   content += '\n'

    //   // content
    //   contentNode.childNodes.forEach(child => {
    //     if (child.tagName) {
    //       // paragraf
    //       if (child.tagName === 'p' && child.rawAttrs === '') {
    //         content += `\n${child.rawText}`
    //       }
    //       // nadpis
    //       if (child.tagName[0] === 'h') {
    //         content += '\n\n\x1b[1m' + child.rawText + '\x1b[0m'
    //       }
    //     }
    //   })

    //   content += '\n\n'
    //   content += `${discussionCount}`.substring(3)
    //   content += '\n'
    //   content += createDiscussionLink(discussionLinkNode.rawAttrs)
    //   content += '\n'

    //   resolve(content)
    // })
  })
}

module.exports = {
  drawCanvas
}
