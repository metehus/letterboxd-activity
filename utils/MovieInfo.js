const request = require('request-promise');

module.exports = class MovieInfo {
    constructor(options) {
        this.omdb_key = options.omdb;
        this.tmdb_key = options.tmdb;
    }

    getMovieInfo (title, year) {
        return new Promise(async (res, rej) => {
            this.searchOMDB(title, year).then(OMDBdata => {
                this.getTMDB(OMDBdata.imdbID).then(TMDBdata => {
                    res({ omdb: OMDBdata, tmdb: TMDBdata })
                }).catch(e => {
                    console.error(e);
                    rej(e)
                })
            }).catch(e => {
                console.error(e);
                rej(e)
            })
        })
    }

    searchOMDB (title, year) {
        return new Promise(async (res, rej) => {
            let response = JSON.parse(await request(`http://www.omdbapi.com/?t=${encodeURI(title)}&y=${year}&apikey=${this.omdb_key}`));
            if(response.Response === "True")
                res(response);
            else
                rej(response);
        })
    }

    getTMDB (imdbID) {
        return new Promise(async (res, rej) => {
            let response = JSON.parse(await request(`https://api.themoviedb.org/3/find/${imdbID}?api_key=${this.tmdb_key}&external_source=imdb_id`));
            if (response.movie_results.length > 0)
                res(response.movie_results[0]);
            else
                rej(null);
        })
    }
}