var fs = require('fs');
var Promise = require('promise');

module.exports = {
    pull: function (filename, callback) {
        return new Promise(function (resolve, reject) {
            fs.readFile(filename, 'utf8', function (err, contents) {
                if (err) {
                    reject(err);
                }

                resolve(contents);
            });
        });
    }
};
