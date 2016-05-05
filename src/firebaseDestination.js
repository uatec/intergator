var Firebase = require('firebase');

var firebaseUrl = process.env.firebaseUrl;
var fb = new Firebase(firebaseUrl);
 
module.exports = {
    push: function(document) {
        fb.push(document);
    }
};