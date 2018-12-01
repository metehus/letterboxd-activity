const letterboxd = require('letterboxd');
const { invalidUser, lastMovie } = require('../canvas');
const languages = require('../languages');

const json = require('../canvas/ltbxd.json');

class lastActivityRouter {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        if(this.req.query.lang === 'pt' || this.req.query.lang === 'en')
            this.lang = languages[this.req.query.lang];
        else
            this.lang = languages.en;

        this.routerInit()
    }

    async routerInit() {
        letterboxd(this.req.params.user).then(async items => {
            this.res.set({'Content-Type': 'image/png'});
            this.res.status(200);
            let img = await lastMovie(this.lang, { user: this.req.params.user, movie: items[0] });
            img.pngStream().pipe(this.res)
        }).catch(async e => {
            this.res.set({'Content-Type': 'image/png'});
            this.res.status(404);
            let img = await invalidUser(this.lang, this.req.params.user);
            img.pngStream().pipe(this.res)
        })
    }
}

module.exports = (req, res) => {
    new lastActivityRouter(req, res)
}