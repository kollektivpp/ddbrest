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

var request = require('./utils/request'),
    path = require('path'),
    Q = require('q');

var Binary = function(identifier, binaryPathFile) {

    /*!
     * check required parameters
     */
    if (typeof identifier !== 'string' || typeof binaryPathFile !== 'string') {
        throw new Error('number or type of arguments don\'t agree with binary search');
    }

    Binary.identifier = identifier;
    Binary.binaryPathFile = binaryPathFile;
    Binary.ctx = this;

    return Binary;

};

/**
 * Method to perform method request.
 *
 *     ddbrest.binary(identifier, binaryPathFile).get().then([SuccessCallback],[FailureCallback])
 *
 * @return {String} base64 encoded file
 *
 */
Binary.get = function() {

    if(arguments.length) {
        throw new Error('method `get` doesn\'t take any arguments');
    }

    var uri = path.join('binary', this.identifier, this.binaryPathFile);
    return request.call(this.ctx, uri, { headers: { 'Accept': 'application/octet-stream' }});
};

/**
 * Performs method requests and saves response into an file
 *
 *     ddbrest.binary(identifier, binaryPathFile).toFile(filepath).then([SuccessCallback],[FailureCallback])
 *
 * @param  {String} fileName  file name to save to
 * @return {String}           base64 encoded file
 */
Binary.toFile = function(fileName) {

    if (typeof fileName !== 'string') {
        throw new Error('number or type of arguments don\'t agree with binary.toFile command');
    }

    var uri = path.join('binary', this.identifier, this.binaryPathFile);
    return request.call(this.ctx, uri, { headers: { 'Accept': 'application/octet-stream' }}, fileName);

};

Binary.getPath = function() {
    var imagePath = path.join('binary', this.identifier, this.binaryPathFile) + '?oauth_consumer_key=' + this.ctx.token;
    return Q.resolve(this.ctx.protocol + '://' + this.ctx.host + '/' + imagePath);
};

/**
 * Expose methods
 */
module.exports = Binary;