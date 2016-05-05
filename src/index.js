var parseString = require('xml2js').parseString;
var jsonPath = require('json-path');
var request = require('superagent');

var url = process.env.URL;
var productJsonPath = process.env.jsonPath;
var systemId = process.env.systemId;

console.log(url);
console.log('starting');

var mongoDestination = require('./mongoDestination.js');
var firebaseDestination = require('./firebaseDestination.js');
var destination = null;
switch (process.env.output_system) {
    case 'mongo': 
        destination = require('./mongoDestination.js');
        break;
    case 'firebase': 
        destination = require('./firebaseDestination.js');
        break;
    default:
        throw new Error('no output system specified in \'output_system\' environment variable. Valid options are \'mongo\' or \'firebase\'');
}


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
                destination.push(p);
            });
        });
    });
