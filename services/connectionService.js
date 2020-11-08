var MongoClient = require('mongodb').MongoClient;
const url = process.env.DB_URL;

var database;

exports.getConnection = function() {
    return database ? Promise.resolve(database) : MongoClient.connect(url,  {useUnifiedTopology: true}).then(client => database = client.db());  
};

exports.closeConnection = function() {
    if (database) {
        database.close();
    }
};