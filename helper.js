
function sleep (time) {
  if (time < 10) time = 10
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

module.exports = {
  sleep
}
