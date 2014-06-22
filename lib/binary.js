/**
 * binary
 *
 * The method binary returns the content of a binary file of an item for a given item-ID. This method provides
 * response data as application/octet-stream. A binary file at DDB can be a picture, a tumbnail of a picture,
 * a video clip, an audio file etc. It is a read-only service and must be accessed with a HTTP-GET-request.
 *
 *     GET /binary/<PathParameters> HTTP/1.1
 *
 * @param {String} identifier The ID of the requested item.
 * @param {String} path       The relative path and the filename of a binary file separated by slashes. The path and filename can be retrieved via the method binaries.
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/binary
 * @author Christian Bromann <mail@christian-bromann.com>
 *
 */

var callback = require('./utils/callback'),
    request = require('./utils/request'),
    path = require('path'),
    fs = require('fs');

module.exports = function(identifier, binaryPathFile) {

    var self = this;

    /**
     * check required parameters
     */
    if (typeof identifier !== 'string' || typeof binaryPathFile !== 'string') {
        throw new Error('number or type of arguments don\'t agree with binary search');
    }

    return {
        then: function(success, failure) {
            return request('binary', path.join(identifier, binaryPathFile), '', {
                headers: {
                    'Accept': 'application/octet-stream'
                }
            }, callback.bind(self, success, failure));
        },
        toFile: function(fileName, cb) {

            if (typeof fileName !== 'string' || (cb && typeof cb !== 'function')) {
                throw new Error('number or type of arguments don\'t agree with binary.toFile command');
            }

            return request('binary', path.join(identifier, binaryPathFile), '', {
                headers: {
                    'Accept': 'application/octet-stream'
                }
            }, function(err, httpResponse, body) {

                if (err) {
                    throw new Error(err);
                }

                if (typeof body === 'string' && body.indexOf('not found') > -1) {
                    err = JSON.parse(body);
                    throw new Error(err.name + ': ' + err.message);
                }

                if(cb) {
                    cb(err, httpResponse, body);
                }

            }).pipe(fs.createWriteStream(fileName));

        }
    };
};