/**
 * place facet
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 */

module.exports = function(location) {

    var facet = 'place_fct';
    this.facets.push('facet=' + facet);

    if(typeof location === 'string') {
        this.facets.push(facet + '=' + encodeURIComponent(location));
    }

    return this;
};