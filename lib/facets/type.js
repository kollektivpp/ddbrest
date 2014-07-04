/**
 * type facet
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 */

module.exports = function(type) {
    var facet = 'type_fct';

    if(typeof type === 'string') {
        this.facets.push(facet + '=' + encodeURIComponent(type));
    }

    this.facets.push('facet=' + facet);
    return this;
};