var should = require('should');
var Rutracker = require('../services/rutrackerService'),
    url = 'http://rutracker.org/forum/viewforum.php?f=257';

describe.skip('Test Rutracker Service', function() {
    var rutracker = new Rutracker(url);
    it('should return topics from ' + url, function(done) {
        rutracker.fetchData((data) => {
            data.should.be.Array();
            data.length.should.be.above(0);
            data[0].should.have.properties(['title', 'href', 'date']);
            done();
        });
    });
});