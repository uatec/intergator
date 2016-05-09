var MongoClient = require('mongodb').MongoClient;
var Promise = require('promise');

var url = process.env.mongoUrl;
var Promise = require('promise');

module.exports = {
    init: function () {
        return new Promise(function (resolve, reject) {
            console.log('[..] Connecting to: ' + url);
            MongoClient.connect(url, function (err, db) {
                if (err) {
                    reject(err);
                }
                this._db = db;
                console.log('[OK] Connecting to: ' + url);
                resolve();
            });
        });
    },

    push: function (document) {
        return new Promise(function (resolve, reject) {
            var collection = _db.collection(process.env.mongoCollection);

            collection.insertMany([document], function (err) {

                if (err) {
                    reject(err);
                }
                
                resolve();
            });
        });
    }
};