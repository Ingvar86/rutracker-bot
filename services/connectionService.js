var MongoClient = require('mongodb').MongoClient;
const url = process.env.DB_URL;

var database;
var mclient;

exports.getConnection = function() {
    return database ? Promise.resolve(database) : MongoClient.connect(url,  {useUnifiedTopology: true}).then(client => {
        mclient = client;
        database = client.db();
        return database;
    });  
};

exports.closeConnection = function() {
    if (database) {
        mclient.close();
    }
};