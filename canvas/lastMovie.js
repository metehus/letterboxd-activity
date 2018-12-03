const { createCanvas, loadImage } = require('canvas');
const { Constants } = require('../utils');
const { CanvasUtils } = require('../utils');
const moment = require('moment');

const metacritic_colors = ['#6c3', '#fc3', '#f00'];

CanvasUtils.init();
CanvasUtils.registerFonts();

module.exports = async function(lang, { user, movie, omdb, tmdb }) {
    const canvas = createCanvas(Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
    const ctx = canvas.getContext('2d');
    let backgroundUrl = movie.film.image.large;

    if(tmdb.backdrop_path)
        backgroundUrl = `https://image.tmdb.org/t/p/w500/${tmdb.backdrop_path}`;

    let metacriticScr = omdb.Ratings.find(r => r.Source === "Metacritic") ? omdb.Ratings.find(r => r.Source === "Metacritic").Value.split('/')[0] : null;

    if(metacriticScr < 40)
        metacritic_score = 2;
    else if(metacriticScr < 61)
        metacritic_score = 1;
    else
        metacritic_score = 0;


    const Images = Promise.all([
        loadImage(movie.film.image.large),
        loadImage(backgroundUrl),
        loadImage('./assets/icons/star.png'),
        loadImage('./assets/icons/half_star.png'),
        loadImage('./assets/icons/metacritic.png'),
    ])

    ctx.fillStyle = "rgba(0, 0, 0, 0.65)"
    ctx.fillRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);

    ctx.fillStyle = metacritic_colors[metacritic_score];

    metacriticScr ? ctx.fillRect(560, 249, 60, 60) : null;

    ctx.fillStyle = "white";
    if(metacritic_score === 1)
        ctx.fillStyle = "black";
    ctx.font = 'bold 30px "RobotoCondensed"';
    ctx.textAlign = "center";
    metacriticScr ? ctx.fillText(metacriticScr, 590, 290) : null
    ctx.fillStyle = "white";

    let rtomatoes = omdb.Ratings.find(r => r.Source === "Rotten Tomatoes")
    rtomatoes ? ctx.fillText(rtomatoes.Value, 590, 230) : null;
    ctx.font = '15px "RobotoCondensed-Light"';
    rtomatoes ? ctx.fillText('Tomatometer', 590, 200) : null
    ctx.textAlign = "left";

    const [ largePoster, backgroundImage, star, halfStar, metacritic ] = await Images;

    const MARGIN_X = 30;
    const MARGIN_Y = 30;

    const POSTER_H = Constants.CANVAS_HEIGHT - MARGIN_Y * 2;
    const POSTER_W = largePoster.width * (POSTER_H / largePoster.height);

    ctx.drawImage(largePoster, MARGIN_X, MARGIN_Y, POSTER_W, POSTER_H);

    metacriticScr ? ctx.drawImage(metacritic, 602, 290, 15, 15) : null

    const TEXT_MARGIN = MARGIN_X + POSTER_W + 15;

    ctx.fillStyle = "white";
    ctx.font = '20px "RobotoCondensed-Light"';

    // if(movie.date.watched + 86400E3 < movie.date.published)
    //     ctx.fillText(lang.justWatchedIn.replace('{{0}}', moment(1318781876406).format(  lang.dateFormat)), TEXT_MARGIN, 50);
    // else
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
    ctx.drawBlurredImage(backgroundImage, 10, 0, -((Constants.CANVAS_WIDTH - Constants.CANVAS_HEIGHT) * 0.5), Constants.CANVAS_WIDTH, Constants.CANVAS_WIDTH);


    return canvas
};