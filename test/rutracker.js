'use strict';
var should = require('should'),
    sinon = require('sinon'),
    request = require('request'),
    Rutracker = require('../services/rutrackerService'),
    fs = require('fs'),
    url = 'http://rutracker.org/forum/viewforum.php?f=257';

describe('Test rutracker service', function() {
    describe('Test rutracker login', function() {
        it('should emit login event', function() {
            var response = {headers: {}};
            response.headers['set-cookie'] = ['test'];
            var stub = sinon.stub(request, 'post');
            stub.yields(null, response, null);
            var rutracker = new Rutracker('login', 'password');
            var spy = sinon.spy(rutracker, 'emit');
            rutracker.login();
            sinon.assert.calledWith(spy, 'login');
            request.post.restore();
        });
        it('should emit login-error event', function() {
            var response = {headers: {}};
            var stub = sinon.stub(request, 'post');
            stub.yields(null, response, null);
            var rutracker = new Rutracker('login', 'password');
            var spy = sinon.spy(rutracker, 'emit');
            rutracker.login();
            sinon.assert.calledWith(spy, 'login-error');
            request.post.restore();
        });
    });
    describe('Test rutracker fetch', function() {
        it('should fetch and parse data', function() {
            var rutracker = new Rutracker('login', 'password');
            var stub = sinon.stub(request,'get');
            var body = fs.readFileSync('./test/response.html');
            var topics = JSON.parse(fs.readFileSync('./test/topics.json', 'utf8'));
            stub.yields(null, null, body);            
            return rutracker.fetch(url).then(data => {
                should.deepEqual(data, topics);
                request.get.restore();
            });
        });
    });
});