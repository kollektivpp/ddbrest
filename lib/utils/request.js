/**
 * request helper
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 *
 */

var merge = require('deepmerge'),
    request = require('request'),
    callback = require('./callback');

module.exports = function(path, opts, cb) {

    /**
     * check for obsolete args
     */
    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }

    var url = this.protocol + '://' + this.host + '/' + path,
        params = merge({
            url: url,
            oauth: this.oauth
        }, opts || {});

    return request.get(params, callback.bind(this, cb));

};