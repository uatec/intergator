#! /app/bin/node
var env = require('node-env-file');
env('./.env', {raise: false});

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
        throw new Error('no output system specified in \'output_system\' environment variable. Valid options are \'mongo\' or \'firebase\'. Actual was: ' + process.env.output_system);
}


var transforms = [
    function setSourceSystemId (entity) {
        entity._sourceSystemId = systemId;
        return entity;
    }
];


request.get(url)
    .end(function (err, res) {
        if ( err ) {
            throw new Error(err);
        }
        console.log('[OK] Data Retrieved.');
        parseString(res.text, function (err, result) {
            if ( err ) {
                throw new Error(err);
            }
            console.log('[OK] Xml parsed.');
            var products = jsonPath.resolve(result, productJsonPath);
            products.forEach(function (p) {
                console.log('[..] Parsing SKU: ', p.sku[0]);
                var baseItem = {
                    _source: p
                };
                transforms.forEach(function(t) { 
                   baseItem = t(baseItem); 
                });
                destination.push(baseItem);
            });
            console.log('[OK] Data imported.');
        });
    });
