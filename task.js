'use strict';
var Rutracker = require('./services/rutrackerService'),
    topicService = require('./services/topicService'),
    winston = require('winston'),
    bot = require('./telegram/bot'),
    connectionService = require('./services/connectionService'),
    config = require('./config'),
    url = `${config.rutrackerUrl}forum/viewforum.php?f=257`,
    user = process.env.USER,
    password = process.env.PASSWORD;

winston.level = process.env.DEBUG_LEVEL || 'info';

var rutracker = new Rutracker();

rutracker.on('login', () => {
    rutracker.fetch(url)
        .then(topicsArray => topicService.checkTopics(topicsArray))
        .then(newTopics => {
            winston.debug('new topics: ' + JSON.stringify(newTopics));
            if (newTopics && newTopics.length > 0) {
                return topicService.addTopics(newTopics).then(() => {
                    var message = newTopics.reduce((prev, next) => {
                        return prev + next.title + '\n' + next.href + '\n'; 
                    }, '');
                    return bot.notifyAll(message);
                });
            }
        })
        .catch(error => {
            winston.error(error);
        })
        .finally(() => {
            connectionService.closeConnection();
        })
});

rutracker.on('login-error', winston.error);

rutracker.login(user, password);
