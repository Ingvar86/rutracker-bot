var MongoClient = require('mongodb').MongoClient;
const url = process.env.DB_URL;

var database;

exports.getConnection = function() {
    return database ? Promise.resolve(database) : MongoClient.connect(url).then(db => database = db);  
};

exports.closeConnection = function() {
    if (database) {
        database.close();
    }
};