/**
 * time facet
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 */

var timeTypes = require('../models/timeTypes');

module.exports = function(time) {
    var facet = 'time_fct';

    if(typeof time === 'string') {
        var facetValue = timeTypes[time];
        this.facets.push(facet + '=' + (facetValue ? facetValue.element : time));
    }

    this.facets.push('facet=' + facet);
    return this;
};