var parseString = require('xml2js').parseString;
var jsonPath = require('json-path');
var request = require('superagent');
var Firebase = require('firebase');

var url = process.env.URL;
var productJsonPath = process.env.jsonPath;
var systemId = process.env.systemId;
var firebaseUrl = process.env.firebaseUrl;

var fb = new Firebase(firebaseUrl);

console.log(url);
console.log('starting');
request.get(url)
    .end(function (err, res) {
        if ( err ) {
            throw new Error(err);
        }
        parseString(res.text, function (err, result) {
            if ( err ) {
                throw new Error(err);
            }
            var products = jsonPath.resolve(result, productJsonPath);
            products.forEach(function (p) {
                p._sourceSystemId = systemId;
                fb.push(p);
            });
        });
    });
