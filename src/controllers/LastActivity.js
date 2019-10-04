const letterboxd = require('letterboxd')

const InvalidUser = require('../canvas/InvalidUser')
const LastMovie = require('../canvas/LastMovie')
const MovieInfo = require('../utils/MovieInfo')
const languages = require('../languages')

const Movie = new MovieInfo({ omdb: process.env.OMDB_API, tmdb: process.env.TMDB_API });

const getLanguage = id => {
  const lang = languages[id]
  if (lang) return languages.en
  return lang
}

module.exports = {
  async generate(req, res) {
    const { user } = req.params
    const { lang } = req.query

    const language = getLanguage(lang)

    res.set({ 'Content-Type': 'image/png' })

    let image;

    await letterboxd(user)
      .then(async ([movie]) => {
        res.status(200)

        Movie.getMovieInfo(movie.film.title, movie.film.year)
          .then(async ({ omdb, tmdb }) => {
            image = await LastMovie(language, { user, movie, omdb, tmdb })
          })
          .catch(async e => {
            image = await LastMovie(language, { user, movie })
          })
      })
      .catch(async e => {
        res.status(404)
        image = await InvalidUser(language, { user, movie })
      })

      image.pngStream().pipe(res)
  }
}
