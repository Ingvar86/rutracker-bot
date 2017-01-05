'use strict';
var Rutracker = require('./services/rutrackerService'),
    winston = require('winston'),
    bot = require('./telegram/bot'),
    connectionService = require('./services/connectionService'),
    url = 'http://rutracker.org/forum/viewforum.php?f=257',
    user = process.env.USER,
    password = process.env.PASSWORD;

winston.level = process.env.DEBUG_LEVEL || 'info';

var rutracker = new Rutracker();

rutracker.on('login', () => {
    rutracker.fetch(url).then((newTopics) => {
        if (newTopics && newTopics.length > 0) {
            var message = newTopics.reduce((prev, next) => {
                return prev + next.title + '\n' + next.href + '\n'; 
            }, '');
            bot.notifyAll(message).then(()=> {
                connectionService.closeConnection();
            });
        }
        else {
            connectionService.closeConnection();        
        }
    }).catch(error => {
        connectionService.closeConnection();
        winston.error(error);
    });
});

rutracker.on('login-error', winston.error);

rutracker.login(user, password);
