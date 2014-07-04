/**
 * serach
 *
 * The method search is providing an interface to the search engine of the DDB. This method provides response
 * data only as application/json. It is a read-only service and must be accessed with a HTTP-GET-request.
 *
 *     GET /search?<QueryParameters> HTTP/1.1
 *
 * The resulting JSON object is made up of several parts. Each part will be described separately. The described
 * parts are properties of the search result object and can be joined to form a complete result object.
 *
 * @param {Number}   numberOfResults   First the number of results is in the property `numberOfResults`. This gives the total number of found results independent of the rows returned.
 * @param {Number}   highlightedTerms  Another part is the hightlightedTerms. This contains an array of all terms that should be highlighted. In the preview they are already highlighted. But this array can be transferred to the detail view where the terms could be highlighted as well.
 * @param {String}   randomSeed        If the random sorting is activated this property will contain a value that can be used as subsequent sort-parameter. The value should be used as is. If the random sorting is deactivated or the query was not a get-all-objects-query (* or *:*) the property will be empty.
 * @param {String}   correctedQuery    If the query is mistyped, i.e. there are more hits for an alternative spelling of one of the query terms a corrected query will be returned with the search result. This property `correctedQuery` contains the entered query with all terms corrected.
 * @param {Object[]} facets            One lengthier part are the facets and their values. Each facet defined to have a displayType of SEARCH will always be returned with the search results.
 * @param {Number}   numberOfFacets    The numberOfFacets is the number of distinct facet values found for this facet. If the facet.limit parameter is set in the query the number of facets will be equal to this number. The facetValues array will contain all found values and the number of documents having this facet if this facet is asked for.
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 *
 */

var request = require('./utils/request');

var Search = function(ctx, query) {

    Search.query = query;
    Search.ctx = ctx;
    Search.facets = [];

    return Search;

};

Search.place = require('./facets/place');
Search.role = require('./facets/role');
Search.keywords = require('./facets/keywords');
Search.language = require('./facets/language');
Search.type = require('./facets/type');
Search.sector = require('./facets/sector');
Search.time = require('./facets/time');
Search.provider = require('./facets/provider');
Search.license = require('./facets/license');
Search.licenseGroup = require('./facets/licenseGroup');
Search.get = require('./facets/get');

var SearchMethod = function(ctx) {
    SearchMethod.ctx = ctx;
    return SearchMethod;
};

/**
 * The method facets of search returns all available facets or all available facets of a specific type.
 * This method provides response data only as application/json. It is a read-only service and must be
 * accessed with a HTTP-GET-request.
 *
 *     GET /search/facets?<QueryParameters> HTTP/1.1
 *
 * @param {String} type Type of the returned facets, which can be EXTENDED, SEARCH, TECHNICAL
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/facets
 *
 */
SearchMethod.facets = function(type) {

    if (typeof type !== 'string') {
        throw new Error('facet type should be type of string');
    }

    type = type.toUpperCase();

    if (type && type !== 'EXTENDED' && type !== 'SEARCH' && type !== 'TECHNICAL') {
        throw new Error('facets method query should contain one of the following terms: EXTENDED, SEARCH, TECHNICAL');
    }

    var query = type ? '?query=' + type : '';
    var uri = 'search/facets' + query;

    return request.call(this.ctx, uri, {
        json: true
    });

};

/**
 * The method sortcriteria of search returns the available sort criteria and the default criterion of the
 * search result sets. This method provides response data only as application/json. It is a read-only service
 * and must be accessed with a HTTP-GET-request.
 *
 *     GET /search/sortcriteria HTTP/1.1
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/sortcriteria
 *
 */
SearchMethod.sortcriteria = function() {

    if (arguments.length) {
        throw new Error('method `binaries` doesn\'t take any arguments');
    }

    return request.call(this.ctx, 'search/sortcriteria', {
        json: true
    });
};

/**
 * The method suggest of search returns suggestions for a given query. This method provides response data
 * only as application/json. It is a read-only service and must be accessed with a HTTP-GET-request.
 *
 *     GET /search/suggest?<QueryParameters> HTTP/1.1
 *
 * @param {String} query Query term(s) to be completed/suggested.
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/suggest
 *
 */
SearchMethod.suggest = function(query) {

    if (!query || typeof query !== 'string') {
        throw new Error('suggest method requires a query from type string');
    }

    var uri = 'search/suggest?query=' + query;
    return request.call(this.ctx, uri, {
        json: true
    });

};

/**
 * Expose methods
 */
module.exports = function(query) {

    /**
     * if query is given return search API
     */
    if (typeof query === 'string') {
        return Search(this, query);
    }

    /**
     * otherwise expose search methods
     */
    return SearchMethod(this);

};