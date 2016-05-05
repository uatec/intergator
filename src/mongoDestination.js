var MongoClient = require('mongodb').MongoClient;

var url = process.env.mongoUrl;
var _db = null;
MongoClient.connect(url, function(err, db) {
    _db = db;
});

module.exports = {
    push: function(document) {
        var collection = _db.collection(process.env.mongoCollection);
        
        collection.insertMany([document], function(err) {
            if ( err ) {
                throw new Error(err);
            }
        });
    }
};