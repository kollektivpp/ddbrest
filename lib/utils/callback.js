/**
 * default callback for most of the API calls
 */

module.exports = function(cb, err, httpResponse, body) {

    if (err && cb) {
        return cb(err);
    }

    if (typeof body === 'string' && body.indexOf('not found') > -1) {
        err = JSON.parse(body);
        return cb(err.name + ': ' + err.message);
    }

    cb(null, body, httpResponse);

};