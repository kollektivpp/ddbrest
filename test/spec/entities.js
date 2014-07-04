/*jshint -W030 */

var facetTestHelper = require('../utils/facetTestHelper'),
    query = 'Berlin',
    docId;

describe.skip('entities method', function() {

    before(function() {
        should.exist(api.entities);
    });

    describe('should throw an error', function() {

        it('if method gets initialised without required parameters', function() {
             api.institutions.bind(null).should.throw();
        });

        it('if parameter is not typeof string', function() {
             api.institutions.bind(null, 1).should.throw();
             api.institutions.bind(null, {}).should.throw();
             api.institutions.bind(null, []).should.throw();
             api.institutions.bind(null, true).should.throw();
             api.institutions.bind(null, function(){}).should.throw();
        });

    });

    /**
     * we can not test the entities method due to GeneralException
     */
    describe.skip('has a search interface that', function() {

        it('should provide certain methods to set facets', function() {
            var searchMethod = api.entities('some search string');
            searchMethod.should.have.ownProperty('place');
            searchMethod.should.have.ownProperty('role');
            searchMethod.should.have.ownProperty('keywords');
            searchMethod.should.have.ownProperty('language');
            searchMethod.should.have.ownProperty('type');
            searchMethod.should.have.ownProperty('sector');
            searchMethod.should.have.ownProperty('provider');
        });

        it('makes it possible to search something', function() {
            return api.entities(query).get().should.have.eventually.property('numberOfResults');
        });

        it('makes it possible to search something and sort results descended', function() {
            return api.entities(query).get(0, 1, 'alpha_desc').should.be.fulfilled.then(function(res) {
                docId = res.results[0].docs[0].id;
            });
        });

        it('makes it possible to search something and sort results ascendent', function() {
            return api.entities(query).get(0, 1, 'alpha_asc').should.be.fulfilled.then(function(res) {
                res.results[0].docs[0].id.should.be.not.equal(docId);
            });
        });

        describe('should provide facets to define the search result', function() {

            /**
             * the following tests query all possible facets first to do
             * another request using a random facet
             */
            it('by using the place facet',        facetTestHelper(api.entities(query), 'place', 'place_fct'));
            it('by using the keywords facet',     facetTestHelper(api.entities(query), 'keywords', 'keywords_fct'));
            it('by using the type facet',         facetTestHelper(api.entities(query), 'type', 'type_fct'));
            it('by using the provider facet',     facetTestHelper(api.entities(query), 'provider', 'provider_fct'));
            it('by using the role facet',         facetTestHelper(api.entities(query), 'role', 'affiliate_fct_role'));
            it('by using the language facet',     facetTestHelper(api.entities(query), 'language', 'language_fct'));
            it('by using the sector facet',       facetTestHelper(api.entities(query), 'sector', 'sector_fct'));
            it('by using the licenseGroup facet', facetTestHelper(api.entities(query), 'licenseGroup', 'license_group'));
            it('by using the license facet',      facetTestHelper(api.entities(query), 'license', 'license'));
            it('by using the time facet',         facetTestHelper(api.entities(query), 'time', 'time_fct'));

        });

    });

});