/**
 * 
 * DDBRest
 *
 * js client for the DDB API
 * @see  https://api.deutsche-digitale-bibliothek.de
 * 
 */

var Q = require('q'),
    util = require('util'),
    path = require('path'),
    request = require('request');

var DDBRest = module.exports = function(token, secure) {

    if(typeof token !== 'string') {
        throw new Error('API token is required to have access to the DBB API\nSee https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/Autorisierung');
    }

    this.protocol = typeof secure === 'boolean' && secure ? 'https' : 'http';
    this.host = 'api.deutsche-digitale-bibliothek.de';
    this.oauth = {
        consumer_key: token
    }

};

DDBRest.prototype.search = function(query) {

    if(typeof query !== 'string') {
        throw new Error('search query needs to be a string');
    }

    var self = this,
        q = query,
        facets = [];

    return {
        from: function(date) {
            var facet = 'begin_time';
            facets.push('facet=' + facet);
            facets.push(facet + '=' + date);
            return this;
        },
        to: function(date) {
            var facet = 'end_time';
            facets.push('facet=' + facet)
            facets.push(facet + '=' + date);
            return this;
        },
        place: function(location) {
            var facet = 'place_fct';
            facets.push('facet=' + facet)
            facets.push(facet + '=' + location);
            return this;
        },
        role: function(role) {
            var facet = 'affiliate_fct_role';
            facets.push('facet=' + facet)
            facets.push(facet + '=' + role);
            return this;
        },
        keywords: function(keywords) {
            var facet = 'keywords_fct';
            facets.push('facet=' + facet)
            facets.push(facet + '=' + keywords);
            return this;
        },
        language: function(language) {
            var facet = 'language_fct';
            facets.push('facet=' + facet)
            facets.push(facet + '=' + language);
            return this;
        },
        type: function(type) {
            var facet = 'type_fct';
            facets.push('facet=' + facet)
            facets.push(facet + '=' + type);
            return this;
        },
        sector: function(sector) {
            var facet = 'sector_fct';
            facets.push('facet=' + facet)
            facets.push(facet + '=' + sector);
            return this;
        },
        provider: function(provider) {
            var facet = 'provider_fct';
            facets.push('facet=' + facet)
            facets.push(facet + '=' + provider);
            return this;
        },
        then: function(success,failure) {

            /**
             * concatinate query
             */
            var query = 'query=' + q + '&' + facets.join('&');
            return self.request('search', query).then(success,failure);

        }
    }
};



DDBRest.prototype.request = function(method, query) {
    var url = this.protocol + '://' + this.host + '/' + method + '?' + query,
        deferred = Q.defer();

    request.get({
        url: url,
        oauth: this.oauth,
        json: true
    }, function(err, httpResponse, body) {

        if(err) {
            return deferred.reject(new Error(err));
        }

        deferred.resolve(body);

    });

    return deferred.promise;
}
