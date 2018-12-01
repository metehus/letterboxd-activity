const { createCanvas, loadImage } = require('canvas');
const { Constants } = require('../utils');
const { CanvasUtils } = require('../utils');

const icon = loadImage('./assets/icons/error.png');
CanvasUtils.init();
CanvasUtils.registerFonts();

module.exports = async function(lang, user) {
    const canvas = createCanvas(Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
    const ctx = canvas.getContext('2d');

    const grd = ctx.createLinearGradient(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);

    grd.addColorStop(0, "#ff233f");
    grd.addColorStop(1, "#93291E");

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);

    ctx.fillStyle = "white";
    ctx.font = '25px "RobotoCondensed-Light"'

    ctx.fillText(lang.error, 110, 100)

    ctx.textAlign="center";

    let justWatched = lang.invalidUser.replace('{{0}}', user)
    ctx.printTextBox(justWatched, Constants.CANVAS_WIDTH / 2, 170, 30, 600);


    ctx.drawImage(await icon, 30, 30, 80, 80);

    return canvas
}