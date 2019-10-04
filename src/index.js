require('dotenv').config()
require('./utils/CanvasUtils').init()

const express = require('express')
const chalk = require('chalk')

const routes = require('./routes')

const app = express()

app.use(express.json())
app.use(routes)

app.listen(process.env.PORT || 3000, () => console.log(
  `${chalk.greenBright(' SUCCESS ')} Server started successfully`
))
