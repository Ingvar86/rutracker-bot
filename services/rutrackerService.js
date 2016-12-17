var request = require('request'),
    cheerio = require('cheerio'),
    iconv = require('iconv-lite'),
    dateService = require('./dateService'),
    EventEmitter = require('events'),
    baseUrl = 'http://rutracker.org/forum/';


function Rutracker(url) {
    var event = new EventEmitter();
    this.fetch = function() {
        return new Promise((resolve, reject) => {
            request({url: url, encoding: null}, function (error, response, body) {
                if (!error) {
                    var body1 = iconv.decode(body, 'win1251');
                    var $ = cheerio.load(body1),
                        topics = $('.forum  tr:has(td:contains("Темы")) ~ tr[class="hl-tr"]'),
                        topicsArray = [];
                    for (let i = 0; i < topics.length; i++){
                        let elem = topics.eq(i);
                        let a = elem.find('a.torTopic');
                        let title = a.text();
                        let href = a.attr('href');
                        let date = new Date(elem.find('p').eq(2).text());
                        topicsArray.push({title: title, href: baseUrl + href, date: date});
                    }
                    event.emit('data', topicsArray);
                    dateService.getDate().then(result =>{
                        let filtered = [];
                        if (result) {
                            let date = result.date;
                            filtered = topicsArray.filter((elem) => {
                                return elem.date > date;
                            });
                            if (filtered.length > 0) {
                                event.emit('update', filtered);
                                dateService.setDate(filtered[0].date);
                            }
                        }
                        else {
                            dateService.setDate(topicsArray[0].date);
                        }
                        resolve(filtered);
                    });
                } else {
                    console.log('Error: ' + error);
                    reject(error);
                }
            });
        });        
    };

    this.start = function(interval) {
        this.fetch();
        setInterval(this.fetch, interval);         
    };

    this.on = function(name, callback) {
        event.on(name, callback);
    };
}

module.exports = Rutracker;