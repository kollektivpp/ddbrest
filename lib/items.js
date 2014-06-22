/**
 * Items
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/items
 * @author Christian Bromann <mail@christian-bromann.com>
 *
 */

var request = require('./utils/request'),
    path = require('path');

var Items = function(identifier) {

    if (typeof identifier !== 'string') {
        throw new Error('the method `items` requires an identifier');
    }

    Items.identifier = identifier;
    Items.ctx = this;

    return Items;

};

/**
 * The method aip returns the Archive Information Package (AIP) of an item for a given item-ID. An AIP
 * contains all available information of an item including a persistent identifier. This method provides
 * response data as application/json and application/xml. It is a read-only service and must be accessed
 * with a HTTP-GET-request.
 *
 *     GET /items/<PathParameters>/aip?<QueryParameters> HTTP/1.1
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/aip
 *
 */
Items.aip = function() {
    var uri = path.join('items', this.identifier, 'aip');
    return request.call(this.ctx, uri);
};

/**
 * The method binaries returns a list of binary data files related to an item for a given item-ID. Binary
 * data can be accessed with the binary method. The binaries method provides response data as application/json
 * and application/xml. It is a read-only service and must be accessed with a HTTP-GET-request.
 *
 *     GET /items/<PathParameters>/binaries?<QueryParameters> HTTP/1.1
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/binaries
 *
 */
Items.binaries = function() {
    var uri = path.join('items', this.identifier, 'binaries');
    return request.call(this.ctx, uri);
};

/**
 * Expose methods
 */
module.exports = Items;