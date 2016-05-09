var Firebase = require('firebase');
var Promise = require('promise');

var firebaseUrl = process.env.firebaseUrl;
 
module.exports = {
    init: function() {
        return new Promise(function(resolve, reject) { 
            this._fb = new Firebase(firebaseUrl);
            resolve();
        });
    },
    
    push: function(document) {
        fb.push(document);
    }
};