/**
 * type facet
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 */

var mediaTypes = require('../models/mediaTypes');

module.exports = function(type) {
    var facet = 'type_fct';

    if(typeof type === 'string') {
        var facetValue = mediaTypes[type.toLowerCase()];
        this.facets.push(facet + '=' + encodeURIComponent(facetValue ? facetValue.element : type));
    }

    this.facets.push('facet=' + facet);
    return this;
};