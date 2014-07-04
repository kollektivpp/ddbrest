/**
 * provider facet
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 */

module.exports = function(provider) {
    var facet = 'provider_fct';

    if(typeof provider === 'string') {
        this.facets.push(facet + '=' + encodeURIComponent(provider));
    }

    this.facets.push('facet=' + facet);
    return this;
};