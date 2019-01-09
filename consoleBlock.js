
function central (text, modifyText) {
  const pad = Math.round((process.stdout.columns / 2) - (text.length / 2))

  let prefix = ''
  for (let i = 0; i < pad; i++) {
    prefix += ' '
  }

  return `${prefix}${modifyText || text}`
}

function writefy (text, blockSize = process.stdout.columns) {
  let index = blockSize
  let result = ''
  let prevStartIndex = 0
  let line = ''
  while (true) {
    // find space before index
    const spaceIndex = ((text, index) => {
      for (let i = index; i > 0; i--) {
        if (text[i] === ' ') {
          return i
        }
      }

      return index
    })(text, index)

    line = text.substring(prevStartIndex, spaceIndex)

    result += `${line}\n`

    prevStartIndex = spaceIndex + 1 // +1 because we have to remove space
    index = spaceIndex + blockSize

    if (index > text.length) {
      line = text.substring(prevStartIndex, text.length)
      result += `${line}`
      break
    }
  }

  return result
}

function centralWritefy (text, blockSize = process.stdout.columns) {
  const writefyText = writefy(text, blockSize)

  const splitting = writefyText.split('\n')
  let result = ''
  for (let i = 0; i < splitting.length; i++) {
    result += central(splitting[i]) + '\n'
  }
  return result
}

module.exports = {
  central,
  writefy,
  centralWritefy
}
