var connect = require('../services/connectionService');

function getDate() {        
    return connect.getConnection().then((db) => {
        return db.collection('dates').findOne();
    });
}

function setDate(date) {
    return connect.getConnection().then((db) => {
        return db.collection('dates').findOneAndUpdate({}, {$set: {date: date}}, {upsert: true});
    });
}

exports.getDate = getDate;
exports.setDate = setDate;