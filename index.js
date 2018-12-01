const express = require('express');
const app = express();
const chalk = require('chalk');

// Routers inits
const { lastActivityRouter } = require('./routers');

// Routes
app.get('/',(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(400);
    res.send(JSON.stringify({ error: 'Invalid method.' }));
});

app.get('/lastActivity/:user',(req, res) => {
    console.log(req.params.user)
    new lastActivityRouter(req, res)
});

// Listener
app.listen(3000, () => {
    console.log(chalk.greenBright(' SUCCESS ') + ' Server started successfully');
});





