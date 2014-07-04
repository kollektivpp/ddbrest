/**
 * entities
 *
 * The method entities is providing access to the the Lucene search index of entities used at DDB. This method provides
 * response data only as application/json. It is a read-only service and must be accessed with a HTTP-GET-request.
 *
 *     GET /entities?<QueryParameters> HTTP/1.1
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/institutions
 * @author Christian Bromann <mail@christian-bromann.com>
 *
 */

var Entities = function(query) {

    if (typeof query !== 'string') {
        throw new Error('number or type of arguments don\'t agree with institutions method');
    }

    Entities.ctx = this;
    Entities.query = query;

    return Entities;

};

Entities.place = require('./facets/place');
Entities.role = require('./facets/role');
Entities.keywords = require('./facets/keywords');
Entities.language = require('./facets/language');
Entities.type = require('./facets/type');
Entities.sector = require('./facets/sector');
Entities.time = require('./facets/time');
Entities.provider = require('./facets/provider');
Entities.license = require('./facets/license');
Entities.licenseGroup = require('./facets/licenseGroup');
Entities.get = require('./facets/get');

/**
 * Expose methods
 */
module.exports = Entities;