/*jshint -W030 */

var should = require('should'),
    facetTestHelper = require('../utils/facetTestHelper'),
    query = 'Berlin';

describe('search method', function() {

    before(function() {
        should.exist(api.search);
    });

    describe('has a search interface that', function() {

        it('should provide certain methods to set facets', function() {
            var searchMethod = api.search('some search string');
            searchMethod.should.have.ownProperty('place');
            searchMethod.should.have.ownProperty('role');
            searchMethod.should.have.ownProperty('keywords');
            searchMethod.should.have.ownProperty('language');
            searchMethod.should.have.ownProperty('type');
            searchMethod.should.have.ownProperty('sector');
            searchMethod.should.have.ownProperty('provider');
        });

        it('makes it possible to search something', function(done) {
            api.search(query).get().then(function(result) {
                result.numberOfResults.should.be.greaterThan(0);
                done();
            }, done);
        });

        describe('should provide facets to define the search result', function() {

            /**
             * the following tests query all possible facets first to do
             * another request using a random facet
             */
            it('by using the place facet',        facetTestHelper(api.search(query), 'place', 'place_fct'));
            it('by using the keywords facet',     facetTestHelper(api.search(query), 'keywords', 'keywords_fct'));
            it('by using the type facet',         facetTestHelper(api.search(query), 'type', 'type_fct'));
            it('by using the provider facet',     facetTestHelper(api.search(query), 'provider', 'provider_fct'));
            it('by using the role facet',         facetTestHelper(api.search(query), 'role', 'affiliate_fct_role'));
            it('by using the language facet',     facetTestHelper(api.search(query), 'language', 'language_fct'));
            it('by using the sector facet',       facetTestHelper(api.search(query), 'sector', 'sector_fct'));
            it('by using the licenseGroup facet', facetTestHelper(api.search(query), 'licenseGroup', 'license_group'));
            it('by using the license facet',      facetTestHelper(api.search(query), 'license', 'license'));
            it('by using the time facet',         facetTestHelper(api.search(query), 'time', 'time_fct'));

        });

    });
});