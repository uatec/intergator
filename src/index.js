var parseString = require('xml2js').parseString;
var jsonPath = require('json-path');
var request = require('superagent');

var url = process.env.URL;
var productJsonPath = process.env.jsonPath;

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
                console.log(p.title[0]);
            });
        });
    });
