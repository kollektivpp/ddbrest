/**
 * test helper to test if searchresults gets limited by using facets
 */

var DDBRest = require('../../index');

module.exports = function(searchObj, facetMethod, facetID) {
    return function(done) {
        // console.log('----------------->',facetMethod);
        // console.log(searchObj);
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
                }

                facet.facetValues.length.should.be.greaterThan(0);

                var facetValue = Math.floor(Math.random() * facet.facetValues.length),
                    facetCount = facet.facetValues[facetValue].count,
                    value = facet.facetValues[facetValue].value.replace('_1_affiliate_fct_involved','');

                searchObj[facetMethod](value).get(0, 0).then(function(result) {
                    result.numberOfResults.should.be.exactly(facetCount);
                    done();
                }, done);

            });
        }, done);
    };
};