/**
 * fire request
 *
 * @param  {Number} offset      This is the number of the first entry of the result.
 * @param  {Number} rows        This is the count of result entries to be shown in total.
 * @param  {Number} sort        Defines the sorting order, which can be one of the following values. It requires the query parameter, otherwise the sort is always random_<seed>. [ALPHA_ASC | ALPHA_DESC | RANDOM_<seed> | RELEVANCE]
 * @param  {Number} minDocs     The amount of documents a facet must exceed to be included in the result set.
 * @param  {Number} facetLimit  Limits the number of values of a facet to the given amount.
 * @return {Object}             promise of request
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 */

var request = require('../utils/request');

module.exports = function(offset, rows, sort, minDocs, facetLimit) {

    var query = [];

    if(typeof offset === 'number') {
        query.push('offset=' + offset);
    }

    if(typeof rows === 'number') {
        query.push('rows=' + rows);
    }

    if(typeof sort === 'string' && (sort.toUpperCase() === 'ALPHA_ASC' || sort.toUpperCase() === 'ALPHA_DESC' || sort.toUpperCase().indexOf('RANDOM_') === 0 || sort.toUpperCase() === 'RELEVANCE')) {
        query.push('sort=' + sort);
    }

    if(typeof minDocs === 'number') {
        query.push('minDocs=' + minDocs);
    }

    if(typeof facetLimit === 'number') {
        query.push('facet.limit=' + facetLimit);
    }

    var uri = 'search?query=' + this.query + (this.facets.length ? '&' + this.facets.join('&') : '') + (query.length ? '&' + query.join('&') : '');
    return request.call(this.ctx, uri, { json: true });
};