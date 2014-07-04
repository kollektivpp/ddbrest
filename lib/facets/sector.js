/**
 * sector facet
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 */

var sectorTypes = require('../models/sectorTypes');

module.exports = function(sector) {
    var facet = 'sector_fct';

    if (typeof sector === 'string') {
        var facetValue = sectorTypes[sector.toLowerCase()];
        this.facets.push(facet + '=' + (facetValue ? facetValue.element : sector));
    }

    this.facets.push('facet=' + facet);
    return this;
};