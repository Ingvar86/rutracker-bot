var connect = require('../services/connectionService');

exports.checkTopics = function(topicsArray) {        
    return connect.getConnection().then((db) => {
        const collection = db.collection('topics');
        const promises = topicsArray.map((topic) => {
            return collection.findOne({href: topic.href}).then((result) => {
                console.log('findOne result: ' + result ? result.href : null);
                if (!result) {
                    return topic;
                }                
            });
        });
        return Promise.all(promises).then((result) => {
            return result.filter(topic => {
                return !!topic;
            });
        });
    });
};

exports.addTopics = function(topics) {
    return connect.getConnection().then((db) => {
        return db.collection('topics').insertMany(topics);
    });
};