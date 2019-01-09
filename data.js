const loader = require('./loader')
const parse = require('node-html-parser').parse

function parseHtml (root) {
  const title = getTitle(root)
  const perex = getPerex(root)
  const content = getContent(root)
  const discussion = getDiscussion(root)

  return {
    title,
    perex,
    content,
    discussion
  }
}

function getTitle (root) {
  const titleNode = findNode(root, { name: 'tagName', value: 'h1' })
  return titleNode.rawText.trim()
}

function getPerex (root) {
  const perexNode = findNode(root, { name: 'rawAttrs', value: 'class="perex"' })
  return perexNode.rawText.trim()
}

function getContent (root) {
  const contentNode = findNode(root, { name: 'id', value: 'articleBody' })

  const content = []
  let paragraf = {
    title: '',
    hasTitle: false,
    text: ''
  }
  let textArray = []
  for (let i = 0; i < contentNode.childNodes.length; i++) {
    const child = contentNode.childNodes[i]
    if (child.tagName) {
      // paragraf
      if (child.tagName === 'p' && child.rawAttrs === '') {
        textArray.push(child.rawText.trim())
      }
      // nadpis
      if (child.tagName[0] === 'h') {
        paragraf.text = textArray.join(' ')
        content.push(paragraf)
        paragraf = {
          title: child.rawText.trim(),
          hasTitle: true,
          text: ''
        }
      }
    }
  }
  paragraf.text = textArray.join(' ')
  content.push(paragraf)

  return content
}

function getDiscussion (root) {
  const discussionNode = findNode(root, { name: 'id', value: 'discussionEntry' })
  const discussionLinkNode = findNode(discussionNode, { name: 'tagName', value: 'a' })
  const discussionCount = discussionNode.childNodes[1].childNodes[2]

  const link = `https://www.novinky.cz${replaceAll(
    replaceAll(
      replaceAll(discussionLinkNode.rawAttrs, '&amp;', '&'),
      'href="', ''), '"', '')}`

  const text = discussionCount.rawText.replace('-', '').trim()
  const count = Number.parseInt(text)

  return {
    link,
    count,
    text
  }
}

function findNode (root, con) {
  for (let i = 0; i < root.childNodes.length; i++) {
    const child = root.childNodes[i]
    const childValue = child[con.name]
    if (childValue && childValue === con.value) {
      return child
    }

    const found = findNode(child, con)

    if (found) {
      return found
    }
  }

  return undefined
}

function replaceAll (str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace)
}
function escapeRegExp (str) {
  return str.replace(/([.*+?^=!:${}()|\]\\])/g, '\\$1')
}

function getContentData (link) {
  return new Promise((resolve, reject) => {
    loader.getHtml(link).then(body => {
      const root = parse(body)
      const result = parseHtml(root)

      resolve({
        ...result,
        link
      })
    }).catch(err => reject(err))
  })
}

module.exports = {
  getContentData: getContentData
}
