var connect = require('../services/connectionService');

exports.getTopics = function() {        
    return connect.getConnection().then((db) => {
        return db.collection('topics').findOne();
    });
};

exports.setTopics = function(topics) {
    return connect.getConnection().then((db) => {
        return db.collection('topics').findOneAndUpdate({}, {$set: {topics: topics, date: new Date()}}, {upsert: true});
    });
};