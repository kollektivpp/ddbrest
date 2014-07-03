/**
 * request helper
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 *
 */

var Q = require('q'),
    fs = require('fs'),
    merge = require('deepmerge'),
    request = require('request');

module.exports = function(path, opts, outputFile) {

    var deferred = Q.defer();

    var url = this.protocol + '://' + this.host + '/' + path,
        params = merge({
            url: url,
            oauth: this.oauth
        }, opts || {});

    /**
     * debug in test mode
     */
    if(process.env.TRAVIS_BUILD_ID) {
        console.log(url);
    }

    var r = request.get(params, function(err, httpResponse, body) {

        /* istanbul ignore if */
        if (err) {
            return deferred.reject(err);
        }

        if (typeof body === 'string' && body.indexOf('not found') > -1) {
            err = JSON.parse(body);

            /**
             * remove outputFile
             *
             * Problem: if a file doesn't exists we won't get an 404 error but instead a 200 with an error
             * body like 'ItemNotFoundException: path/to/file.jpg not found', this would be piped into the
             * file
             */
            if(outputFile) {
                return fs.unlink(outputFile, deferred.reject.bind(deferred, err.name + ': ' + err.message));
            }

            return deferred.reject(err.name + ': ' + err.message);
        }

        deferred.resolve(body);

    });

    if(outputFile) {
        r.pipe(fs.createWriteStream(outputFile));
    }

    return deferred.promise;

};