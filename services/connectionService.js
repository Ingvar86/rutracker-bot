var MongoClient = require('mongodb').MongoClient;
const url = process.env.DB_URL;

var database;

exports.getConnection = function() {
    return new Promise((resolve, reject) => {
        if (database) {
            resolve(database);
        }
        else {
            MongoClient.connect(url, function(err, db) {
                if (err) {
                    reject(err);
                }
                else {
                    database = db;
                    resolve(database);
                }
            });
        }
    });  
};

exports.closeConnection = function() {
    if (database) {
        database.close();
    }
};