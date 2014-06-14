/**
 *
 * DDBRest
 *
 * js client for the DDB API
 * @see  https://api.deutsche-digitale-bibliothek.de
 *
 */

var Q = require('q'),
    fs = require('fs'),
    util = require('util'),
    path = require('path'),
    merge = require('deepmerge'),
    request = require('request'),

    // models
    sectorTypes = require('./lib/models/sectorTypes'),
    hirarchyTypes = require('./lib/models/hierarchyTypes');

var DDBRest = module.exports = function(token, secure) {

    if (typeof token !== 'string') {
        throw new Error('API token is required to have access to the DBB API\nSee https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/Autorisierung');
    }

    this.protocol = typeof secure === 'boolean' && secure ? 'https' : 'http';
    this.host = 'api.deutsche-digitale-bibliothek.de';
    this.oauth = {
        consumer_key: token
    };

};

DDBRest.prototype.search = function(query) {

    if (typeof query !== 'string') {
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
            facets.push('facet=' + facet);
            facets.push(facet + '=' + date);
            return this;
        },
        place: function(location) {
            var facet = 'place_fct';
            facets.push('facet=' + facet);
            facets.push(facet + '=' + location);
            return this;
        },
        role: function(role) {
            var facet = 'affiliate_fct_role';
            facets.push('facet=' + facet);
            facets.push(facet + '=' + role);
            return this;
        },
        keywords: function(keywords) {
            var facet = 'keywords_fct';
            facets.push('facet=' + facet);
            facets.push(facet + '=' + keywords);
            return this;
        },
        language: function(language) {
            var facet = 'language_fct';
            facets.push('facet=' + facet);
            facets.push(facet + '=' + language);
            return this;
        },
        type: function(type) {
            var facet = 'type_fct';
            facets.push('facet=' + facet);
            facets.push(facet + '=' + type);
            return this;
        },
        sector: function(sector) {
            var facet = 'sector_fct',
                facetValue = sectorTypes[sector.toLowerCase()];

            if (typeof sector !== 'string') {
                throw new Error('sector facet should be type of string');
            }

            if (!facetValue) {
                throw new Error('sector ' + sector + ' couldn\'t be found!\nPlease try one of the following: ' + Object.keys(sectorTypes));
            }

            facets.push('facet=' + facet);
            facets.push(facet + '=' + facetValue.element);
            return this;
        },
        provider: function(provider) {
            var facet = 'provider_fct';
            facets.push('facet=' + facet);
            facets.push(facet + '=' + provider);
            return this;
        },
        then: function(success, failure) {

            /**
             * concatinate query
             */
            var query = 'query=' + q + '&' + facets.join('&'),
                deferred = Q.defer();

            self.request('search', '', query, { json: true }, function(err, httpResponse, body) {

                if (err) {
                    return failure(new Error(err));
                }

                success(body, httpResponse);

            });

        }
    };
};

DDBRest.prototype.binary = function(identifier, binaryPathFile) {

    var self = this;

    /**
     * check required parameters
     */
    if (typeof identifier !== 'string' || typeof binaryPathFile !== 'string') {
        throw new Error('number or type of arguments don\'t agree with binary search');
    }

    return {
        then: function(success, failure) {
            return self.request('binary', path.join(identifier, binaryPathFile), '', { headers: { 'Accept': 'application/octet-stream' } }, function(err, httpResponse, body) {

                if (err) {
                    return failure(new Error(err));
                }

                if(typeof body === 'string' && body.indexOf('not found') > -1) {
                    err = JSON.parse(body);
                    return failure(new Error(err.name + ': ' + err.message));
                }

                success(body, httpResponse);

            });
        },
        toFile: function(fileName, cb) {

            if(typeof fileName !== 'string' || (cb && typeof cb !== 'function')) {
                throw new Error('number or type of arguments don\'t agree with binary.toFile command');
            }

            var req = self.request('binary', path.join(identifier, binaryPathFile), '', { headers: { 'Accept': 'application/octet-stream' } }, function(err, httpResponse, body) {

                if(err) {
                    throw new Error(err);
                }

                if(typeof body === 'string' && body.indexOf('not found') > -1) {
                    err = JSON.parse(body);
                    throw new Error(err.name + ': ' + err.message);
                }

                cb(err, httpResponse, body);

            }).pipe(fs.createWriteStream(fileName));

        }
    };
};

DDBRest.prototype.request = function(method, path, query, opts, cb) {
    var url = this.protocol + '://' + this.host + '/' + method + '/' + path,
        params = merge({ url: url, oauth: this.oauth }, opts || {});

    return request.get(params, cb);
};
