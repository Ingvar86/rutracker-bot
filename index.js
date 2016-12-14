'use strict';
var Rutracker = require('./services/rutrackerService'),
    bot = require('./telegram/bot'),
    url = 'http://rutracker.org/forum/viewforum.php?f=257';


var rutracker = new Rutracker(url);

rutracker.on('update', (newTopics) => {
    var message = newTopics.reduce((prev, next) => {
        return prev + next.title + '\n' + next.href + '\n'; 
    }, '');
    bot.notifyAll(message);
});

rutracker.start(10*60*1000);


