/**
 * items
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/items
 * @author Christian Bromann <mail@christian-bromann.com>
 *
 */

var request = require('./utils/request');

module.exports = function(identifier) {

    if(typeof identifier !== 'string') {
        throw new Error('the method `items` requires an identifier');
    }

    var self = this;

    return {
        aip: function(callback) {
            request.call(self, 'items/' + identifier + '/aip', callback);
        },
        binaries: function(callback) {
            request.call(self, 'items/' + identifier + '/binaries', callback);
        }
    };

};