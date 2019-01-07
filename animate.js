
const defaultLoadString = 'Waiting....................................';

let counter = 0;
let addDots = true;
function getLoadingText(loadingText = defaultLoadString) {
    if (addDots) {
        counter++;
    } else {
        counter--;
    }

    if (counter === 0) {
        addDots = true;
    }
    if (counter === loadingText.length - 1) {
        addDots = false;
    }
    return loadingText.substring(0, counter);
}

module.exports = {
    getLoadingText
};