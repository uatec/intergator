var request = require('superagent');
var Promise = require('promise');

module.exports = {
    pull: function (url, callback) {
        return new Promise(function (resolve, reject) {
            request.get(url)
                .end(function (err, res) {
                    if (err) {
                        reject(err);
                    }
                    resolve(res.text);
                });
        });
    }
};