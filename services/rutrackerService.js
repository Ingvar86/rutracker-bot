'use strict';
var request = require('request'),
    cheerio = require('cheerio'),
    iconv = require('iconv-lite'),
    topicService = require('./topicService'),
    EventEmitter = require('events'),
    baseUrl = 'http://rutracker.org/forum/',
    loginUrl = baseUrl + 'login.php';

function Rutracker(user, password, url) {
    this.user = user;
    this.password = password;
    this.url = url;
    this.login(user, password);
}

Rutracker.prototype = new EventEmitter();

Rutracker.prototype.login = function(user, password) {
    const me = this;
    const options = {
        url: loginUrl,
        form: {
            login_username: user || me.user,
            login_password: password || me.password,
            login: 'Вход'
        }
    };
    request.post(options, function (error, response, body) {
        me.cookie = response.headers['set-cookie'][0];
        me.emit('login');
    });    
};

Rutracker.prototype.fetch = function() {
    const me = this;
    return new Promise((resolve, reject) => {
        const options = {
            url: me.url,
            encoding: null,
            headers: {
                'Cookie': me.cookie + '; opt_js={"only_new":2}'
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
                console.log('topicsArray: ' + JSON.stringify(topicsArray));
                topicService.checkTopics(topicsArray).then(result => {
                    console.log('new topics: ' + JSON.stringify(result));
                    if (result && result.length > 0) {
                        topicService.addTopics(result).then(() => {
                            resolve(result);
                        });
                    }
                    else {
                        resolve(result);
                    }
                });
            } else {
                reject(error);
                console.log('Error: ' + error);
            }
        }); 
    });
};

module.exports = Rutracker;