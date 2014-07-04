/**
 * license group facet
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 */

module.exports = function(group) {
    var facet = 'license_group';

    if(typeof group === 'string') {
        this.facets.push(facet + '=' + encodeURIComponent(group));
    }

    this.facets.push('facet=' + facet);
    return this;
};