'use strict';
var request = require('request'),
    cheerio = require('cheerio'),
    iconv = require('iconv-lite'),
    winston = require('winston'),
    EventEmitter = require('events'),
    config = require('../config'),
    baseUrl = `${config.rutrackerUrl}forum/`,
    loginUrl = baseUrl + 'login.php';

let getCookie = (cookies) => {
    return cookies.reduce((prev, curr) => {
        return prev += curr.substring(0, curr.indexOf(';') + 1);
    }, '');
}

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
        },
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:83.0) Gecko/20100101 Firefox/83.0',
            'Accept-Encoding': 'gzip, deflate, br'
        }        
    };
    request.post(options, function (error, response, body) {
        if (error || !response.headers['set-cookie']) {
            me.emit('login-error', error || 'login error');
        }
        else {
            me.cookie = getCookie(response.headers['set-cookie']);
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
            gzip: true,
            headers: {
                'Accept-Encoding': 'gzip, deflate, br',
                'Cookie': me.cookie + ' opt_js={%22only_new%22:2}',
                'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:83.0) Gecko/20100101 Firefox/83.0'
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