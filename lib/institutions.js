/**
 * institutions
 *
 * The method institutions returns a list of institutions which are registered at the DDB. This method provides
 * response data only as application/json. It is a read-only service and must be accessed with a HTTP-GET-request.
 *
 *     GET /institutions?<QueryParameters> HTTP/1.1
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/institutions
 * @author Christian Bromann <mail@christian-bromann.com>
 *
 */

var request = require('./utils/request'),
    sectorTypes = require('./models/sectorTypes');

var Institutions = function(sector) {

    if(typeof sector !== 'string') {
        throw new Error('number or type of arguments don\'t agree with institutions method');
    }

    var sectorType = sectorTypes[sector.toLowerCase()];

    Institutions.ctx = this;
    Institutions.sector = (sectorType ? sectorType.element : sector);

    return Institutions;

};

/**
 * Method to perform method request.
 */
Institutions.get = function() {

    if(arguments.length) {
        throw new Error('method `get` doesn\'t take any arguments');
    }

    var query = '';

    if (this.sector) {
        query = '?sector=' + this.sector.element;
    }

    return request.call(this.ctx, 'institutions' + query, { json: true });

};

/**
 * The method sectors returns the list of available institution sectors at the DDB. Each sector contains a name
 * in the property value and the number of institutions that belong to this sector (count). As institutions can
 * belong to multiple sectors, the overall sum of the different counts can be higher than the total number of
 * institutions. This method provides response data only as application/json. It is a read-only service and
 * must be accessed with a HTTP-GET-request.
 *
 *     GET /institutions/sectors?<QueryParameters> HTTP/1.1
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/sectors
 *
 */
Institutions.sectors = function() {

    if(arguments.length) {
        throw new Error('method `sectors` doesn\'t take any arguments');
    }

    return request.call(this.ctx, 'institutions/sectors', { json: true });
};

/**
 * Expose methods
 */
module.exports = Institutions;