/**
 * keyword facet
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 */

module.exports = function(keywords) {
    var facet = 'keywords_fct';

    if(typeof keywords === 'string') {
        this.facets.push(facet + '=' + encodeURIComponent(keywords));
    }

    this.facets.push('facet=' + facet);
    return this;
};