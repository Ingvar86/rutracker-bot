'use strict';
var Rutracker = require('./services/rutrackerService'),
    bot = require('./telegram/bot'),
    connectionService = require('./services/connectionService'),
    url = 'http://rutracker.org/forum/viewforum.php?f=257';


var rutracker = new Rutracker(url);

rutracker.fetch().then((newTopics) => {
    if (newTopics && newTopics.length >0) {
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
});