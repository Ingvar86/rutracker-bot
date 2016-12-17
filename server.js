'use strict';
const express = require('express');
const packageInfo = require('./package.json');
const bodyParser = require('body-parser');
const bot = require('./telegram/bot.js');
const port = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.json({ version: packageInfo.version });
});

app.post('/' + bot.token, function (req, res) {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

app.listen(port, function () {
    console.log('Web server started at port: ', port);
});