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

    if(arguments.length) {
        throw new Error('method `aip` doesn\'t take any arguments');
    }

    var uri = path.join('items', this.identifier, 'aip');
    return request.call(this.ctx, uri, { json: true });
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

    if(arguments.length) {
        throw new Error('method `binaries` doesn\'t take any arguments');
    }

    var uri = path.join('items', this.identifier, 'binaries');
    return request.call(this.ctx, uri, { json: true });
};

/**
 * The method children returns metadata of these items which are related to the inquired item and which
 * are one level deeper (child item) in the hierarchy than the inquired item. The child items will be
 * sorted according to the position field of the hierarchy nodes. If the position is the same the label
 * will be used for sorting. The provided metadata can be empty if the item does not have any child items.
 * This method provides response data as application/json and application/xml. It is a read-only service
 * and must be accessed with a HTTP-GET-request.
 *
 *     GET /items/<PathParameters>/children?<QueryParameters> HTTP/1.1
 *
 * @param {Number} offset     Offset position of first entry in the result list.
 * @param {Number} rows       Number of entries in the result list.
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/children
 *
 */
Items.children = function(offset, rows) {

    var query = [];

    if(typeof offset === 'number') {
        query.push('offset=' + offset);
    }

    if(typeof rows === 'number') {
        query.push('rows=' + rows);
    }

    var uri = path.join('items', this.identifier, 'children', '?') + query.join('&');
    return request.call(this.ctx, uri, { json: true });

};

/**
 * The method edm returns the Europeana Data Model (DDB profile) of an item for a given item-ID. This
 * method provides response data as application/json and application/xml. It is a read-only service and
 * must be accessed with a HTTP-GET-request.
 *
 *     GET /items/<PathParameters>/edm?<QueryParameters> HTTP/1.1
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/edm
 *
 */
Items.edm = function() {

    if(arguments.length) {
        throw new Error('method `edm` doesn\'t take any arguments');
    }

    var uri = path.join('items', this.identifier, 'edm');
    return request.call(this.ctx, uri, { json: true });
};

/**
 * The method indexing-profile returns the profile of an item for a given item-ID, which was used for
 * the indexing process. This method provides response data as application/json and application/xml.
 * It is a read-only service and must be accessed with a HTTP-GET-request.
 *
 *     GET /items/<PathParameters>/indexing-profile?<QueryParameters> HTTP/1.1
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/indexing-profile
 *
 */
Items.indexingProfile = function() {

    if(arguments.length) {
        throw new Error('method `indexingProfile` doesn\'t take any arguments');
    }

    var uri = path.join('items', this.identifier, 'indexing-profile');
    return request.call(this.ctx, uri, { json: true });

};

/**
 * The method parents returns the profile of an item for a given item-ID, which was used for
 * the indexing process. This method provides response data as application/json and application/xml.
 * It is a read-only service and must be accessed with a HTTP-GET-request.
 *
 *     GET /items/<PathParameters>/parents?<QueryParameters> HTTP/1.1
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/parents
 *
 */
Items.parents = function() {

    if(arguments.length) {
        throw new Error('method `parents` doesn\'t take any arguments');
    }

    var uri = path.join('items', this.identifier, 'parents');
    return request.call(this.ctx, uri, { json: true });

};

/**
 * The method source returns the initial XML metadata of an item for a given item-ID. The format
 * can be one of the accepted input data formats (e.g. MARCXML, METS/MODS, LIDO, Dublin Core).
 * This method provides response data only as application/xml because the DDB only accept XML-based
 * metadata from its contributing institutions. It is a read-only service and must be accessed with
 * a HTTP-GET-request.
 *
 *     GET /items/<PathParameters>/source?<QueryParameters> HTTP/1.1
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/source
 *
 */
Items.source = function() {

    if(arguments.length) {
        throw new Error('method `source` doesn\'t take any arguments');
    }

    var uri = path.join('items', this.identifier, 'source');
    return request.call(this.ctx, uri);

};

/**
 * The method view returns the view of an item for a given item-ID. A view is the data set a
 * [frontend page at DDB](https://www.deutsche-digitale-bibliothek.de/item/OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF)
 * is based on. This method provides response data as application/json and application/xml. It
 * is a read-only service and must be accessed with a HTTP-GET-request.
 *
 *     GET /items/<PathParameters>/view?<QueryParameters> HTTP/1.1
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/view
 *
 */
Items.view = function() {

    if(arguments.length) {
        throw new Error('method `view` doesn\'t take any arguments');
    }

    var uri = path.join('items', this.identifier, 'view');
    return request.call(this.ctx, uri, { json: true });

};

/**
 * Expose methods
 */
module.exports = Items;