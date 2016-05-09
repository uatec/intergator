#! /app/bin/node
var env = require('node-env-file');
env('./.env', { raise: false });

var jsonPath = require('json-path');
var Promise = require('promise');
var parseString = Promise.denodeify(require('xml2js').parseString);
var url = process.env.URL;
var productJsonPath = process.env.jsonPath;
var systemId = process.env.systemId;

var source = null;

switch (process.env.input) {
    case 'http':
        source = require('./httpSource.js');
        break;
    case 'file':
        source = require('./fileSource.js');
        break;
    default:
        throw new Error('no input system specified in \'input\' environment variable. Valid options are \'http\' or \'file\'. Actual was: ' + process.env.input);
}

var transforms = [
    function setSourceSystemId(entity) {
        entity._sourceSystemId = systemId;
        return entity;
    }
];
require('promise/lib/rejection-tracking').enable(
    { allRejections: true }
);
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

destination.init()
    .then(function () {
        console.log('[..] Pulling data.');
        return source.pull('/Users/uatec/tesco.xml');
    })
    .then(function (data) {
        console.log('[OK] Data Retrieved.');
        return parseString(data);
    })
    .then(function (result) {
        console.log('[OK] Xml parsed.');    
        var products = jsonPath.resolve(result, productJsonPath);
        products.forEach(function (p) {
            console.log('[..] Parsing SKU: ', p.sku[0]);
            var baseItem = {
                _source: p
            };
            transforms.forEach(function (t) {
                console.log('Applying transform: ' + t.name);
                baseItem = t(baseItem);
            });
            console.log('Transforms complete');
            destination.push(baseItem);
        });
        console.log('[OK] Data imported.');
    });

