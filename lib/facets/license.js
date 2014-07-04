/**
 * license facet
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 */

module.exports = function(license) {
    var facet = 'license';

    if(typeof license === 'string') {
        this.facets.push(facet + '=' + encodeURIComponent(license));
    }

    this.facets.push('facet=' + facet);
    return this;
};