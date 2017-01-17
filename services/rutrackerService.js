'use strict';
var request = require('request'),
    cheerio = require('cheerio'),
    iconv = require('iconv-lite'),
    winston = require('winston'),
    EventEmitter = require('events'),
    topicService = require('./topicService'),
    baseUrl = 'http://rutracker.org/forum/',
    loginUrl = baseUrl + 'login.php';

function Rutracker(user, password, url) {
    this.user = user;
    this.password = password;
    this.url = url;
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
        if (error || !response.headers['set-cookie']) {
            me.emit('login-error', error || 'login error');
        }
        else {
            me.cookie = response.headers['set-cookie'][0];
            me.emit('login');
        }
    });    
};

Rutracker.prototype.fetch = function(url) {
    const me = this;
    return new Promise((resolve, reject) => {
        const options = {
            url: url || me.url,
            encoding: null,
            headers: {
                'Cookie': me.cookie + '; opt_js={"only_new":2}'
            }
        };
        request.get(options, function (error, response, body) {
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
                winston.debug('topicsArray: ' + JSON.stringify(topicsArray));
                resolve(topicsArray);
            } else {
                reject(error);
            }
        }); 
    });
};

module.exports = Rutracker;