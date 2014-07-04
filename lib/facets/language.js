/**
 * language facet
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 */

module.exports = function(language) {
    var facet = 'language_fct';

    if(typeof language === 'string') {
        this.facets.push(facet + '=' + encodeURIComponent(language));
    }

    this.facets.push('facet=' + facet);
    return this;
};