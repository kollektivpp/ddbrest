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

var callback = require('./utils/callback'),
    request = require('./utils/request'),
    sectorTypes = require('./models/sectorTypes');

module.exports = function(query) {

    var self = this,
        q = query,
        facets = [];

    if (typeof query !== 'string') {
        return {
            facets: function(query) {

                if(!query || typeof query !== 'string') {
                    throw new Error('facets method requires a query from type string');
                }

                query = query.toUpperCase();

                if(query !== 'EXTENDED' && query !== 'SEARCH' && query !== 'TECHNICAL') {
                    throw new Error('facets method query should contain one of the following terms: EXTENDED, SEARCH, TECHNICAL');
                }

                return {
                    then: function(success, failure) {

                        var q = query ? 'query=' + query : '';

                        request('search', 'facets', q, {
                            json: true
                        }, callback.bind(self, success, failure));

                    }
                };
            },
            sortcriteria: function(success, failure) {
                request('search', 'sortcriteria', '', {
                    json: true
                }, callback.bind(self, success, failure));
            },
            suggest: function(query) {

                if(!query || typeof query !== 'string') {
                    throw new Error('suggest method requires a query from type string');
                }

                return {
                    then: function(success, failure) {

                        var q = query ? 'query=' + query : '';

                        request('search', 'suggest', q, {
                            json: true
                        }, callback.bind(self, success, failure));

                    }
                };
            }
        };
    }

    return {
        from: function(date) {
            var facet = 'begin_time';
            facets.push('facet=' + facet);
            facets.push(facet + '=' + date);
            return this;
        },
        to: function(date) {
            var facet = 'end_time';
            facets.push('facet=' + facet);
            facets.push(facet + '=' + date);
            return this;
        },
        place: function(location) {
            var facet = 'place_fct';
            facets.push('facet=' + facet);
            facets.push(facet + '=' + location);
            return this;
        },
        role: function(role) {
            var facet = 'affiliate_fct_role';
            facets.push('facet=' + facet);
            facets.push(facet + '=' + role);
            return this;
        },
        keywords: function(keywords) {
            var facet = 'keywords_fct';
            facets.push('facet=' + facet);
            facets.push(facet + '=' + keywords);
            return this;
        },
        language: function(language) {
            var facet = 'language_fct';
            facets.push('facet=' + facet);
            facets.push(facet + '=' + language);
            return this;
        },
        type: function(type) {
            var facet = 'type_fct';
            facets.push('facet=' + facet);
            facets.push(facet + '=' + type);
            return this;
        },
        sector: function(sector) {
            var facet = 'sector_fct',
                facetValue = sectorTypes[sector.toLowerCase()];

            if (typeof sector !== 'string') {
                throw new Error('sector facet should be type of string');
            }

            if (!facetValue) {
                throw new Error('sector ' + sector + ' couldn\'t be found!\nPlease try one of the following: ' + Object.keys(sectorTypes));
            }

            facets.push('facet=' + facet);
            facets.push(facet + '=' + facetValue.element);
            return this;
        },
        provider: function(provider) {
            var facet = 'provider_fct';
            facets.push('facet=' + facet);
            facets.push(facet + '=' + provider);
            return this;
        },
        then: function(success, failure) {

            /**
             * concatinate query
             */
            var query = 'query=' + q + '&' + facets.join('&');

            request('search', '', query, {
                json: true
            }, callback.bind(self, success, failure));

        }
    };
};