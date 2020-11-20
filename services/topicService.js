var connect = require('../services/connectionService'),
    winston = require('winston');

exports.checkTopics = function(topicsArray) {        
    return connect.getConnection().then((db) => {
        const collection = db.collection('topics');
        const promises = topicsArray.map((topic) => {
            return collection.findOne({href: topic.href}).then((result) => {
                winston.debug('findOne result: ' + JSON.stringify(result));
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
        let dateTimeTopics = topics.map(t => t.date = new Date());
        return db.collection('topics').insertMany(dateTimeTopics);
    });
};