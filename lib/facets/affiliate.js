/**
 * affiliate facet
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 */

module.exports = function(affiliate) {
    var facet = 'affiliate_fct';

    if(typeof affiliate === 'string') {
        this.facets.push(facet + '=' + encodeURIComponent(affiliate));
    }

    this.facets.push('facet=' + facet);
    return this;
};