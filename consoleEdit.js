const chalk = require('chalk').default;

function reverse(text) { return `\x1b[1m\x1b[7m${text}\x1b[0m`; }

module.exports = {
    special: {
        title: text => chalk.underline(reverse(text))
    },
    bold: chalk.bold,
    red: chalk.red,
    reverse: reverse,
    underline: chalk.underline,

}
