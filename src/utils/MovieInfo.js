const request = require('request-promise');

module.exports = class MovieInfo {
  constructor(options) {
    this.omdbKey = options.omdb;
    this.tmdbKey = options.tmdb;
  }

  getMovieInfo (title, year) {
    return new Promise(async (resolve, reject) => {
      try {
        const omdb = await this.searchOMDB(title, year)
        const tmdb = await this.getTMDB(omdb.imdbID)

        resolve({ omdb, tmdb })
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  }

  searchOMDB (title, year) {
    return new Promise(async (resolve, reject) => {
      const res = JSON.parse(await request(`http://omdbapi.com/?t=${encodeURI(title)}&y=${year}&apikey=${this.omdb_key}`))

      if (res.Response === 'True') resolve(res)
      else reject(res)
    })
  }

  getTMDB (imdbID) {
    return new Promise(async (resolve, reject) => {
      const res = JSON.parse(await request(`https://api.themoviedb.org/3/find/${imdbID}?api_key=${this.tmdb_key}&external_source=imdb_id`))
      if (res.movie_results.length > 0) resolve(response.movie_results[0])
      else reject(null)
    })
  }
}
