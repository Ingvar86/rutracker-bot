var connect = require('../services/connectionService');

exports.checkTopics = function(topicsArray) {        
    return connect.getConnection().then((db) => {
        const collection = db.collection('topics');
        var promises = [];
        topicsArray.forEach((topic) => {
            var promise = collection.findOne({href: topic.href}).then((result) => {
                console.log('findOne result: ' + result);
                if (!result) {
                    return Promise.resolve(topic);
                }
            });
            promises.push(promise);
            return;
        });
        return Promise.all(promises);
    });
};

exports.addTopics = function(topics) {
    return connect.getConnection().then((db) => {
        return db.collection('topics').insertMany(topics);
    });
};