var should = require('should'),
    sinon = require('sinon'),
    request = require('request'),
    Rutracker = require('../services/rutrackerService'),
    url = 'http://rutracker.org/forum/viewforum.php?f=257';

describe('Test rutracker service', function() {
    describe('Test rutracker login', function() {
        it('should emit login event', function() {
            var response = {headers: {}};
            response.headers['set-cookie'] = ['test'];
            sinon.stub(request, 'post', function(options, callback) {
                callback(null, response, null);
            });
            var rutracker = new Rutracker('login', 'password');
            var spy = sinon.spy(rutracker, 'emit');
            rutracker.login();
            sinon.assert.calledWith(spy, 'login');
            request.post.restore();
        });
        it('should emit login-error event', function() {
            var response = {headers: {}};
            sinon.stub(request, 'post', function(options, callback) {
                callback(null, response, null);
            });
            var rutracker = new Rutracker('login', 'password');
            var spy = sinon.spy(rutracker, 'emit');
            rutracker.login();
            sinon.assert.calledWith(spy, 'login-error');
            request.post.restore();
        });
    });
    describe('Test rutracker fetch', function() {
        it('should fetch and parse data', function() {
            
        });
    });
});