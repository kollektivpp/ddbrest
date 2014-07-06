/**
 * language facet
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 */

var languageTypes = require('../models/languageTypes');

module.exports = function(language) {
    var facet = 'language_fct';

    if(typeof language === 'string') {
        var facetValue = languageTypes[language.toLowerCase()];
        this.facets.push(facet + '=' + encodeURIComponent(facetValue ? facetValue.element : language));
    }

    this.facets.push('facet=' + facet);
    return this;
};