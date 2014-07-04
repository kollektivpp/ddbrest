/**
 * role facets
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 */

module.exports = function(role) {
    var facet = 'affiliate_fct_role';

    if(typeof role === 'string') {
        this.facets.push(facet + '=' + encodeURIComponent(role));
    }

    this.facets.push('facet=' + facet);
    return this;
};