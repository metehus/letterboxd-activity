const { Router } = require('express')

const LastActivityController = require('./controllers/LastActivity')

const routes = Router()

routes.route('/last-activity/:user')
  .get(LastActivityController.generate)

routes.route('*')
  .all(MiscController.invalid)

module.exports = routes
