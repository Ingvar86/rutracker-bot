'use strict';
var request = require('request'),
    cheerio = require('cheerio'),
    iconv = require('iconv-lite'),
    topicService = require('./topicService'),
    EventEmitter = require('events'),
    baseUrl = 'http://rutracker.org/forum/',
    rutracker_cookie = process.env.RUTRACKER_COOKIE;


function Rutracker(url) {
    var event = new EventEmitter();
    this.fetch = function() {
        return new Promise((resolve, reject) => {
            const options = {
                url: url,
                encoding: null,
                headers: {
                    'Cookie': 'bb_data=' + rutracker_cookie + '; opt_js={"only_new":2}'
                }
            };
            request(options, function (error, response, body) {
                if (!error) {
                    var body1 = iconv.decode(body, 'win1251');
                    var $ = cheerio.load(body1),
                        topics = $('tr[class="hl-tr"]'),
                        topicsArray = [];
                    for (let i = 0; i < topics.length; i++){
                        let elem = topics.eq(i);
                        let a = elem.find('a.torTopic');
                        let title = a.text();
                        let href = a.attr('href');
                        topicsArray.push({title: title, href: baseUrl + href});
                    }
                    event.emit('data', topicsArray);
                    topicService.getTopics().then(result =>{
                        let filtered = [];
                        if (result) {
                            let oldTopics = result.topics;
                            filtered = topicsArray.filter((elem) => {
                                return !oldTopics.find(old => {
                                    return old.href === elem.href;
                                });
                            });
                            if (filtered.length > 0) {
                                event.emit('update', filtered);
                                topicService.setTopics(topicsArray);
                            }
                        }
                        else {
                            topicService.setTopics(topicsArray);
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