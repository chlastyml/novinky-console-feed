const loader = require('./loader');
const draw = require('./draw');

process.stdout.write('\033c');

let switchBool = false;
loader.reload().then(async feed => {
    while (true) {
        feed = await loader.reload();
        await draw.drawCanvas(feed);
        if(switchBool){
            console.log("*");
        }
        switchBool = !switchBool;
    }
});
