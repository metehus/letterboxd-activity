const { createCanvas, loadImage } = require('canvas');
const { Constants } = require('../utils');
const { CanvasUtils } = require('../utils');
const moment = require('moment');

CanvasUtils.init();
CanvasUtils.registerFonts();

module.exports = async function(lang, { user, movie }) {
    const canvas = createCanvas(Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
    const ctx = canvas.getContext('2d');

    const Images = Promise.all([
        loadImage(movie.film.image.large),
        loadImage('./assets/icons/star.png'),
        loadImage('./assets/icons/half_star.png')
    ])

    ctx.fillStyle = "rgba(0, 0, 0, 0.65)"
    ctx.fillRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);

    const [ largePoster, star, halfStar ] = await Images;

    const MARGIN_X = 30;
    const MARGIN_Y = 30;

    const POSTER_H = Constants.CANVAS_HEIGHT - MARGIN_Y * 2;
    const POSTER_W = largePoster.width * (POSTER_H / largePoster.height);

    ctx.drawImage(largePoster, MARGIN_X, MARGIN_Y, POSTER_W, POSTER_H);

    const TEXT_MARGIN = MARGIN_X + POSTER_W + 15;

    ctx.fillStyle = "white";
    ctx.font = '20px "RobotoCondensed-Light"';

    if(movie.date.watched + 86400E3 < movie.date.published)
        ctx.fillText(lang.justWatchedIn.replace('{{0}}', moment(1318781876406).format(  lang.dateFormat)), TEXT_MARGIN, 50);
    else
        ctx.fillText(lang.justWatched, TEXT_MARGIN, 50);

    ctx.font = '30px "RobotoCondensed"';
    ctx.fillText(movie.film.title, TEXT_MARGIN, 90);
    let TITLE_TEXT_WIDTH = ctx.measureText(movie.film.title).width;
    ctx.font = '30px "RobotoCondensed-Light"';
    if(TITLE_TEXT_WIDTH < 340)
        ctx.fillText(`(${movie.film.year})`, TEXT_MARGIN + TITLE_TEXT_WIDTH + 5, 90);

    ctx.font = '20px "RobotoCondensed-Light"';
    ctx.fillText(lang.followMe, TEXT_MARGIN, 230);

    ctx.font = '25px "RobotoCondensed"';
    ctx.fillText(`@${user}`, TEXT_MARGIN, 260);
    // Rating
    if(movie.rating.text !== "None") {
        const fStar = Math.floor(movie.rating.score);
        const hStar = Math.ceil(movie.rating.score - Math.floor(movie.rating.score));

        for(let i = 0; i < fStar; i++) {
            ctx.drawImage(star, TEXT_MARGIN + (38 * i), 270, 35, 35)
        }

        if(hStar)
            ctx.drawImage(halfStar, TEXT_MARGIN + (38 * fStar), 270, 35, 35)
    }

    ctx.globalCompositeOperation = 'destination-over';
    ctx.drawBlurredImage(largePoster, 10, 0, -((Constants.CANVAS_WIDTH - Constants.CANVAS_HEIGHT) * 0.5), Constants.CANVAS_WIDTH, Constants.CANVAS_WIDTH);


    return canvas
};