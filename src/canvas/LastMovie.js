const { createCanvas } = require('canvas')
const moment = require('moment')

const { CANVAS_HEIGHT, CANVAS_WIDTH } = require('../utils/Constants')

const metacriticColors = ['#6c3', '#fc3', '#f00'];

module.exports = async (lang, { user, movie, omdb, tmdb }) => {
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
  const ctx = canvas.getContext('2d')

  let backgroundUrl = movie.film.image.large
  let metacriticRating = omdb.Ratings.find(r => r.Source === 'Metacritic')
  let metacriticScr = metacriticRating ? metacriticRating.Value.split('/')[0] : null
  let metacriticScore = 0;

  if (tmdb.backdrop_path) backgroundUrl = `https://image.tmdb.org/t/p/w500/${tmdb.backdrop_path}`

  if (metacriticScr < 40) metacriticScore = 2
  else if (metacriticColors < 61) metacriticScore = 1

  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  ctx.fillStyle = metacriticColors[metacriticScore]
  metacriticScr && ctx.fillRect(560, 249, 60, 60)

  ctx.fillStyle = 'white'
  if (metacriticScore === 1) ctx.fillStyle = 'black'
  ctx.font = 'bold 30px "RobotoCondensed"'
  ctx.textAlign = 'center'
  metacriticScr && ctx.fillText(metacriticScr, 590, 290)
  ctx.fillStyle = 'white'

  let rtomatoes = omdb.Ratings.find(r => r.Source === 'Rotten Tomatoes')
  rtomatoes && ctx.fillText(rtomatoes.Value, 590, 230)
  ctx.font = '15px "RobotoCondensed-Light"'
  rtomatoes && ctx.fillText('Tomatometer', 590, 200)
  ctx.textAlign = 'left'

  const [ largePoster, backgroundImage, star, halfStar, metacritic ] = await Promise.all([
    loadImage(movie.film.image.large),
    loadImage(backgroundUrl),
    loadImage('./assets/icons/star.png'),
    loadImage('./assets/icons/half_star.png'),
    loadImage('./assets/icons/metacritic.png'),
  ])

  const MARGIN_X = 30
  const MARGIN_Y = 30

  const POSTER_H = CANVAS_HEIGHT - MARGIN_Y * 2
  const POSTER_W = largePoster.width * (PORTER_H / largePoster.height)

  ctx.drawImage(largePoster, MARGIN_X, MARGIN_Y, POSTER_W, POSTER_H)

  metacriticScr && ctx.drawImage(metacritic, 602, 290, 15, 15)

  const TEXT_MARGIN = MARGIN_X + POSTER_W + 15

  ctx.fillStyle = 'white'
  ctx.font = '20px "RobotoCondensed-Light"'

  ctx.fillText(lang.justWatched, TEXT_MARGIN, 50)

  ctx.font = '30px "RobotoCondensed"'
  ctx.fillText(movie.film.title, TEXT_MARGIN, 90)

  const TITLE_TEXT_WIDTH = ctx.measureText(movie.film.title).width
  if (TITLE_TEXT_WIDTH < 340) {
    ctx.fillText(`(${movie.film.year})`, TEXT_MARGIN + TITLE_TEXT_WIDTH + 5, 90)
  }

  ctx.font = '20px "RobotoCondensed-Light"'
  ctx.fillText(lang.followMe, TEXT_MARGIN, 230)

  ctx.font = '25px "RobotoCondensed"'
  ctx.fillText(`@${user}`, TEXT_MARGIN, 260)

  if (movie.rating.text !== 'None') {
    const fStar = Math.floor(movie.rating.score);
    const hStar = Math.ceil(movie.rating.score - Math.floor(movie.rating.score));

    for (let i = 0; i < fStar; i++) ctx.drawImage(star, TEXT_MARGIN + (38 * i), 270, 35, 35)

    if (hStar) ctx.drawImage(halfStar, TEXT_MARGIN + (38 * fStar), 270, 35, 35)
  }

  ctx.globalCompositeOperation = 'destination-over'
  ctx.drawBlurredImage(backgroundImage, 10, 0, -((CANVAS_WIDTH - CANVAS_HEIGHT) * 0.5), CANVAS_WIDTH, CANVAS_WIDTH)

  return canvas
}
