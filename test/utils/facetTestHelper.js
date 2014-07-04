/**
 * test helper to test if searchresults gets limited by using facets
 */

var DDBRest = require('../../index');

var facetTestHelper = module.exports = function(searchObj, facetMethod, facetID) {
    return function(done) {
        searchObj[facetMethod]().get(0, 0).then(function(result) {
            result.facets.forEach(function(facet) {

                if (facet.field !== facetID) {
                    return;
                }

                /**
                 * if no facets were found anymore, create a new DDB object and start again
                 */
                if(facet.facetValues.length === 0) {
                    searchObj = new DDBRest(process.env.DDBREST_KEY).search('Berlin');
                    return facetTestHelper(searchObj, facetMethod, facetID)(done);
                }

                var facetValue = Math.floor(Math.random() * facet.facetValues.length),
                    facetCount = facet.facetValues[facetValue].count,
                    value = facet.facetValues[facetValue].value.replace('_1_affiliate_fct_involved','');

                searchObj[facetMethod](value).get(0, 0).should.eventually.contain({numberOfResults: facetCount}).notify(done);

            });
        }, done);
    };
};