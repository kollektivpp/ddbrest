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

var callback = require('./utils/callback'),
    request = require('./utils/request');

module.exports = function(type) {

    var self = this,
        sector = this.findSectorByTerm(type);

    return {
        then: function(success, failure) {

            var query = '';

            if (sector) {
                query = 'sector=' + sector.element;
            }

            return request('institutions', '', query, {
                json: true
            }, callback.bind(self, success, failure));
        },
        sectors: function(success, failure) {

            return request('institutions', 'sectors', '', {
                json: true
            }, callback.bind(self, success, failure));

        }
    };

};