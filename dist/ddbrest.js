(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * binary
 *
 * The method binary returns the content of a binary file of an item for a given item-ID. This method provides
 * response data as application/octet-stream. A binary file at DDB can be a picture, a tumbnail of a picture,
 * a video clip, an audio file etc. It is a read-only service and must be accessed with a HTTP-GET-request.
 *
 *     GET /binary/<PathParameters> HTTP/1.1
 *
 * @param {String} identifier The ID of the requested item.
 * @param {String} path       The relative path and the filename of a binary file separated by slashes. The path and filename can be retrieved via the method binaries.
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/binary
 * @author Christian Bromann <mail@christian-bromann.com>
 *
 */

var request = require('./utils/request'),
    path = require('path'),
    Q = require('q');

var Binary = function(identifier, binaryPathFile) {

    /*!
     * check required parameters
     */
    if (typeof identifier !== 'string' || typeof binaryPathFile !== 'string') {
        throw new Error('number or type of arguments don\'t agree with binary search');
    }

    Binary.identifier = identifier;
    Binary.binaryPathFile = binaryPathFile;
    Binary.ctx = this;

    return Binary;

};

/**
 * Method to perform method request.
 *
 *     ddbrest.binary(identifier, binaryPathFile).get().then([SuccessCallback],[FailureCallback])
 *
 * @return {String} base64 encoded file
 *
 */
Binary.get = function() {

    if(arguments.length) {
        throw new Error('method `get` doesn\'t take any arguments');
    }

    var uri = path.join('binary', this.identifier, this.binaryPathFile);
    return request.call(this.ctx, uri, { headers: { 'Accept': 'application/octet-stream' }});
};

/**
 * Performs method requests and saves response into an file
 *
 *     ddbrest.binary(identifier, binaryPathFile).toFile(filepath).then([SuccessCallback],[FailureCallback])
 *
 * @param  {String} fileName  file name to save to
 * @return {String}           base64 encoded file
 */
Binary.toFile = function(fileName) {

    if (typeof fileName !== 'string') {
        throw new Error('number or type of arguments don\'t agree with binary.toFile command');
    }

    var uri = path.join('binary', this.identifier, this.binaryPathFile);
    return request.call(this.ctx, uri, { headers: { 'Accept': 'application/octet-stream' }}, fileName);

};

Binary.getPath = function() {
    var imagePath = path.join('binary', this.identifier, this.binaryPathFile) + '?oauth_consumer_key=' + this.ctx.token;
    return Q.resolve(this.ctx.protocol + '://' + this.ctx.host + '/' + imagePath);
};

/**
 * Expose methods
 */
module.exports = Binary;
},{"./utils/request":24,"path":48,"q":77}],2:[function(require,module,exports){
(function (global){
/**
 * DDBRest
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 * @license https://raw.githubusercontent.com/kollektivpp/ddbrest/master/LICENSE MIT
 */

/**
 * setup DDBRest
 * @param {String}  token   Eindeutiger API-Schlüssel des Benutzers
 * @param {Boolean} secure  if true all requests run over https
 */
var DDBRest = module.exports = function DDBRest(token, secure) {

    if (typeof token !== 'string') {
        throw new Error('API token is required to have access to the DBB API\nSee https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/Autorisierung');
    }

    this.protocol = typeof secure === 'boolean' && secure ? 'https' : 'http';
    this.host = 'api.deutsche-digitale-bibliothek.de';
    this.token = token;
    this.oauth = {
        consumer_key: token
    };

};

/**
 * Expose internals
 */
DDBRest.prototype.items = require('./items');
DDBRest.prototype.binary = require('./binary');
DDBRest.prototype.search = require('./search');
DDBRest.prototype.entities = require('./entities');
DDBRest.prototype.institutions = require('./institutions');

/**
 * expose module for node and browser environment (AMD, commonjs)
 */
if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], DDBRest);
} else {
    // Browser globals
    global.DDBRest = DDBRest;
}
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./binary":1,"./entities":3,"./institutions":16,"./items":17,"./search":22}],3:[function(require,module,exports){
/**
 * entities
 *
 * The method entities is providing access to the the Lucene search index of entities used at DDB. This method provides
 * response data only as application/json. It is a read-only service and must be accessed with a HTTP-GET-request.
 *
 *     GET /entities?<QueryParameters> HTTP/1.1
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/institutions
 * @author Christian Bromann <mail@christian-bromann.com>
 *
 */

var Entities = function(query) {

    if (typeof query !== 'string') {
        throw new Error('number or type of arguments don\'t agree with institutions method');
    }

    Entities.ctx = this;
    Entities.facets = [];
    Entities.query = encodeURIComponent(query);

    return Entities;

};

Entities.affiliate = require('./facets/affiliate');
Entities.place = require('./facets/place');
Entities.role = require('./facets/role');
Entities.keywords = require('./facets/keywords');
Entities.language = require('./facets/language');
Entities.type = require('./facets/type');
Entities.sector = require('./facets/sector');
Entities.time = require('./facets/time');
Entities.provider = require('./facets/provider');
Entities.license = require('./facets/license');
Entities.licenseGroup = require('./facets/licenseGroup');
Entities.get = require('./facets/get')('entities');

/**
 * Expose methods
 */
module.exports = Entities;
},{"./facets/affiliate":4,"./facets/get":5,"./facets/keywords":6,"./facets/language":7,"./facets/license":8,"./facets/licenseGroup":9,"./facets/place":10,"./facets/provider":11,"./facets/role":12,"./facets/sector":13,"./facets/time":14,"./facets/type":15}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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

module.exports = function(type) {

    /* istanbul ignore if */
    if(typeof type !== 'string') {
        throw new Error('you need to pass a method type in order to fire the request');
    }

    return function get(offset, rows, sort, minDocs, facetLimit) {

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

        var uri = type + '?query=' + this.query + (this.facets.length ? '&' + this.facets.join('&') : '') + (query.length ? '&' + query.join('&') : '');
        return request.call(this.ctx, uri, { json: true });

    };

};
},{"../utils/request":24}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
},{"../models/languageTypes":18}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
/**
 * license group facet
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 */

module.exports = function(group) {
    var facet = 'license_group';

    if(typeof group === 'string') {
        this.facets.push(facet + '=' + encodeURIComponent(group));
    }

    this.facets.push('facet=' + facet);
    return this;
};
},{}],10:[function(require,module,exports){
/**
 * place facet
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 */

module.exports = function(location) {

    var facet = 'place_fct';
    this.facets.push('facet=' + facet);

    if(typeof location === 'string') {
        this.facets.push(facet + '=' + encodeURIComponent(location));
    }

    return this;
};
},{}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
/**
 * sector facet
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 */

var sectorTypes = require('../models/sectorTypes');

module.exports = function(sector) {
    var facet = 'sector_fct';

    if (typeof sector === 'string') {
        var facetValue = sectorTypes[sector.toLowerCase()];
        this.facets.push(facet + '=' + (facetValue ? facetValue.element : sector));
    }

    this.facets.push('facet=' + facet);
    return this;
};
},{"../models/sectorTypes":20}],14:[function(require,module,exports){
/**
 * time facet
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 */

var timeTypes = require('../models/timeTypes');

module.exports = function(time) {
    var facet = 'time_fct';

    if(typeof time === 'string') {
        var facetValue = timeTypes[time];
        this.facets.push(facet + '=' + (facetValue ? facetValue.element : time));
    }

    this.facets.push('facet=' + facet);
    return this;
};
},{"../models/timeTypes":21}],15:[function(require,module,exports){
/**
 * type facet
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 */

var mediaTypes = require('../models/mediaTypes');

module.exports = function(type) {
    var facet = 'type_fct';

    if(typeof type === 'string') {
        var facetValue = mediaTypes[type.toLowerCase()];
        this.facets.push(facet + '=' + encodeURIComponent(facetValue ? facetValue.element : type));
    }

    this.facets.push('facet=' + facet);
    return this;
};
},{"../models/mediaTypes":19}],16:[function(require,module,exports){
/**
 * institutions
 *
 * The method institutions returns a list of institutions which are registered at the DDB. This method provides
 * response data only as application/json. It is a read-only service and must be accessed with a HTTP-GET-request.
 *
 *     GET /institutions?<QueryParameters> HTTP/1.1
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/institutions
 * @author Christian Bromann <mail@christian-bromann.com>
 *
 */

var request = require('./utils/request'),
    sectorTypes = require('./models/sectorTypes');

var Institutions = function(sector) {

    if(typeof sector !== 'string') {
        throw new Error('number or type of arguments don\'t agree with institutions method');
    }

    var sectorType = sectorTypes[sector.toLowerCase()];

    Institutions.ctx = this;
    Institutions.sector = (sectorType ? sectorType.element : sector);

    return Institutions;

};

/**
 * Method to perform method request.
 */
Institutions.get = function() {

    if(arguments.length) {
        throw new Error('method `get` doesn\'t take any arguments');
    }

    var query = '';

    if (this.sector) {
        query = '?sector=' + this.sector.element;
    }

    return request.call(this.ctx, 'institutions' + query, { json: true });

};

/**
 * The method sectors returns the list of available institution sectors at the DDB. Each sector contains a name
 * in the property value and the number of institutions that belong to this sector (count). As institutions can
 * belong to multiple sectors, the overall sum of the different counts can be higher than the total number of
 * institutions. This method provides response data only as application/json. It is a read-only service and
 * must be accessed with a HTTP-GET-request.
 *
 *     GET /institutions/sectors?<QueryParameters> HTTP/1.1
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/sectors
 *
 */
Institutions.sectors = function() {

    if(arguments.length) {
        throw new Error('method `sectors` doesn\'t take any arguments');
    }

    return request.call(this.ctx, 'institutions/sectors', { json: true });
};

/**
 * Expose methods
 */
module.exports = Institutions;
},{"./models/sectorTypes":20,"./utils/request":24}],17:[function(require,module,exports){
/**
 * Items
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/items
 * @author Christian Bromann <mail@christian-bromann.com>
 *
 */

var request = require('./utils/request'),
    path = require('path');

var Items = function(identifier) {

    if (typeof identifier !== 'string') {
        throw new Error('the method `items` requires an identifier');
    }

    Items.identifier = identifier;
    Items.ctx = this;

    return Items;

};

/**
 * The method aip returns the Archive Information Package (AIP) of an item for a given item-ID. An AIP
 * contains all available information of an item including a persistent identifier. This method provides
 * response data as application/json and application/xml. It is a read-only service and must be accessed
 * with a HTTP-GET-request.
 *
 *     GET /items/<PathParameters>/aip?<QueryParameters> HTTP/1.1
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/aip
 *
 */
Items.aip = function() {

    if(arguments.length) {
        throw new Error('method `aip` doesn\'t take any arguments');
    }

    var uri = path.join('items', this.identifier, 'aip');
    return request.call(this.ctx, uri, { json: true });
};

/**
 * The method binaries returns a list of binary data files related to an item for a given item-ID. Binary
 * data can be accessed with the binary method. The binaries method provides response data as application/json
 * and application/xml. It is a read-only service and must be accessed with a HTTP-GET-request.
 *
 *     GET /items/<PathParameters>/binaries?<QueryParameters> HTTP/1.1
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/binaries
 *
 */
Items.binaries = function() {

    if(arguments.length) {
        throw new Error('method `binaries` doesn\'t take any arguments');
    }

    var uri = path.join('items', this.identifier, 'binaries');
    return request.call(this.ctx, uri, { json: true });
};

/**
 * The method children returns metadata of these items which are related to the inquired item and which
 * are one level deeper (child item) in the hierarchy than the inquired item. The child items will be
 * sorted according to the position field of the hierarchy nodes. If the position is the same the label
 * will be used for sorting. The provided metadata can be empty if the item does not have any child items.
 * This method provides response data as application/json and application/xml. It is a read-only service
 * and must be accessed with a HTTP-GET-request.
 *
 *     GET /items/<PathParameters>/children?<QueryParameters> HTTP/1.1
 *
 * @param {Number} offset     Offset position of first entry in the result list.
 * @param {Number} rows       Number of entries in the result list.
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/children
 *
 */
Items.children = function(offset, rows) {

    var query = [];

    if(typeof offset === 'number') {
        query.push('offset=' + offset);
    }

    if(typeof rows === 'number') {
        query.push('rows=' + rows);
    }

    var uri = path.join('items', this.identifier, 'children', '?') + query.join('&');
    return request.call(this.ctx, uri, { json: true });

};

/**
 * The method edm returns the Europeana Data Model (DDB profile) of an item for a given item-ID. This
 * method provides response data as application/json and application/xml. It is a read-only service and
 * must be accessed with a HTTP-GET-request.
 *
 *     GET /items/<PathParameters>/edm?<QueryParameters> HTTP/1.1
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/edm
 *
 */
Items.edm = function() {

    if(arguments.length) {
        throw new Error('method `edm` doesn\'t take any arguments');
    }

    var uri = path.join('items', this.identifier, 'edm');
    return request.call(this.ctx, uri, { json: true });
};

/**
 * The method indexing-profile returns the profile of an item for a given item-ID, which was used for
 * the indexing process. This method provides response data as application/json and application/xml.
 * It is a read-only service and must be accessed with a HTTP-GET-request.
 *
 *     GET /items/<PathParameters>/indexing-profile?<QueryParameters> HTTP/1.1
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/indexing-profile
 *
 */
Items.indexingProfile = function() {

    if(arguments.length) {
        throw new Error('method `indexingProfile` doesn\'t take any arguments');
    }

    var uri = path.join('items', this.identifier, 'indexing-profile');
    return request.call(this.ctx, uri, { json: true });

};

/**
 * The method parents returns the profile of an item for a given item-ID, which was used for
 * the indexing process. This method provides response data as application/json and application/xml.
 * It is a read-only service and must be accessed with a HTTP-GET-request.
 *
 *     GET /items/<PathParameters>/parents?<QueryParameters> HTTP/1.1
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/parents
 *
 */
Items.parents = function() {

    if(arguments.length) {
        throw new Error('method `parents` doesn\'t take any arguments');
    }

    var uri = path.join('items', this.identifier, 'parents');
    return request.call(this.ctx, uri, { json: true });

};

/**
 * The method source returns the initial XML metadata of an item for a given item-ID. The format
 * can be one of the accepted input data formats (e.g. MARCXML, METS/MODS, LIDO, Dublin Core).
 * This method provides response data only as application/xml because the DDB only accept XML-based
 * metadata from its contributing institutions. It is a read-only service and must be accessed with
 * a HTTP-GET-request.
 *
 *     GET /items/<PathParameters>/source?<QueryParameters> HTTP/1.1
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/source
 *
 */
Items.source = function() {

    if(arguments.length) {
        throw new Error('method `source` doesn\'t take any arguments');
    }

    var uri = path.join('items', this.identifier, 'source');
    return request.call(this.ctx, uri);

};

/**
 * The method view returns the view of an item for a given item-ID. A view is the data set a
 * [frontend page at DDB](https://www.deutsche-digitale-bibliothek.de/item/OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF)
 * is based on. This method provides response data as application/json and application/xml. It
 * is a read-only service and must be accessed with a HTTP-GET-request.
 *
 *     GET /items/<PathParameters>/view?<QueryParameters> HTTP/1.1
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/view
 *
 */
Items.view = function() {

    if(arguments.length) {
        throw new Error('method `view` doesn\'t take any arguments');
    }

    var uri = path.join('items', this.identifier, 'view');
    return request.call(this.ctx, uri, { json: true });

};

/**
 * Expose methods
 */
module.exports = Items;
},{"./utils/request":24,"path":48}],18:[function(require,module,exports){
/**
 * language abbreviations
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 */

module.exports = {
    'deutsch': {
        element: 'ger'
    },
    'german': {
        element: 'ger'
    },
    'english': {
        element: 'eng'
    },
    'englisch': {
        element: 'eng'
    },
    'latin': {
        element: 'lat'
    },
    'latein': {
        element: 'lat'
    },
    'french': {
        element: 'fre'
    },
    'französisch': {
        element: 'fre'
    },
    'franzoesisch': {
        element: 'fre'
    },
    'russian': {
        element: 'rus'
    },
    'russisch': {
        element: 'rus'
    },
    'italian': {
        element: 'ita'
    },
    'italienisch': {
        element: 'ita'
    },
    'dutch': {
        element: 'dut'
    },
    'niederländisch': {
        element: 'dut'
    },
    'niederlaendisch': {
        element: 'dut'
    },
    'greek': {
        element: 'gre'
    },
    'griechisch': {
        element: 'gre'
    },
    'neugriechisch': {
        element: 'gre'
    },
    'neu-griechisch': {
        element: 'gre'
    },
    'ancient-greek': {
        element: 'grc'
    },
    'classical-greek': {
        element: 'grc'
    },
    'altgriechisch': {
        element: 'grc'
    },
    'alt-griechisch': {
        element: 'grc'
    },
    'spanish': {
        element: 'spa'
    },
    'spanisch': {
        element: 'spa'
    }
};

},{}],19:[function(require,module,exports){
/**
 * media namespace
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/Medientyp
 * @type alternative
 * @numerus Singular
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 */

module.exports = {
    'audio': {
        element: 'mediatype_001',
        lang: ['en','de'],
        uri: 'http://ddb.vocnet.org/medientyp/mt001'
    },
    'image': {
        element: 'mediatype_002',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/medientyp/mt002'
    },
    'bild': {
        element: 'mediatype_002',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/medientyp/mt002'
    },
    'text': {
        element: 'mediatype_003',
        lang: ['en','de'],
        uri: 'http://ddb.vocnet.org/medientyp/mt003'
    },
    'full-text': {
        element: 'mediatype_004',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/medientyp/mt004'
    },
    'volltext': {
        element: 'mediatype_004',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/medientyp/mt004'
    },
    'video': {
        element: 'mediatype_005',
        lang: ['en','de'],
        uri: 'http://ddb.vocnet.org/medientyp/mt005'
    },
    'others': {
        element: 'mediatype_006',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/medientyp/mt006'
    },
    'sonstiges': {
        element: 'mediatype_006',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/medientyp/mt006'
    },
    'no media type': {
        element: 'mediatype_007',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/medientyp/mt007'
    },
    'ohne medientyp': {
        element: 'mediatype_007',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/medientyp/mt007'
    },
    'institution': {
        element: 'mediatype_008',
        lang: ['en','de'],
        uri: 'http://ddb.vocnet.org/medientyp/mt008'
    }
};

},{}],20:[function(require,module,exports){
/**
 * section namenspaces
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/Sparte
 * @type alternative
 * @numerus Singular
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 */

module.exports = {
    'archive': {
        element: 'sec_01',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/sparte/sparte001'
    },
    'archiv': {
        element: 'sec_01',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/sparte/sparte001'
    },
    'library': {
        element: 'sec_02',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/sparte/sparte002'
    },
    'bibliothek': {
        element: 'sec_02',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/sparte/sparte002'
    },
    'monument': {
        element: 'sec_03',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/sparte/sparte003'
    },
    'denkmalpflege': {
        element: 'sec_03',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/sparte/sparte003'
    },
    'research': {
        element: 'sec_04',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/sparte/sparte004'
    },
    'forschung': {
        element: 'sec_04',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/sparte/sparte004'
    },
    'media': {
        element: 'sec_05',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/sparte/sparte005'
    },
    'mediathek': {
        element: 'sec_05',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/sparte/sparte005'
    },
    'museum': {
        element: 'sec_06',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/sparte/sparte006'
    },
    'sonstige': {
        element: 'sec_07',
        lang: ['en','de'],
        uri: 'http://ddb.vocnet.org/sparte/sparte007'
    },
    'other': {
        element: 'sec_07',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/sparte/sparte007'
    }
};

},{}],21:[function(require,module,exports){
/**
 * time namespace
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/Zeitvokabular
 */

module.exports = {
    'Geological Periods': {
        element: 'time_10000',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00112'
    },
    'Precambrian': {
        element: 'time_12000',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00109'
    },
    'Palaeozoic': {
        element: 'time_13000',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00108'
    },
    'Triassic': {
        element: 'time_14000',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00107'
    },
    'Jurassic': {
        element: 'time_15000',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00106'
    },
    'Cretaceous': {
        element: 'time_16000',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00105'
    },
    'Tertiary': {
        element: 'time_17000',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00104'
    },
    'Quaternary': {
        element: 'time_18000',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00103'
    },
    'Prehistorical Periods': {
        element: 'time_30000',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00111'
    },
    '7th millenium BC': {
        element: 'time_33000',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00102'
    },
    '6th millenium BC': {
        element: 'time_34000',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00101'
    },
    '5th millenium BC': {
        element: 'time_35000',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00100'
    },
    '4th millenium BC': {
        element: 'time_36000',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00089'
    },
    '40th century BC': {
        element: 'time_36100',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00090'
    },
    '39th century BC': {
        element: 'time_36200',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00091'
    },
    '38th century BC': {
        element: 'time_36300',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00092'
    },
    '37th century BC': {
        element: 'time_36400',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00093'
    },
    '36th century BC': {
        element: 'time_36500',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00094'
    },
    '35th century BC': {
        element: 'time_36600',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00095'
    },
    '34th century BC': {
        element: 'time_36700',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00096'
    },
    '33rd century BC': {
        element: 'time_36800',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00097'
    },
    '32nd century BC': {
        element: 'time_36900',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00098'
    },
    '31st century BC': {
        element: 'time_36950',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00099'
    },
    '3rd millenium BC': {
        element: 'time_37000',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00078'
    },
    '30th century BC': {
        element: 'time_37100',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00079'
    },
    '29th century BC': {
        element: 'time_37200',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00080'
    },
    '28th century BC': {
        element: 'time_37300',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00081'
    },
    '27th century BC': {
        element: 'time_37400',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00082'
    },
    '26th century BC': {
        element: 'time_37500',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00083'
    },
    '25th century BC': {
        element: 'time_37600',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00084'
    },
    '24th century BC': {
        element: 'time_37700',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00085'
    },
    '23rd century BC': {
        element: 'time_37800',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00086'
    },
    '22nd century BC': {
        element: 'time_37900',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00087'
    },
    '21st century BC': {
        element: 'time_37950',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00088'
    },
    '2nd millenium BC': {
        element: 'time_38000',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00067'
    },
    '20th century BC': {
        element: 'time_38100',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00068'
    },
    '19th century BC': {
        element: 'time_38200',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00069'
    },
    '18th century BC': {
        element: 'time_38300',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00070'
    },
    '17th century BC': {
        element: 'time_38400',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00071'
    },
    '16th century BC': {
        element: 'time_38500',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00072'
    },
    '15th century BC': {
        element: 'time_38600',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00073'
    },
    '14th century BC': {
        element: 'time_38700',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00074'
    },
    '13th century BC': {
        element: 'time_38800',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00075'
    },
    '12th century BC': {
        element: 'time_38900',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00076'
    },
    '11th century BC': {
        element: 'time_38950',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00077'
    },
    '1st millenium BC': {
        element: 'time_39000',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00056'
    },
    '10th century BC': {
        element: 'time_39100',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00057'
    },
    '9th century BC': {
        element: 'time_39200',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00066'
    },
    '8th century BC': {
        element: 'time_39300',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00065'
    },
    '7th century BC': {
        element: 'time_39400',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00064'
    },
    '6th century BC': {
        element: 'time_39500',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00063'
    },
    '5th century BC': {
        element: 'time_39600',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00062'
    },
    '4th century BC': {
        element: 'time_39700',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00061'
    },
    '3rd century BC': {
        element: 'time_39800',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00060'
    },
    '2nd century BC': {
        element: 'time_39900',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00059'
    },
    '1st century BC': {
        element: 'time_39950',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00058'
    },
    'Historical Periods': {
        element: 'time_60000',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00110'
    },
    '1st century': {
        element: 'time_60100',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00055'
    },
    '2nd century': {
        element: 'time_60200',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00054'
    },
    '3rd century': {
        element: 'time_60300',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00053'
    },
    '4th century': {
        element: 'time_60400',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00052'
    },
    '5th century': {
        element: 'time_60500',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00051'
    },
    '6th century': {
        element: 'time_60600',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00050'
    },
    '7th century': {
        element: 'time_60700',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00049'
    },
    '8th century': {
        element: 'time_60800',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00048'
    },
    '9th century': {
        element: 'time_60900',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00047'
    },
    '10th century': {
        element: 'time_61000',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00046'
    },
    '11th century': {
        element: 'time_61100',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00043'
    },
    '1st half 11th century': {
        element: 'time_61105',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00044'
    },
    '1st half 11th century - 1001 to 1050': {
        element: 'time_61105',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00044'
    },
    '1001 to 1050': {
        element: 'time_61105',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00044'
    },
    '2nd half 11th century': {
        element: 'time_61145',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00045'
    },
    '2nd half 11th century - 1050 to 1100': {
        element: 'time_61145',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00045'
    },
    '1051 to 1100': {
        element: 'time_61145',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00045'
    },
    '12th century': {
        element: 'time_61200',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00040'
    },
    '1st half 12th century': {
        element: 'time_61205',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00041'
    },
    '1st half 12th century - 1101 to 1150': {
        element: 'time_61205',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00041'
    },
    '1101 to 1150': {
        element: 'time_61205',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00041'
    },
    '2nd half 12th century': {
        element: 'time_61245',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00042'
    },
    '2nd half 12th century - 1151 to 1200': {
        element: 'time_61245',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00042'
    },
    '1151 to 1200': {
        element: 'time_61245',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00042'
    },
    '13th century': {
        element: 'time_61300',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00037'
    },
    '1st half 13th century': {
        element: 'time_61305',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00038'
    },
    '1st half 13th century - 1201 to 1250': {
        element: 'time_61305',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00038'
    },
    '1201 to 1250': {
        element: 'time_61305',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00038'
    },
    '2nd half 13th century': {
        element: 'time_61345',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00039'
    },
    '2nd half 13th century - 1251 to 1300': {
        element: 'time_61345',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00039'
    },
    '1251 to 1300': {
        element: 'time_61345',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00039'
    },
    '14th century': {
        element: 'time_61400',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00034'
    },
    '1st half 14th century': {
        element: 'time_61405',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00035'
    },
    '1st half 14th century - 1301 to 1350': {
        element: 'time_61405',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00035'
    },
    '1301 to 1350': {
        element: 'time_61405',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00035'
    },
    '2nd half 14th century': {
        element: 'time_61445',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00036'
    },
    '2nd half 14th century - 1351 to 1400': {
        element: 'time_61445',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00036'
    },
    '1351 to 1400': {
        element: 'time_61445',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00036'
    },
    '15th century': {
        element: 'time_61500',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00031'
    },
    '1st half 15th century': {
        element: 'time_61505',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00032'
    },
    '1st half 15th century - 1401 to 1450': {
        element: 'time_61505',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00032'
    },
    '1401 to 1450': {
        element: 'time_61505',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00032'
    },
    '2nd half 15th century': {
        element: 'time_61545',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00033'
    },
    '2nd half 15th century - 1451 to 1500': {
        element: 'time_61545',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00033'
    },
    '1451 to 1500': {
        element: 'time_61545',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00033'
    },
    '16th century': {
        element: 'time_61600',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00028'
    },
    '1st half 16th century': {
        element: 'time_61605',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00029'
    },
    '1st half 16th century - 1501 to 1550': {
        element: 'time_61605',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00029'
    },
    '1501 to 1550': {
        element: 'time_61605',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00029'
    },
    '2nd half 16th century': {
        element: 'time_61645',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00030'
    },
    '2nd half 16th century - 1551 to 1600': {
        element: 'time_61645',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00030'
    },
    '1551 to 1600': {
        element: 'time_61645',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00030'
    },
    '17th century': {
        element: 'time_61700',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00025'
    },
    '1st half 17th century': {
        element: 'time_61705',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00026'
    },
    '1st half 17th century - 1601 to 1650': {
        element: 'time_61705',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00026'
    },
    '1601 to 1650': {
        element: 'time_61705',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00026'
    },
    '2nd half 17th century': {
        element: 'time_61745',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00027'
    },
    '2nd half 17th century - 1651 to 1700': {
        element: 'time_61745',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00027'
    },
    '1651 to 1700': {
        element: 'time_61745',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00027'
    },
    '18th century': {
        element: 'time_61800',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00020'
    },
    '1st quarter 18th century': {
        element: 'time_61807',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00021'
    },
    '1st quarter 18th century - 1701 to 1725': {
        element: 'time_61807',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00021'
    },
    '1701 to 1725': {
        element: 'time_61807',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00021'
    },
    '2nd quarter 18th century': {
        element: 'time_61825',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00022'
    },
    '2nd quarter 18th century - 1726 to 1750': {
        element: 'time_61825',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00022'
    },
    '1726 to 1750': {
        element: 'time_61825',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00022'
    },
    '3rd quarter 18th century': {
        element: 'time_61847',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00023'
    },
    '3rd quarter 18th century - 1751 to 1775': {
        element: 'time_61847',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00023'
    },
    '1751 to 1775': {
        element: 'time_61847',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00023'
    },
    '4th quarter 18th century': {
        element: 'time_61875',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00024'
    },
    '4th quarter 18th century - 1776 to 1800': {
        element: 'time_61875',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00024'
    },
    '1776 to 1800': {
        element: 'time_61875',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00024'
    },
    '19th century': {
        element: 'time_61900',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00015'
    },
    '1st quarter 19th century': {
        element: 'time_61907',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00016'
    },
    '1st quarter 19th century - 1801 to 1825': {
        element: 'time_61907',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00016'
    },
    '1801 to 1825': {
        element: 'time_61907',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00016'
    },
    '2nd quarter 19th century': {
        element: 'time_61925',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00017'
    },
    '2nd quarter 19th century - 1826 to 1850': {
        element: 'time_61925',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00017'
    },
    '1826 to 1850': {
        element: 'time_61925',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00017'
    },
    '3rd quarter 19th century': {
        element: 'time_61947',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00018'
    },
    '3rd quarter 19th century - 1851 to 1875': {
        element: 'time_61947',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00018'
    },
    '1851 to 1875': {
        element: 'time_61947',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00018'
    },
    '4th quarter 19th century': {
        element: 'time_61975',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00019'
    },
    '4th quarter 19th century - 1876 to 1900': {
        element: 'time_61975',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00019'
    },
    '1876 to 1900': {
        element: 'time_61975',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00019'
    },
    '20th century': {
        element: 'time_62000',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00004'
    },
    '1st decade 20th century': {
        element: 'time_62010',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00005'
    },
    '1st decade 20th century - 1901 to 1910': {
        element: 'time_62010',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00005'
    },
    '1901 to 1910': {
        element: 'time_62010',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00005'
    },
    '2nd decade 20th century': {
        element: 'time_62020',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00006'
    },
    '2nd decade 20th century - 1911 to 1920': {
        element: 'time_62020',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00006'
    },
    '1911 to 1920': {
        element: 'time_62020',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00006'
    },
    '3rd decade 20th century': {
        element: 'time_62030',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00007'
    },
    '3rd decade 20th century - 1921 to 1930': {
        element: 'time_62030',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00007'
    },
    '1921 to 1930': {
        element: 'time_62030',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00007'
    },
    '4th decade 20th century': {
        element: 'time_62040',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00008'
    },
    '4th decade 20th century - 1931 to 1940': {
        element: 'time_62040',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00008'
    },
    '1931 to 1940': {
        element: 'time_62040',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00008'
    },
    '5th decade 20th century': {
        element: 'time_62050',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00009'
    },
    '5th decade 20th century - 1941 to 1950': {
        element: 'time_62050',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00009'
    },
    '1941 to 1950': {
        element: 'time_62050',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00009'
    },
    '6th decade 20th century': {
        element: 'time_62060',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00010'
    },
    '6th decade 20th century - 1951 to 1960': {
        element: 'time_62060',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00010'
    },
    '1951 to 1960': {
        element: 'time_62060',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00010'
    },
    '7th decade 20th century': {
        element: 'time_62070',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00011'
    },
    '7th decade 20th century - 1961 to 1970': {
        element: 'time_62070',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00011'
    },
    '1961 to 1970': {
        element: 'time_62070',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00011'
    },
    '8th decade 20th century': {
        element: 'time_62080',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00012'
    },
    '8th decade 20th century - 1971 to 1980': {
        element: 'time_62080',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00012'
    },
    '1971 to 1980': {
        element: 'time_62080',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00012'
    },
    '9th decade 20th century': {
        element: 'time_62090',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00013'
    },
    '9th decade 20th century - 1981 to 1990': {
        element: 'time_62090',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00013'
    },
    '1981 to 1990': {
        element: 'time_62090',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00013'
    },
    '10th decade 20th century': {
        element: 'time_62095',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00014'
    },
    '10th decade 20th century - 1991 to 2000': {
        element: 'time_62095',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00014'
    },
    '1991 to 2000': {
        element: 'time_62095',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00014'
    },
    '21st century': {
        element: 'time_62100',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00001'
    },
    '1st decade 21st century': {
        element: 'time_62110',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00002'
    },
    '1st decade 21st century - 2001 to 2010': {
        element: 'time_62110',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00002'
    },
    '2001 to 2010': {
        element: 'time_62110',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00002'
    },
    '2nd decade 21st century': {
        element: 'time_62120',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00003'
    },
    '2nd decade 21st century - 2011 to 2020': {
        element: 'time_62120',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00003'
    },
    '2011 to 2020': {
        element: 'time_62120',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00003'
    },
    'Geologische Zeiträume': {
        element: 'time_10000',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00112'
    },
    'Präkambrium': {
        element: 'time_12000',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00109'
    },
    'Paläozoikum': {
        element: 'time_13000',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00108'
    },
    'Trias': {
        element: 'time_14000',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00107'
    },
    'Jura': {
        element: 'time_15000',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00106'
    },
    'Kreide': {
        element: 'time_16000',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00105'
    },
    'Tertiär': {
        element: 'time_17000',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00104'
    },
    'Quartär': {
        element: 'time_18000',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00103'
    },
    'Urgeschichtliche Zeiträume (vor Christus)': {
        element: 'time_30000',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00111'
    },
    '7. Jahrtausend vor Christus': {
        element: 'time_33000',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00102'
    },
    '6. Jahrtausend vor Christus': {
        element: 'time_34000',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00101'
    },
    '5. Jahrtausend vor Christus': {
        element: 'time_35000',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00100'
    },
    '4. Jahrtausend vor Christus': {
        element: 'time_36000',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00089'
    },
    '40. Jahrhundert vor Christus': {
        element: 'time_36100',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00090'
    },
    '39. Jahrhundert vor Christus': {
        element: 'time_36200',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00091'
    },
    '38. Jahrhundert vor Christus': {
        element: 'time_36300',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00092'
    },
    '37. Jahrhundert vor Christus': {
        element: 'time_36400',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00093'
    },
    '36. Jahrhundert vor Christus': {
        element: 'time_36500',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00094'
    },
    '35. Jahrhundert vor Christus': {
        element: 'time_36600',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00095'
    },
    '34. Jahrhundert vor Christus': {
        element: 'time_36700',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00096'
    },
    '33. Jahrhundert vor Christus': {
        element: 'time_36800',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00097'
    },
    '32. Jahrhundert vor Christus': {
        element: 'time_36900',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00098'
    },
    '31. Jahrhundert vor Christus': {
        element: 'time_36950',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00099'
    },
    '3. Jahrtausend vor Christus': {
        element: 'time_37000',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00078'
    },
    '30. Jahrhundert vor Christus': {
        element: 'time_37100',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00079'
    },
    '29. Jahrhundert vor Christus': {
        element: 'time_37200',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00080'
    },
    '28. Jahrhundert vor Christus': {
        element: 'time_37300',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00081'
    },
    '27. Jahrhundert vor Christus': {
        element: 'time_37400',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00082'
    },
    '26. Jahrhundert vor Christus': {
        element: 'time_37500',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00083'
    },
    '25. Jahrhundert vor Christus': {
        element: 'time_37600',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00084'
    },
    '24. Jahrhundert vor Christus': {
        element: 'time_37700',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00085'
    },
    '23. Jahrhundert vor Christus': {
        element: 'time_37800',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00086'
    },
    '22. Jahrhundert vor Christus': {
        element: 'time_37900',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00087'
    },
    '21. Jahrhundert vor Christus': {
        element: 'time_37950',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00088'
    },
    '2. Jahrtausend vor Christus': {
        element: 'time_38000',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00067'
    },
    '20. Jahrhundert vor Christus': {
        element: 'time_38100',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00068'
    },
    '19. Jahrhundert vor Christus': {
        element: 'time_38200',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00069'
    },
    '18. Jahrhundert vor Christus': {
        element: 'time_38300',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00070'
    },
    '17. Jahrhundert vor Christus': {
        element: 'time_38400',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00071'
    },
    '16. Jahrhundert vor Christus': {
        element: 'time_38500',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00072'
    },
    '15. Jahrhundert vor Christus': {
        element: 'time_38600',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00073'
    },
    '14. Jahrhundert vor Christus': {
        element: 'time_38700',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00074'
    },
    '13. Jahrhundert vor Christus': {
        element: 'time_38800',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00075'
    },
    '12. Jahrhundert vor Christus': {
        element: 'time_38900',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00076'
    },
    '11. Jahrhundert vor Christus': {
        element: 'time_38950',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00077'
    },
    '1. Jahrtausend vor Christus': {
        element: 'time_39000',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00056'
    },
    '10. Jahrhundert vor Christus': {
        element: 'time_39100',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00057'
    },
    '9. Jahrhundert vor Christus': {
        element: 'time_39200',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00066'
    },
    '8. Jahrhundert vor Christus': {
        element: 'time_39300',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00065'
    },
    '7. Jahrhundert vor Christus': {
        element: 'time_39400',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00064'
    },
    '6. Jahrhundert vor Christus': {
        element: 'time_39500',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00063'
    },
    '5. Jahrhundert vor Christus': {
        element: 'time_39600',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00062'
    },
    '4. Jahrhundert vor Christus': {
        element: 'time_39700',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00061'
    },
    '3. Jahrhundert vor Christus': {
        element: 'time_39800',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00060'
    },
    '2. Jahrhundert vor Christus': {
        element: 'time_39900',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00059'
    },
    '1. Jahrhundert vor Christus': {
        element: 'time_39950',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00058'
    },
    'Historische Zeiträume': {
        element: 'time_60000',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00110'
    },
    '1. Jahrhundert': {
        element: 'time_60100',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00055'
    },
    '2. Jahrhundert': {
        element: 'time_60200',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00054'
    },
    '3. Jahrhundert': {
        element: 'time_60300',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00053'
    },
    '4. Jahrhundert': {
        element: 'time_60400',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00052'
    },
    '5. Jahrhundert': {
        element: 'time_60500',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00051'
    },
    '6. Jahrhundert': {
        element: 'time_60600',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00050'
    },
    '7. Jahrhundert': {
        element: 'time_60700',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00049'
    },
    '8. Jahrhundert': {
        element: 'time_60800',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00048'
    },
    '9. Jahrhundert': {
        element: 'time_60900',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00047'
    },
    '10. Jahrhundert': {
        element: 'time_61000',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00046'
    },
    '11. Jahrhundert': {
        element: 'time_61100',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00043'
    },
    '1. Hälfte 11. Jahrhundert': {
        element: 'time_61105',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00044'
    },
    '1. Hälfte 11. Jahrhundert - 1001 bis 1050': {
        element: 'time_61105',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00044'
    },
    '1001 bis 1050': {
        element: 'time_61105',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00044'
    },
    '2. Hälfte 11. Jahrhundert': {
        element: 'time_61145',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00045'
    },
    '2. Hälfte 11. Jahrhundert - 1051 bis 1100': {
        element: 'time_61145',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00045'
    },
    '1051 bis 1100': {
        element: 'time_61145',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00045'
    },
    '12. Jahrhundert': {
        element: 'time_61200',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00040'
    },
    '1. Hälfte 12. Jahrhundert': {
        element: 'time_61205',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00041'
    },
    '1. Hälfte 12. Jahrhundert - 1101 bis 1150': {
        element: 'time_61205',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00041'
    },
    '1101 bis 1150': {
        element: 'time_61205',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00041'
    },
    '2. Hälfte 12. Jahrhundert': {
        element: 'time_61245',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00042'
    },
    '2. Hälfte 12. Jahrhundert - 1151 bis 1200': {
        element: 'time_61245',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00042'
    },
    '1151 bis 1200': {
        element: 'time_61245',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00042'
    },
    '13. Jahrhundert': {
        element: 'time_61300',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00037'
    },
    '1. Hälfte 13. Jahrhundert': {
        element: 'time_61305',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00038'
    },
    '1. Hälfte 13. Jahrhundert - 1201 bis 1250': {
        element: 'time_61305',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00038'
    },
    '1201 bis 1250': {
        element: 'time_61305',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00038'
    },
    '2. Hälfte 13. Jahrhundert': {
        element: 'time_61345',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00039'
    },
    '2. Hälfte 13. Jahrhundert - 1251 bis 1300': {
        element: 'time_61345',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00039'
    },
    '1251 bis 1300': {
        element: 'time_61345',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00039'
    },
    '14. Jahrhundert': {
        element: 'time_61400',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00034'
    },
    '1. Hälfte 14. Jahrhundert': {
        element: 'time_61405',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00035'
    },
    '1. Hälfte 14. Jahrhundert - 1301 bis 1350': {
        element: 'time_61405',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00035'
    },
    '1301 bis 1350': {
        element: 'time_61405',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00035'
    },
    '2. Hälfte 14. Jahrhundert': {
        element: 'time_61445',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00036'
    },
    '2. Hälfte 14. Jahrhundert - 1351 bis 1400': {
        element: 'time_61445',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00036'
    },
    '1351 bis 1400': {
        element: 'time_61445',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00036'
    },
    '15. Jahrhundert': {
        element: 'time_61500',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00031'
    },
    '1. Hälfte 15. Jahrhundert': {
        element: 'time_61505',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00032'
    },
    '1. Hälfte 15. Jahrhundert - 1401 bis 1450': {
        element: 'time_61505',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00032'
    },
    '1401 bis 1450': {
        element: 'time_61505',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00032'
    },
    '2. Hälfte 15. Jahrhundert': {
        element: 'time_61545',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00033'
    },
    '2. Hälfte 15. Jahrhundert - 1451 bis 1500': {
        element: 'time_61545',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00033'
    },
    '1451 bis 1500': {
        element: 'time_61545',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00033'
    },
    '16. Jahrhundert': {
        element: 'time_61600',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00028'
    },
    '1. Hälfte 16. Jahrhundert': {
        element: 'time_61605',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00029'
    },
    '1. Hälfte 16. Jahrhundert - 1501 bis 1550': {
        element: 'time_61605',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00029'
    },
    '1501 bis 1550': {
        element: 'time_61605',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00029'
    },
    '2. Hälfte 16. Jahrhundert': {
        element: 'time_61645',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00030'
    },
    '2. Hälfte 16. Jahrhundert - 1551 bis 1600': {
        element: 'time_61645',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00030'
    },
    '1551 bis 1600': {
        element: 'time_61645',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00030'
    },
    '17. Jahrhundert': {
        element: 'time_61700',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00025'
    },
    '1. Hälfte 17. Jahrhundert': {
        element: 'time_61705',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00026'
    },
    '1. Hälfte 17. Jahrhundert - 1601 bis 1650': {
        element: 'time_61705',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00026'
    },
    '1601 bis 1650': {
        element: 'time_61705',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00026'
    },
    '2. Hälfte 17. Jahrhundert': {
        element: 'time_61745',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00027'
    },
    '2. Hälfte 17. Jahrhundert - 1651 bis 1700': {
        element: 'time_61745',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00027'
    },
    '1651 bis 1700': {
        element: 'time_61745',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00027'
    },
    '18. Jahrhundert': {
        element: 'time_61800',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00020'
    },
    '1. Viertel 18. Jahrhundert': {
        element: 'time_61807',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00021'
    },
    '1. Viertel 18. Jahrhundert - 1701 bis 1725': {
        element: 'time_61807',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00021'
    },
    '1701 bis 1725': {
        element: 'time_61807',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00021'
    },
    '2. Viertel 18. Jahrhundert': {
        element: 'time_61825',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00022'
    },
    '2. Viertel 18. Jahrhundert - 1726 bis 1750': {
        element: 'time_61825',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00022'
    },
    '1726 bis 1750': {
        element: 'time_61825',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00022'
    },
    '3. Viertel 18. Jahrhundert': {
        element: 'time_61847',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00023'
    },
    '3. Viertel 18. Jahrhundert - 1751 bis 1775': {
        element: 'time_61847',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00023'
    },
    '1751 bis 1775': {
        element: 'time_61847',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00023'
    },
    '4. Viertel 18. Jahrhundert': {
        element: 'time_61875',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00024'
    },
    '4. Viertel 18. Jahrhundert - 1776 bis 1800': {
        element: 'time_61875',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00024'
    },
    '1776 bis 1800': {
        element: 'time_61875',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00024'
    },
    '19. Jahrhundert': {
        element: 'time_61900',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00015'
    },
    '1. Viertel 19. Jahrhundert': {
        element: 'time_61907',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00016'
    },
    '1. Viertel 19. Jahrhundert - 1801 bis 1825': {
        element: 'time_61907',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00016'
    },
    '1801 bis 1825': {
        element: 'time_61907',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00016'
    },
    '2. Viertel 19. Jahrhundert': {
        element: 'time_61925',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00017'
    },
    '2. Viertel 19. Jahrhundert - 1826 bis 1850': {
        element: 'time_61925',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00017'
    },
    '1826 bis 1850': {
        element: 'time_61925',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00017'
    },
    '3. Viertel 19. Jahrhundert': {
        element: 'time_61947',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00018'
    },
    '3. Viertel 19. Jahrhundert - 1851 bis 1875': {
        element: 'time_61947',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00018'
    },
    '1851 bis 1875': {
        element: 'time_61947',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00018'
    },
    '4. Viertel 19. Jahrhundert': {
        element: 'time_61975',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00019'
    },
    '4. Viertel 19. Jahrhundert - 1876 bis 1900': {
        element: 'time_61975',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00019'
    },
    '1876 bis 1900': {
        element: 'time_61975',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00019'
    },
    '20. Jahrhundert': {
        element: 'time_62000',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00004'
    },
    '1. Dekade 20. Jahrhundert': {
        element: 'time_62010',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00005'
    },
    '1. Dekade 20. Jahrhundert - 1901 bis 1910': {
        element: 'time_62010',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00005'
    },
    '1901 bis 1910': {
        element: 'time_62010',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00005'
    },
    '2. Dekade 20. Jahrhundert': {
        element: 'time_62020',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00006'
    },
    '2. Dekade 20. Jahrhundert - 1911 bis 1920': {
        element: 'time_62020',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00006'
    },
    '1911 bis 1920': {
        element: 'time_62020',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00006'
    },
    '3. Dekade 20. Jahrhundert': {
        element: 'time_62030',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00007'
    },
    '3. Dekade 20. Jahrhundert - 1921 bis 1930': {
        element: 'time_62030',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00007'
    },
    '1921 bis 1930': {
        element: 'time_62030',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00007'
    },
    '4. Dekade 20. Jahrhundert': {
        element: 'time_62040',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00008'
    },
    '4. Dekade 20. Jahrhundert - 1931 bis 1940': {
        element: 'time_62040',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00008'
    },
    '1931 bis 1940': {
        element: 'time_62040',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00008'
    },
    '5. Dekade 20. Jahrhundert': {
        element: 'time_62050',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00009'
    },
    '5. Dekade 20. Jahrhundert - 1941 bis 1950': {
        element: 'time_62050',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00009'
    },
    '1941 bis 1950': {
        element: 'time_62050',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00009'
    },
    '6. Dekade 20. Jahrhundert': {
        element: 'time_62060',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00010'
    },
    '6. Dekade 20. Jahrhundert - 1951 bis 1960': {
        element: 'time_62060',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00010'
    },
    '1951 bis 1960': {
        element: 'time_62060',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00010'
    },
    '7. Dekade 20. Jahrhundert': {
        element: 'time_62070',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00011'
    },
    '7. Dekade 20. Jahrhundert - 1961 bis 1970': {
        element: 'time_62070',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00011'
    },
    '1961 bis 1970': {
        element: 'time_62070',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00011'
    },
    '8. Dekade 20. Jahrhundert': {
        element: 'time_62080',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00012'
    },
    '8. Dekade 20. Jahrhundert - 1971 bis 1980': {
        element: 'time_62080',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00012'
    },
    '1971 bis 1980': {
        element: 'time_62080',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00012'
    },
    '9. Dekade 20. Jahrhundert': {
        element: 'time_62090',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00013'
    },
    '9. Dekade 20. Jahrhundert - 1981 bis 1990': {
        element: 'time_62090',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00013'
    },
    '1981 bis 1990': {
        element: 'time_62090',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00013'
    },
    '10. Dekade 20. Jahrhundert': {
        element: 'time_62095',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00014'
    },
    '10. Dekade 20. Jahrhundert - 1991 bis 2000': {
        element: 'time_62095',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00014'
    },
    '1991 bis 2000': {
        element: 'time_62095',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00014'
    },
    '21. Jahrhundert': {
        element: 'time_62100',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00001'
    },
    '1. Dekade 21. Jahrhundert': {
        element: 'time_62110',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00002'
    },
    '1. Dekade 21. Jahrhundert - 2001 bis 2010': {
        element: 'time_62110',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00002'
    },
    '2001 bis 2010': {
        element: 'time_62110',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00002'
    },
    '2. Dekade 21. Jahrhundert': {
        element: 'time_62120',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00003'
    },
    '2. Dekade 21. Jahrhundert - 2011 bis 2020': {
        element: 'time_62120',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00003'
    },
    '2011 bis 2020': {
        element: 'time_62120',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/zeitvokabular/dat00003'
    }
};

},{}],22:[function(require,module,exports){
/**
 * serach
 *
 * The method search is providing an interface to the search engine of the DDB. This method provides response
 * data only as application/json. It is a read-only service and must be accessed with a HTTP-GET-request.
 *
 *     GET /search?<QueryParameters> HTTP/1.1
 *
 * The resulting JSON object is made up of several parts. Each part will be described separately. The described
 * parts are properties of the search result object and can be joined to form a complete result object.
 *
 * @param {Number}   numberOfResults   First the number of results is in the property `numberOfResults`. This gives the total number of found results independent of the rows returned.
 * @param {Number}   highlightedTerms  Another part is the hightlightedTerms. This contains an array of all terms that should be highlighted. In the preview they are already highlighted. But this array can be transferred to the detail view where the terms could be highlighted as well.
 * @param {String}   randomSeed        If the random sorting is activated this property will contain a value that can be used as subsequent sort-parameter. The value should be used as is. If the random sorting is deactivated or the query was not a get-all-objects-query (* or *:*) the property will be empty.
 * @param {String}   correctedQuery    If the query is mistyped, i.e. there are more hits for an alternative spelling of one of the query terms a corrected query will be returned with the search result. This property `correctedQuery` contains the entered query with all terms corrected.
 * @param {Object[]} facets            One lengthier part are the facets and their values. Each facet defined to have a displayType of SEARCH will always be returned with the search results.
 * @param {Number}   numberOfFacets    The numberOfFacets is the number of distinct facet values found for this facet. If the facet.limit parameter is set in the query the number of facets will be equal to this number. The facetValues array will contain all found values and the number of documents having this facet if this facet is asked for.
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 *
 */

var request = require('./utils/request');

var Search = function(ctx, query) {

    Search.query = encodeURIComponent(query);
    Search.ctx = ctx;
    Search.facets = [];

    return Search;

};

Search.affiliate = require('./facets/affiliate');
Search.place = require('./facets/place');
Search.role = require('./facets/role');
Search.keywords = require('./facets/keywords');
Search.language = require('./facets/language');
Search.type = require('./facets/type');
Search.sector = require('./facets/sector');
Search.time = require('./facets/time');
Search.provider = require('./facets/provider');
Search.license = require('./facets/license');
Search.licenseGroup = require('./facets/licenseGroup');
Search.get = require('./facets/get')('search');

var SearchMethod = function(ctx) {
    SearchMethod.ctx = ctx;
    return SearchMethod;
};

/**
 * The method facets of search returns all available facets or all available facets of a specific type.
 * This method provides response data only as application/json. It is a read-only service and must be
 * accessed with a HTTP-GET-request.
 *
 *     GET /search/facets?<QueryParameters> HTTP/1.1
 *
 * @param {String} type Type of the returned facets, which can be EXTENDED, SEARCH, TECHNICAL
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/facets
 *
 */
SearchMethod.facets = function(type) {

    if (typeof type !== 'string') {
        throw new Error('facet type should be type of string');
    }

    type = type.toUpperCase();

    if (type && type !== 'EXTENDED' && type !== 'SEARCH' && type !== 'TECHNICAL') {
        throw new Error('facets method query should contain one of the following terms: EXTENDED, SEARCH, TECHNICAL');
    }

    var query = type ? '?query=' + type : '';
    var uri = 'search/facets' + query;

    return request.call(this.ctx, uri, {
        json: true
    });

};

/**
 * The method sortcriteria of search returns the available sort criteria and the default criterion of the
 * search result sets. This method provides response data only as application/json. It is a read-only service
 * and must be accessed with a HTTP-GET-request.
 *
 *     GET /search/sortcriteria HTTP/1.1
 *
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/sortcriteria
 *
 */
SearchMethod.sortcriteria = function() {

    if (arguments.length) {
        throw new Error('method `binaries` doesn\'t take any arguments');
    }

    return request.call(this.ctx, 'search/sortcriteria', {
        json: true
    });
};

/**
 * The method suggest of search returns suggestions for a given query. This method provides response data
 * only as application/json. It is a read-only service and must be accessed with a HTTP-GET-request.
 *
 *     GET /search/suggest?<QueryParameters> HTTP/1.1
 *
 * @param {String} query Query term(s) to be completed/suggested.
 * @see  https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/suggest
 *
 */
SearchMethod.suggest = function(query) {

    if (!query || typeof query !== 'string') {
        throw new Error('suggest method requires a query from type string');
    }

    var uri = 'search/suggest?query=' + query;
    return request.call(this.ctx, uri, {
        json: true
    });

};

/**
 * Expose methods
 */
module.exports = function(query) {

    /**
     * if query is given return search API
     */
    if (typeof query === 'string') {
        return Search(this, query);
    }

    /**
     * otherwise expose search methods
     */
    return SearchMethod(this);

};
},{"./facets/affiliate":4,"./facets/get":5,"./facets/keywords":6,"./facets/language":7,"./facets/license":8,"./facets/licenseGroup":9,"./facets/place":10,"./facets/provider":11,"./facets/role":12,"./facets/sector":13,"./facets/time":14,"./facets/type":15,"./utils/request":24}],23:[function(require,module,exports){
/**
 * error handler to create custome errors
 */

var util = require('util');

function ErrorHandler(type, msg) {
    Error.call(this);

    this.message = msg;
    this.name = type;
}

util.inherits(ErrorHandler, Error);

/**
 * make stack loggable
 * @return {Object} error log
 */
ErrorHandler.prototype.toJSON = function() {
    return {
        name: this.name,
        message: this.message
    };
};

/**
 * expose ErrorHandler
 */
module.exports = ErrorHandler;
},{"util":70}],24:[function(require,module,exports){
(function (process){
/**
 * request helper
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 *
 */

var Q = require('q'),
    fs = require('fs'),
    ErrorHandler = require('./error'),
    merge = require('deepmerge'),
    request = require('request');

module.exports = function(path, opts, outputFile) {

    /* istanbul ignore if */
    if(!this.protocol || !this.host) {
        return Q.resolve;
    }

    var deferred = Q.defer(),
        url = this.protocol + '://' + this.host + '/' + path,
        params;

    /**
     * use oauth in node env
     */
    /* istanbul ignore else */
    if(typeof window === 'undefined') {
        params = merge({ url: url, oauth: this.oauth }, opts || {});
    } else {
        url += (path.indexOf('?') > -1 ? '&' : '?') + 'oauth_consumer_key=' + this.token;
        params = merge({ url: url, withCredentials: false }, opts || {});
    }

    /**
     * debug in test mode
     */
    if(true || process.env.TRAVIS_BUILD_ID) {
        console.log(url);
    }

    var r = request.get(params, function(err, httpResponse, body) {

        /* istanbul ignore if */
        if (err) {
            return deferred.reject(err);
        }

        if (typeof body === 'string' && body.indexOf('not found') > -1) {
            err = JSON.parse(body);

            /**
             * remove outputFile
             *
             * Problem: if a file doesn't exists we won't get an 404 error but instead a 200 with an error
             * body like 'ItemNotFoundException: path/to/file.jpg not found', this would be piped into the
             * file
             */
            if(outputFile) {
                return fs.unlink(outputFile, deferred.reject.bind(deferred, new ErrorHandler(err.name, err.message)));
            }

            return deferred.reject(new ErrorHandler(err.name, err.message));
        }

        deferred.resolve(body);

    });

    if(outputFile) {
        r.pipe(fs.createWriteStream(outputFile));
    }

    return deferred.promise;

};
}).call(this,require("FWaASH"))
},{"./error":23,"FWaASH":49,"deepmerge":71,"fs":25,"q":77,"request":80}],25:[function(require,module,exports){

},{}],26:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":28}],27:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],28:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require("FWaASH"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":27,"FWaASH":49,"inherits":47}],29:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  if (encoding === 'base64' && type === 'string') {
    subject = base64clean(subject)
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    if (Buffer.isBuffer(subject)) {
      for (i = 0; i < length; i++)
        buf[i] = subject.readUInt8(i)
    } else {
      for (i = 0; i < length; i++)
        buf[i] = ((subject[i] % 256) + 256) % 256
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str.toString()
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list[, length])')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (totalLength === undefined) {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

Buffer.compare = function (a, b) {
  assert(Buffer.isBuffer(a) && Buffer.isBuffer(b), 'Arguments must be Buffers')
  var x = a.length
  var y = b.length
  for (var i = 0, len = Math.min(x, y); i < len && a[i] === b[i]; i++) {}
  if (i !== len) {
    x = a[i]
    y = b[i]
  }
  if (x < y) {
    return -1
  }
  if (y < x) {
    return 1
  }
  return 0
}

// BUFFER INSTANCE METHODS
// =======================

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function asciiWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function utf16leWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end === undefined) ? self.length : Number(end)

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = asciiSlice(self, start, end)
      break
    case 'binary':
      ret = binarySlice(self, start, end)
      break
    case 'base64':
      ret = base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

Buffer.prototype.equals = function (b) {
  assert(Buffer.isBuffer(b), 'Argument must be a Buffer')
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.compare = function (b) {
  assert(Buffer.isBuffer(b), 'Argument must be a Buffer')
  return Buffer.compare(this, b)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++) {
      target[i + target_start] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function binarySlice (buf, start, end) {
  return asciiSlice(buf, start, end)
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return readUInt16(this, offset, false, noAssert)
}

function readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return readInt16(this, offset, false, noAssert)
}

function readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return readInt32(this, offset, false, noAssert)
}

function readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return readFloat(this, offset, false, noAssert)
}

function readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
  return offset + 1
}

function writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
  return offset + 2
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  return writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  return writeUInt16(this, value, offset, false, noAssert)
}

function writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
  return offset + 4
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  return writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  return writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
  return offset + 1
}

function writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
  return offset + 2
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  return writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  return writeInt16(this, value, offset, false, noAssert)
}

function writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
  return offset + 4
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  return writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  return writeInt32(this, value, offset, false, noAssert)
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-z]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F) {
      byteArray.push(b)
    } else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++) {
        byteArray.push(parseInt(h[j], 16))
      }
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

},{"base64-js":30,"ieee754":31}],30:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS)
			return 62 // '+'
		if (code === SLASH)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],31:[function(require,module,exports){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],32:[function(require,module,exports){
(function (Buffer){
var createHash = require('sha.js')

var md5 = toConstructor(require('./md5'))
var rmd160 = toConstructor(require('ripemd160'))

function toConstructor (fn) {
  return function () {
    var buffers = []
    var m= {
      update: function (data, enc) {
        if(!Buffer.isBuffer(data)) data = new Buffer(data, enc)
        buffers.push(data)
        return this
      },
      digest: function (enc) {
        var buf = Buffer.concat(buffers)
        var r = fn(buf)
        buffers = null
        return enc ? r.toString(enc) : r
      }
    }
    return m
  }
}

module.exports = function (alg) {
  if('md5' === alg) return new md5()
  if('rmd160' === alg) return new rmd160()
  return createHash(alg)
}

}).call(this,require("buffer").Buffer)
},{"./md5":36,"buffer":29,"ripemd160":37,"sha.js":39}],33:[function(require,module,exports){
(function (Buffer){
var createHash = require('./create-hash')

var blocksize = 64
var zeroBuffer = new Buffer(blocksize); zeroBuffer.fill(0)

module.exports = Hmac

function Hmac (alg, key) {
  if(!(this instanceof Hmac)) return new Hmac(alg, key)
  this._opad = opad
  this._alg = alg

  key = this._key = !Buffer.isBuffer(key) ? new Buffer(key) : key

  if(key.length > blocksize) {
    key = createHash(alg).update(key).digest()
  } else if(key.length < blocksize) {
    key = Buffer.concat([key, zeroBuffer], blocksize)
  }

  var ipad = this._ipad = new Buffer(blocksize)
  var opad = this._opad = new Buffer(blocksize)

  for(var i = 0; i < blocksize; i++) {
    ipad[i] = key[i] ^ 0x36
    opad[i] = key[i] ^ 0x5C
  }

  this._hash = createHash(alg).update(ipad)
}

Hmac.prototype.update = function (data, enc) {
  this._hash.update(data, enc)
  return this
}

Hmac.prototype.digest = function (enc) {
  var h = this._hash.digest()
  return createHash(this._alg).update(this._opad).update(h).digest(enc)
}


}).call(this,require("buffer").Buffer)
},{"./create-hash":32,"buffer":29}],34:[function(require,module,exports){
(function (Buffer){
var intSize = 4;
var zeroBuffer = new Buffer(intSize); zeroBuffer.fill(0);
var chrsz = 8;

function toArray(buf, bigEndian) {
  if ((buf.length % intSize) !== 0) {
    var len = buf.length + (intSize - (buf.length % intSize));
    buf = Buffer.concat([buf, zeroBuffer], len);
  }

  var arr = [];
  var fn = bigEndian ? buf.readInt32BE : buf.readInt32LE;
  for (var i = 0; i < buf.length; i += intSize) {
    arr.push(fn.call(buf, i));
  }
  return arr;
}

function toBuffer(arr, size, bigEndian) {
  var buf = new Buffer(size);
  var fn = bigEndian ? buf.writeInt32BE : buf.writeInt32LE;
  for (var i = 0; i < arr.length; i++) {
    fn.call(buf, arr[i], i * 4, true);
  }
  return buf;
}

function hash(buf, fn, hashSize, bigEndian) {
  if (!Buffer.isBuffer(buf)) buf = new Buffer(buf);
  var arr = fn(toArray(buf, bigEndian), buf.length * chrsz);
  return toBuffer(arr, hashSize, bigEndian);
}

module.exports = { hash: hash };

}).call(this,require("buffer").Buffer)
},{"buffer":29}],35:[function(require,module,exports){
(function (Buffer){
var rng = require('./rng')

function error () {
  var m = [].slice.call(arguments).join(' ')
  throw new Error([
    m,
    'we accept pull requests',
    'http://github.com/dominictarr/crypto-browserify'
    ].join('\n'))
}

exports.createHash = require('./create-hash')

exports.createHmac = require('./create-hmac')

exports.randomBytes = function(size, callback) {
  if (callback && callback.call) {
    try {
      callback.call(this, undefined, new Buffer(rng(size)))
    } catch (err) { callback(err) }
  } else {
    return new Buffer(rng(size))
  }
}

function each(a, f) {
  for(var i in a)
    f(a[i], i)
}

exports.getHashes = function () {
  return ['sha1', 'sha256', 'md5', 'rmd160']

}

var p = require('./pbkdf2')(exports.createHmac)
exports.pbkdf2 = p.pbkdf2
exports.pbkdf2Sync = p.pbkdf2Sync


// the least I can do is make error messages for the rest of the node.js/crypto api.
each(['createCredentials'
, 'createCipher'
, 'createCipheriv'
, 'createDecipher'
, 'createDecipheriv'
, 'createSign'
, 'createVerify'
, 'createDiffieHellman'
], function (name) {
  exports[name] = function () {
    error('sorry,', name, 'is not implemented yet')
  }
})

}).call(this,require("buffer").Buffer)
},{"./create-hash":32,"./create-hmac":33,"./pbkdf2":43,"./rng":44,"buffer":29}],36:[function(require,module,exports){
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

var helpers = require('./helpers');

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

module.exports = function md5(buf) {
  return helpers.hash(buf, core_md5, 16);
};

},{"./helpers":34}],37:[function(require,module,exports){
(function (Buffer){

module.exports = ripemd160



/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
/** @preserve
(c) 2012 by Cédric Mesnil. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// Constants table
var zl = [
    0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
    7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
    3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
    1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
    4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13];
var zr = [
    5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
    6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
    15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
    8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
    12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11];
var sl = [
     11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
    7, 6,   8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
    11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
      11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
    9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6 ];
var sr = [
    8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
    9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
    9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
    15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
    8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11 ];

var hl =  [ 0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E];
var hr =  [ 0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000];

var bytesToWords = function (bytes) {
  var words = [];
  for (var i = 0, b = 0; i < bytes.length; i++, b += 8) {
    words[b >>> 5] |= bytes[i] << (24 - b % 32);
  }
  return words;
};

var wordsToBytes = function (words) {
  var bytes = [];
  for (var b = 0; b < words.length * 32; b += 8) {
    bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
  }
  return bytes;
};

var processBlock = function (H, M, offset) {

  // Swap endian
  for (var i = 0; i < 16; i++) {
    var offset_i = offset + i;
    var M_offset_i = M[offset_i];

    // Swap
    M[offset_i] = (
        (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
        (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
    );
  }

  // Working variables
  var al, bl, cl, dl, el;
  var ar, br, cr, dr, er;

  ar = al = H[0];
  br = bl = H[1];
  cr = cl = H[2];
  dr = dl = H[3];
  er = el = H[4];
  // Computation
  var t;
  for (var i = 0; i < 80; i += 1) {
    t = (al +  M[offset+zl[i]])|0;
    if (i<16){
        t +=  f1(bl,cl,dl) + hl[0];
    } else if (i<32) {
        t +=  f2(bl,cl,dl) + hl[1];
    } else if (i<48) {
        t +=  f3(bl,cl,dl) + hl[2];
    } else if (i<64) {
        t +=  f4(bl,cl,dl) + hl[3];
    } else {// if (i<80) {
        t +=  f5(bl,cl,dl) + hl[4];
    }
    t = t|0;
    t =  rotl(t,sl[i]);
    t = (t+el)|0;
    al = el;
    el = dl;
    dl = rotl(cl, 10);
    cl = bl;
    bl = t;

    t = (ar + M[offset+zr[i]])|0;
    if (i<16){
        t +=  f5(br,cr,dr) + hr[0];
    } else if (i<32) {
        t +=  f4(br,cr,dr) + hr[1];
    } else if (i<48) {
        t +=  f3(br,cr,dr) + hr[2];
    } else if (i<64) {
        t +=  f2(br,cr,dr) + hr[3];
    } else {// if (i<80) {
        t +=  f1(br,cr,dr) + hr[4];
    }
    t = t|0;
    t =  rotl(t,sr[i]) ;
    t = (t+er)|0;
    ar = er;
    er = dr;
    dr = rotl(cr, 10);
    cr = br;
    br = t;
  }
  // Intermediate hash value
  t    = (H[1] + cl + dr)|0;
  H[1] = (H[2] + dl + er)|0;
  H[2] = (H[3] + el + ar)|0;
  H[3] = (H[4] + al + br)|0;
  H[4] = (H[0] + bl + cr)|0;
  H[0] =  t;
};

function f1(x, y, z) {
  return ((x) ^ (y) ^ (z));
}

function f2(x, y, z) {
  return (((x)&(y)) | ((~x)&(z)));
}

function f3(x, y, z) {
  return (((x) | (~(y))) ^ (z));
}

function f4(x, y, z) {
  return (((x) & (z)) | ((y)&(~(z))));
}

function f5(x, y, z) {
  return ((x) ^ ((y) |(~(z))));
}

function rotl(x,n) {
  return (x<<n) | (x>>>(32-n));
}

function ripemd160(message) {
  var H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];

  if (typeof message == 'string')
    message = new Buffer(message, 'utf8');

  var m = bytesToWords(message);

  var nBitsLeft = message.length * 8;
  var nBitsTotal = message.length * 8;

  // Add padding
  m[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
  m[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
      (((nBitsTotal << 8)  | (nBitsTotal >>> 24)) & 0x00ff00ff) |
      (((nBitsTotal << 24) | (nBitsTotal >>> 8))  & 0xff00ff00)
  );

  for (var i=0 ; i<m.length; i += 16) {
    processBlock(H, m, i);
  }

  // Swap endian
  for (var i = 0; i < 5; i++) {
      // Shortcut
    var H_i = H[i];

    // Swap
    H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
          (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
  }

  var digestbytes = wordsToBytes(H);
  return new Buffer(digestbytes);
}



}).call(this,require("buffer").Buffer)
},{"buffer":29}],38:[function(require,module,exports){
var u = require('./util')
var write = u.write
var fill = u.zeroFill

module.exports = function (Buffer) {

  //prototype class for hash functions
  function Hash (blockSize, finalSize) {
    this._block = new Buffer(blockSize) //new Uint32Array(blockSize/4)
    this._finalSize = finalSize
    this._blockSize = blockSize
    this._len = 0
    this._s = 0
  }

  Hash.prototype.init = function () {
    this._s = 0
    this._len = 0
  }

  function lengthOf(data, enc) {
    if(enc == null)     return data.byteLength || data.length
    if(enc == 'ascii' || enc == 'binary')  return data.length
    if(enc == 'hex')    return data.length/2
    if(enc == 'base64') return data.length/3
  }

  Hash.prototype.update = function (data, enc) {
    var bl = this._blockSize

    //I'd rather do this with a streaming encoder, like the opposite of
    //http://nodejs.org/api/string_decoder.html
    var length
      if(!enc && 'string' === typeof data)
        enc = 'utf8'

    if(enc) {
      if(enc === 'utf-8')
        enc = 'utf8'

      if(enc === 'base64' || enc === 'utf8')
        data = new Buffer(data, enc), enc = null

      length = lengthOf(data, enc)
    } else
      length = data.byteLength || data.length

    var l = this._len += length
    var s = this._s = (this._s || 0)
    var f = 0
    var buffer = this._block
    while(s < l) {
      var t = Math.min(length, f + bl)
      write(buffer, data, enc, s%bl, f, t)
      var ch = (t - f);
      s += ch; f += ch

      if(!(s%bl))
        this._update(buffer)
    }
    this._s = s

    return this

  }

  Hash.prototype.digest = function (enc) {
    var bl = this._blockSize
    var fl = this._finalSize
    var len = this._len*8

    var x = this._block

    var bits = len % (bl*8)

    //add end marker, so that appending 0's creats a different hash.
    x[this._len % bl] = 0x80
    fill(this._block, this._len % bl + 1)

    if(bits >= fl*8) {
      this._update(this._block)
      u.zeroFill(this._block, 0)
    }

    //TODO: handle case where the bit length is > Math.pow(2, 29)
    x.writeInt32BE(len, fl + 4) //big endian

    var hash = this._update(this._block) || this._hash()
    if(enc == null) return hash
    return hash.toString(enc)
  }

  Hash.prototype._update = function () {
    throw new Error('_update must be implemented by subclass')
  }

  return Hash
}

},{"./util":42}],39:[function(require,module,exports){
var exports = module.exports = function (alg) {
  var Alg = exports[alg]
  if(!Alg) throw new Error(alg + ' is not supported (we accept pull requests)')
  return new Alg()
}

var Buffer = require('buffer').Buffer
var Hash   = require('./hash')(Buffer)

exports.sha =
exports.sha1 = require('./sha1')(Buffer, Hash)
exports.sha256 = require('./sha256')(Buffer, Hash)

},{"./hash":38,"./sha1":40,"./sha256":41,"buffer":29}],40:[function(require,module,exports){
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */
module.exports = function (Buffer, Hash) {

  var inherits = require('util').inherits

  inherits(Sha1, Hash)

  var A = 0|0
  var B = 4|0
  var C = 8|0
  var D = 12|0
  var E = 16|0

  var BE = false
  var LE = true

  var W = new Int32Array(80)

  var POOL = []

  function Sha1 () {
    if(POOL.length)
      return POOL.pop().init()

    if(!(this instanceof Sha1)) return new Sha1()
    this._w = W
    Hash.call(this, 16*4, 14*4)
  
    this._h = null
    this.init()
  }

  Sha1.prototype.init = function () {
    this._a = 0x67452301
    this._b = 0xefcdab89
    this._c = 0x98badcfe
    this._d = 0x10325476
    this._e = 0xc3d2e1f0

    Hash.prototype.init.call(this)
    return this
  }

  Sha1.prototype._POOL = POOL

  // assume that array is a Uint32Array with length=16,
  // and that if it is the last block, it already has the length and the 1 bit appended.


  var isDV = new Buffer(1) instanceof DataView
  function readInt32BE (X, i) {
    return isDV
      ? X.getInt32(i, false)
      : X.readInt32BE(i)
  }

  Sha1.prototype._update = function (array) {

    var X = this._block
    var h = this._h
    var a, b, c, d, e, _a, _b, _c, _d, _e

    a = _a = this._a
    b = _b = this._b
    c = _c = this._c
    d = _d = this._d
    e = _e = this._e

    var w = this._w

    for(var j = 0; j < 80; j++) {
      var W = w[j]
        = j < 16
        //? X.getInt32(j*4, false)
        //? readInt32BE(X, j*4) //*/ X.readInt32BE(j*4) //*/
        ? X.readInt32BE(j*4)
        : rol(w[j - 3] ^ w[j -  8] ^ w[j - 14] ^ w[j - 16], 1)

      var t =
        add(
          add(rol(a, 5), sha1_ft(j, b, c, d)),
          add(add(e, W), sha1_kt(j))
        );

      e = d
      d = c
      c = rol(b, 30)
      b = a
      a = t
    }

    this._a = add(a, _a)
    this._b = add(b, _b)
    this._c = add(c, _c)
    this._d = add(d, _d)
    this._e = add(e, _e)
  }

  Sha1.prototype._hash = function () {
    if(POOL.length < 100) POOL.push(this)
    var H = new Buffer(20)
    //console.log(this._a|0, this._b|0, this._c|0, this._d|0, this._e|0)
    H.writeInt32BE(this._a|0, A)
    H.writeInt32BE(this._b|0, B)
    H.writeInt32BE(this._c|0, C)
    H.writeInt32BE(this._d|0, D)
    H.writeInt32BE(this._e|0, E)
    return H
  }

  /*
   * Perform the appropriate triplet combination function for the current
   * iteration
   */
  function sha1_ft(t, b, c, d) {
    if(t < 20) return (b & c) | ((~b) & d);
    if(t < 40) return b ^ c ^ d;
    if(t < 60) return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
  }

  /*
   * Determine the appropriate additive constant for the current iteration
   */
  function sha1_kt(t) {
    return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
           (t < 60) ? -1894007588 : -899497514;
  }

  /*
   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
   * to work around bugs in some JS interpreters.
   * //dominictarr: this is 10 years old, so maybe this can be dropped?)
   *
   */
  function add(x, y) {
    return (x + y ) | 0
  //lets see how this goes on testling.
  //  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  //  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  //  return (msw << 16) | (lsw & 0xFFFF);
  }

  /*
   * Bitwise rotate a 32-bit number to the left.
   */
  function rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  return Sha1
}

},{"util":70}],41:[function(require,module,exports){

/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 */

var inherits = require('util').inherits
var BE       = false
var LE       = true
var u        = require('./util')

module.exports = function (Buffer, Hash) {

  var K = [
      0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
      0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
      0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
      0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
      0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
      0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
      0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
      0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
      0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
      0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
      0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
      0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
      0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
      0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
      0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
      0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
    ]

  inherits(Sha256, Hash)
  var W = new Array(64)
  var POOL = []
  function Sha256() {
    if(POOL.length) {
      //return POOL.shift().init()
    }
    //this._data = new Buffer(32)

    this.init()

    this._w = W //new Array(64)

    Hash.call(this, 16*4, 14*4)
  };

  Sha256.prototype.init = function () {

    this._a = 0x6a09e667|0
    this._b = 0xbb67ae85|0
    this._c = 0x3c6ef372|0
    this._d = 0xa54ff53a|0
    this._e = 0x510e527f|0
    this._f = 0x9b05688c|0
    this._g = 0x1f83d9ab|0
    this._h = 0x5be0cd19|0

    this._len = this._s = 0

    return this
  }

  var safe_add = function(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  function S (X, n) {
    return (X >>> n) | (X << (32 - n));
  }

  function R (X, n) {
    return (X >>> n);
  }

  function Ch (x, y, z) {
    return ((x & y) ^ ((~x) & z));
  }

  function Maj (x, y, z) {
    return ((x & y) ^ (x & z) ^ (y & z));
  }

  function Sigma0256 (x) {
    return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
  }

  function Sigma1256 (x) {
    return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
  }

  function Gamma0256 (x) {
    return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
  }

  function Gamma1256 (x) {
    return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
  }

  Sha256.prototype._update = function(m) {
    var M = this._block
    var W = this._w
    var a, b, c, d, e, f, g, h
    var T1, T2

    a = this._a | 0
    b = this._b | 0
    c = this._c | 0
    d = this._d | 0
    e = this._e | 0
    f = this._f | 0
    g = this._g | 0
    h = this._h | 0

    for (var j = 0; j < 64; j++) {
      var w = W[j] = j < 16
        ? M.readInt32BE(j * 4)
        : Gamma1256(W[j - 2]) + W[j - 7] + Gamma0256(W[j - 15]) + W[j - 16]

      T1 = h + Sigma1256(e) + Ch(e, f, g) + K[j] + w

      T2 = Sigma0256(a) + Maj(a, b, c);
      h = g; g = f; f = e; e = d + T1; d = c; c = b; b = a; a = T1 + T2;
    }

    this._a = (a + this._a) | 0
    this._b = (b + this._b) | 0
    this._c = (c + this._c) | 0
    this._d = (d + this._d) | 0
    this._e = (e + this._e) | 0
    this._f = (f + this._f) | 0
    this._g = (g + this._g) | 0
    this._h = (h + this._h) | 0

  };

  Sha256.prototype._hash = function () {
    if(POOL.length < 10)
      POOL.push(this)

    var H = new Buffer(32)

    H.writeInt32BE(this._a,  0)
    H.writeInt32BE(this._b,  4)
    H.writeInt32BE(this._c,  8)
    H.writeInt32BE(this._d, 12)
    H.writeInt32BE(this._e, 16)
    H.writeInt32BE(this._f, 20)
    H.writeInt32BE(this._g, 24)
    H.writeInt32BE(this._h, 28)

    return H
  }

  return Sha256

}

},{"./util":42,"util":70}],42:[function(require,module,exports){
exports.write = write
exports.zeroFill = zeroFill

exports.toString = toString

function write (buffer, string, enc, start, from, to, LE) {
  var l = (to - from)
  if(enc === 'ascii' || enc === 'binary') {
    for( var i = 0; i < l; i++) {
      buffer[start + i] = string.charCodeAt(i + from)
    }
  }
  else if(enc == null) {
    for( var i = 0; i < l; i++) {
      buffer[start + i] = string[i + from]
    }
  }
  else if(enc === 'hex') {
    for(var i = 0; i < l; i++) {
      var j = from + i
      buffer[start + i] = parseInt(string[j*2] + string[(j*2)+1], 16)
    }
  }
  else if(enc === 'base64') {
    throw new Error('base64 encoding not yet supported')
  }
  else
    throw new Error(enc +' encoding not yet supported')
}

//always fill to the end!
function zeroFill(buf, from) {
  for(var i = from; i < buf.length; i++)
    buf[i] = 0
}


},{}],43:[function(require,module,exports){
(function (Buffer){
// JavaScript PBKDF2 Implementation
// Based on http://git.io/qsv2zw
// Licensed under LGPL v3
// Copyright (c) 2013 jduncanator

var blocksize = 64
var zeroBuffer = new Buffer(blocksize); zeroBuffer.fill(0)

module.exports = function (createHmac, exports) {
  exports = exports || {}

  exports.pbkdf2 = function(password, salt, iterations, keylen, cb) {
    if('function' !== typeof cb)
      throw new Error('No callback provided to pbkdf2');
    setTimeout(function () {
      cb(null, exports.pbkdf2Sync(password, salt, iterations, keylen))
    })
  }

  exports.pbkdf2Sync = function(key, salt, iterations, keylen) {
    if('number' !== typeof iterations)
      throw new TypeError('Iterations not a number')
    if(iterations < 0)
      throw new TypeError('Bad iterations')
    if('number' !== typeof keylen)
      throw new TypeError('Key length not a number')
    if(keylen < 0)
      throw new TypeError('Bad key length')

    //stretch key to the correct length that hmac wants it,
    //otherwise this will happen every time hmac is called
    //twice per iteration.
    var key = !Buffer.isBuffer(key) ? new Buffer(key) : key

    if(key.length > blocksize) {
      key = createHash(alg).update(key).digest()
    } else if(key.length < blocksize) {
      key = Buffer.concat([key, zeroBuffer], blocksize)
    }

    var HMAC;
    var cplen, p = 0, i = 1, itmp = new Buffer(4), digtmp;
    var out = new Buffer(keylen);
    out.fill(0);
    while(keylen) {
      if(keylen > 20)
        cplen = 20;
      else
        cplen = keylen;

      /* We are unlikely to ever use more than 256 blocks (5120 bits!)
         * but just in case...
         */
        itmp[0] = (i >> 24) & 0xff;
        itmp[1] = (i >> 16) & 0xff;
          itmp[2] = (i >> 8) & 0xff;
          itmp[3] = i & 0xff;

          HMAC = createHmac('sha1', key);
          HMAC.update(salt)
          HMAC.update(itmp);
        digtmp = HMAC.digest();
        digtmp.copy(out, p, 0, cplen);

        for(var j = 1; j < iterations; j++) {
          HMAC = createHmac('sha1', key);
          HMAC.update(digtmp);
          digtmp = HMAC.digest();
          for(var k = 0; k < cplen; k++) {
            out[k] ^= digtmp[k];
          }
        }
      keylen -= cplen;
      i++;
      p += cplen;
    }

    return out;
  }

  return exports
}

}).call(this,require("buffer").Buffer)
},{"buffer":29}],44:[function(require,module,exports){
(function (Buffer){
// Original code adapted from Robert Kieffer.
// details at https://github.com/broofa/node-uuid


(function() {
  var _global = this;

  var mathRNG, whatwgRNG;

  // NOTE: Math.random() does not guarantee "cryptographic quality"
  mathRNG = function(size) {
    var bytes = new Buffer(size);
    var r;

    for (var i = 0, r; i < size; i++) {
      if ((i & 0x03) == 0) r = Math.random() * 0x100000000;
      bytes[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return bytes;
  }

  if (_global.crypto && crypto.getRandomValues) {
    whatwgRNG = function(size) {
      var bytes = new Buffer(size); //in browserify, this is an extended Uint8Array
      crypto.getRandomValues(bytes);
      return bytes;
    }
  }

  module.exports = whatwgRNG || mathRNG;

}())

}).call(this,require("buffer").Buffer)
},{"buffer":29}],45:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        throw TypeError('Uncaught, unspecified "error" event.');
      }
      return false;
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],46:[function(require,module,exports){
var http = require('http');

var https = module.exports;

for (var key in http) {
    if (http.hasOwnProperty(key)) https[key] = http[key];
};

https.request = function (params, cb) {
    if (!params) params = {};
    params.scheme = 'https';
    return http.request.call(this, params, cb);
}

},{"http":72}],47:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],48:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require("FWaASH"))
},{"FWaASH":49}],49:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],50:[function(require,module,exports){
(function (global){
/*! http://mths.be/punycode v1.2.4 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports;
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^ -~]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /\x2E|\u3002|\uFF0E|\uFF61/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		while (length--) {
			array[length] = fn(array[length]);
		}
		return array;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings.
	 * @private
	 * @param {String} domain The domain name.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		return map(string.split(regexSeparators), fn).join('.');
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <http://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * http://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols to a Punycode string of ASCII-only
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name to Unicode. Only the
	 * Punycoded parts of the domain name will be converted, i.e. it doesn't
	 * matter if you call it on a string that has already been converted to
	 * Unicode.
	 * @memberOf punycode
	 * @param {String} domain The Punycode domain name to convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(domain) {
		return mapDomain(domain, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name to Punycode. Only the
	 * non-ASCII parts of the domain name will be converted, i.e. it doesn't
	 * matter if you call it with a domain that's already in ASCII.
	 * @memberOf punycode
	 * @param {String} domain The domain name to convert, as a Unicode string.
	 * @returns {String} The Punycode representation of the given domain name.
	 */
	function toASCII(domain) {
		return mapDomain(domain, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.2.4',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <http://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],51:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],52:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],53:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":51,"./encode":52}],54:[function(require,module,exports){
module.exports = require("./lib/_stream_duplex.js")

},{"./lib/_stream_duplex.js":55}],55:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

module.exports = Duplex;

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}
/*</replacement>*/


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

forEach(objectKeys(Writable.prototype), function(method) {
  if (!Duplex.prototype[method])
    Duplex.prototype[method] = Writable.prototype[method];
});

function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false)
    this.readable = false;

  if (options && options.writable === false)
    this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false)
    this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended)
    return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  process.nextTick(this.end.bind(this));
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

}).call(this,require("FWaASH"))
},{"./_stream_readable":57,"./_stream_writable":59,"FWaASH":49,"core-util-is":60,"inherits":47}],56:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function(chunk, encoding, cb) {
  cb(null, chunk);
};

},{"./_stream_transform":58,"core-util-is":60,"inherits":47}],57:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Readable;

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/


/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Readable.ReadableState = ReadableState;

var EE = require('events').EventEmitter;

/*<replacement>*/
if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

var Stream = require('stream');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var StringDecoder;

util.inherits(Readable, Stream);

function ReadableState(options, stream) {
  options = options || {};

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = false;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // In streams that never have any data, and do push(null) right away,
  // the consumer can miss the 'end' event if they do some I/O before
  // consuming the stream.  So, we don't emit('end') until some reading
  // happens.
  this.calledRead = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;


  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder)
      StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  if (!(this instanceof Readable))
    return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function(chunk, encoding) {
  var state = this._readableState;

  if (typeof chunk === 'string' && !state.objectMode) {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = new Buffer(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function(chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null || chunk === undefined) {
    state.reading = false;
    if (!state.ended)
      onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var e = new Error('stream.unshift() after end event');
      stream.emit('error', e);
    } else {
      if (state.decoder && !addToFront && !encoding)
        chunk = state.decoder.write(chunk);

      // update the buffer info.
      state.length += state.objectMode ? 1 : chunk.length;
      if (addToFront) {
        state.buffer.unshift(chunk);
      } else {
        state.reading = false;
        state.buffer.push(chunk);
      }

      if (state.needReadable)
        emitReadable(stream);

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}



// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended &&
         (state.needReadable ||
          state.length < state.highWaterMark ||
          state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function(enc) {
  if (!StringDecoder)
    StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
};

// Don't raise the hwm > 128MB
var MAX_HWM = 0x800000;
function roundUpToNextPowerOf2(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended)
    return 0;

  if (state.objectMode)
    return n === 0 ? 0 : 1;

  if (isNaN(n) || n === null) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length)
      return state.buffer[0].length;
    else
      return state.length;
  }

  if (n <= 0)
    return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark)
    state.highWaterMark = roundUpToNextPowerOf2(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else
      return state.length;
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function(n) {
  var state = this._readableState;
  state.calledRead = true;
  var nOrig = n;

  if (typeof n !== 'number' || n > 0)
    state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)) {
    emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0)
      endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;

  // if we currently have less than the highWaterMark, then also read some
  if (state.length - n <= state.highWaterMark)
    doRead = true;

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading)
    doRead = false;

  if (doRead) {
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0)
      state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read called its callback synchronously, then `reading`
  // will be false, and we need to re-evaluate how much data we
  // can return to the user.
  if (doRead && !state.reading)
    n = howMuchToRead(nOrig, state);

  var ret;
  if (n > 0)
    ret = fromList(n, state);
  else
    ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended)
    state.needReadable = true;

  // If we happened to read() exactly the remaining amount in the
  // buffer, and the EOF has been seen at this point, then make sure
  // that we emit 'end' on the very next tick.
  if (state.ended && !state.endEmitted && state.length === 0)
    endReadable(this);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode &&
      !er) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}


function onEofChunk(stream, state) {
  if (state.decoder && !state.ended) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // if we've ended and we have some data left, then emit
  // 'readable' now to make sure it gets picked up.
  if (state.length > 0)
    emitReadable(stream);
  else
    endReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (state.emittedReadable)
    return;

  state.emittedReadable = true;
  if (state.sync)
    process.nextTick(function() {
      emitReadable_(stream);
    });
  else
    emitReadable_(stream);
}

function emitReadable_(stream) {
  stream.emit('readable');
}


// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(function() {
      maybeReadMore_(stream, state);
    });
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended &&
         state.length < state.highWaterMark) {
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
    else
      len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function(n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function(dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;

  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
              dest !== process.stdout &&
              dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted)
    process.nextTick(endFn);
  else
    src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    if (readable !== src) return;
    cleanup();
  }

  function onend() {
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  function cleanup() {
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (!dest._writableState || dest._writableState.needDrain)
      ondrain();
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    unpipe();
    dest.removeListener('error', onerror);
    if (EE.listenerCount(dest, 'error') === 0)
      dest.emit('error', er);
  }
  // This is a brutally ugly hack to make sure that our error handler
  // is attached before any userland ones.  NEVER DO THIS.
  if (!dest._events || !dest._events.error)
    dest.on('error', onerror);
  else if (isArray(dest._events.error))
    dest._events.error.unshift(onerror);
  else
    dest._events.error = [onerror, dest._events.error];



  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    // the handler that waits for readable events after all
    // the data gets sucked out in flow.
    // This would be easier to follow with a .once() handler
    // in flow(), but that is too slow.
    this.on('readable', pipeOnReadable);

    state.flowing = true;
    process.nextTick(function() {
      flow(src);
    });
  }

  return dest;
};

function pipeOnDrain(src) {
  return function() {
    var dest = this;
    var state = src._readableState;
    state.awaitDrain--;
    if (state.awaitDrain === 0)
      flow(src);
  };
}

function flow(src) {
  var state = src._readableState;
  var chunk;
  state.awaitDrain = 0;

  function write(dest, i, list) {
    var written = dest.write(chunk);
    if (false === written) {
      state.awaitDrain++;
    }
  }

  while (state.pipesCount && null !== (chunk = src.read())) {

    if (state.pipesCount === 1)
      write(state.pipes, 0, null);
    else
      forEach(state.pipes, write);

    src.emit('data', chunk);

    // if anyone needs a drain, then we have to wait for that.
    if (state.awaitDrain > 0)
      return;
  }

  // if every destination was unpiped, either before entering this
  // function, or in the while loop, then stop flowing.
  //
  // NB: This is a pretty rare edge case.
  if (state.pipesCount === 0) {
    state.flowing = false;

    // if there were data event listeners added, then switch to old mode.
    if (EE.listenerCount(src, 'data') > 0)
      emitDataEvents(src);
    return;
  }

  // at this point, no one needed a drain, so we just ran out of data
  // on the next readable event, start it over again.
  state.ranOut = true;
}

function pipeOnReadable() {
  if (this._readableState.ranOut) {
    this._readableState.ranOut = false;
    flow(this);
  }
}


Readable.prototype.unpipe = function(dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0)
    return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes)
      return this;

    if (!dest)
      dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;
    if (dest)
      dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;

    for (var i = 0; i < len; i++)
      dests[i].emit('unpipe', this);
    return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1)
    return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1)
    state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function(ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data' && !this._readableState.flowing)
    emitDataEvents(this);

  if (ev === 'readable' && this.readable) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        this.read(0);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function() {
  emitDataEvents(this);
  this.read(0);
  this.emit('resume');
};

Readable.prototype.pause = function() {
  emitDataEvents(this, true);
  this.emit('pause');
};

function emitDataEvents(stream, startPaused) {
  var state = stream._readableState;

  if (state.flowing) {
    // https://github.com/isaacs/readable-stream/issues/16
    throw new Error('Cannot switch to old mode now.');
  }

  var paused = startPaused || false;
  var readable = false;

  // convert to an old-style stream.
  stream.readable = true;
  stream.pipe = Stream.prototype.pipe;
  stream.on = stream.addListener = Stream.prototype.on;

  stream.on('readable', function() {
    readable = true;

    var c;
    while (!paused && (null !== (c = stream.read())))
      stream.emit('data', c);

    if (c === null) {
      readable = false;
      stream._readableState.needReadable = true;
    }
  });

  stream.pause = function() {
    paused = true;
    this.emit('pause');
  };

  stream.resume = function() {
    paused = false;
    if (readable)
      process.nextTick(function() {
        stream.emit('readable');
      });
    else
      this.read(0);
    this.emit('resume');
  };

  // now make it start, just in case it hadn't already.
  stream.emit('readable');
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function() {
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length)
        self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function(chunk) {
    if (state.decoder)
      chunk = state.decoder.write(chunk);
    if (!chunk || !state.objectMode && !chunk.length)
      return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (typeof stream[i] === 'function' &&
        typeof this[i] === 'undefined') {
      this[i] = function(method) { return function() {
        return stream[method].apply(stream, arguments);
      }}(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function(ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function(n) {
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};



// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0)
    return null;

  if (length === 0)
    ret = null;
  else if (objectMode)
    ret = list.shift();
  else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode)
      ret = list.join('');
    else
      ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode)
        ret = '';
      else
        ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode)
          ret += buf.slice(0, cpy);
        else
          buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length)
          list[0] = buf.slice(cpy);
        else
          list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0)
    throw new Error('endReadable called on non-empty stream');

  if (!state.endEmitted && state.calledRead) {
    state.ended = true;
    process.nextTick(function() {
      // Check that we didn't get one last unshift.
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit('end');
      }
    });
  }
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf (xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}

}).call(this,require("FWaASH"))
},{"FWaASH":49,"buffer":29,"core-util-is":60,"events":45,"inherits":47,"isarray":61,"stream":67,"string_decoder/":62}],58:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);


function TransformState(options, stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb)
    return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined)
    stream.push(data);

  if (cb)
    cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}


function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);

  Duplex.call(this, options);

  var ts = this._transformState = new TransformState(options, this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  this.once('finish', function() {
    if ('function' === typeof this._flush)
      this._flush(function(er) {
        done(stream, er);
      });
    else
      done(stream);
  });
}

Transform.prototype.push = function(chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function(chunk, encoding, cb) {
  throw new Error('not implemented');
};

Transform.prototype._write = function(chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform ||
        rs.needReadable ||
        rs.length < rs.highWaterMark)
      this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function(n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};


function done(stream, er) {
  if (er)
    return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var rs = stream._readableState;
  var ts = stream._transformState;

  if (ws.length)
    throw new Error('calling transform done when ws.length != 0');

  if (ts.transforming)
    throw new Error('calling transform done when still transforming');

  return stream.push(null);
}

},{"./_stream_duplex":55,"core-util-is":60,"inherits":47}],59:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

module.exports = Writable;

/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Writable.WritableState = WritableState;


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/


var Stream = require('stream');

util.inherits(Writable, Stream);

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
}

function WritableState(options, stream) {
  options = options || {};

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function(er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.buffer = [];

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;
}

function Writable(options) {
  var Duplex = require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Duplex))
    return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function() {
  this.emit('error', new Error('Cannot pipe. Not readable.'));
};


function writeAfterEnd(stream, state, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  process.nextTick(function() {
    cb(er);
  });
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    var er = new TypeError('Invalid non-string/buffer chunk');
    stream.emit('error', er);
    process.nextTick(function() {
      cb(er);
    });
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function(chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  else if (!encoding)
    encoding = state.defaultEncoding;

  if (typeof cb !== 'function')
    cb = function() {};

  if (state.ended)
    writeAfterEnd(this, state, cb);
  else if (validChunk(this, state, chunk, cb))
    ret = writeOrBuffer(this, state, chunk, encoding, cb);

  return ret;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode &&
      state.decodeStrings !== false &&
      typeof chunk === 'string') {
    chunk = new Buffer(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);
  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret)
    state.needDrain = true;

  if (state.writing)
    state.buffer.push(new WriteReq(chunk, encoding, cb));
  else
    doWrite(stream, state, len, chunk, encoding, cb);

  return ret;
}

function doWrite(stream, state, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  if (sync)
    process.nextTick(function() {
      cb(er);
    });
  else
    cb(er);

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er)
    onwriteError(stream, state, sync, er, cb);
  else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(stream, state);

    if (!finished && !state.bufferProcessing && state.buffer.length)
      clearBuffer(stream, state);

    if (sync) {
      process.nextTick(function() {
        afterWrite(stream, state, finished, cb);
      });
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  cb();
  if (finished)
    finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}


// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;

  for (var c = 0; c < state.buffer.length; c++) {
    var entry = state.buffer[c];
    var chunk = entry.chunk;
    var encoding = entry.encoding;
    var cb = entry.callback;
    var len = state.objectMode ? 1 : chunk.length;

    doWrite(stream, state, len, chunk, encoding, cb);

    // if we didn't call the onwrite immediately, then
    // it means that we need to wait until it does.
    // also, that means that the chunk and cb are currently
    // being processed, so move the buffer counter past them.
    if (state.writing) {
      c++;
      break;
    }
  }

  state.bufferProcessing = false;
  if (c < state.buffer.length)
    state.buffer = state.buffer.slice(c);
  else
    state.buffer.length = 0;
}

Writable.prototype._write = function(chunk, encoding, cb) {
  cb(new Error('not implemented'));
};

Writable.prototype.end = function(chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (typeof chunk !== 'undefined' && chunk !== null)
    this.write(chunk, encoding);

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished)
    endWritable(this, state, cb);
};


function needFinish(stream, state) {
  return (state.ending &&
          state.length === 0 &&
          !state.finished &&
          !state.writing);
}

function finishMaybe(stream, state) {
  var need = needFinish(stream, state);
  if (need) {
    state.finished = true;
    stream.emit('finish');
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished)
      process.nextTick(cb);
    else
      stream.once('finish', cb);
  }
  state.ended = true;
}

}).call(this,require("FWaASH"))
},{"./_stream_duplex":55,"FWaASH":49,"buffer":29,"core-util-is":60,"inherits":47,"stream":67}],60:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

function isBuffer(arg) {
  return Buffer.isBuffer(arg);
}
exports.isBuffer = isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}
}).call(this,require("buffer").Buffer)
},{"buffer":29}],61:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],62:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require('buffer').Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  this.charBuffer = new Buffer(6);
  this.charReceived = 0;
  this.charLength = 0;
};


StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  var offset = 0;

  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var i = (buffer.length >= this.charLength - this.charReceived) ?
                this.charLength - this.charReceived :
                buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, offset, i);
    this.charReceived += (i - offset);
    offset = i;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (i == buffer.length) return charStr;

    // otherwise cut off the characters end from the beginning of this buffer
    buffer = buffer.slice(i, buffer.length);
    break;
  }

  var lenIncomplete = this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - lenIncomplete, end);
    this.charReceived = lenIncomplete;
    end -= lenIncomplete;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    this.charBuffer.write(charStr.charAt(charStr.length - 1), this.encoding);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }

  return i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  var incomplete = this.charReceived = buffer.length % 2;
  this.charLength = incomplete ? 2 : 0;
  return incomplete;
}

function base64DetectIncompleteChar(buffer) {
  var incomplete = this.charReceived = buffer.length % 3;
  this.charLength = incomplete ? 3 : 0;
  return incomplete;
}

},{"buffer":29}],63:[function(require,module,exports){
module.exports = require("./lib/_stream_passthrough.js")

},{"./lib/_stream_passthrough.js":56}],64:[function(require,module,exports){
exports = module.exports = require('./lib/_stream_readable.js');
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

},{"./lib/_stream_duplex.js":55,"./lib/_stream_passthrough.js":56,"./lib/_stream_readable.js":57,"./lib/_stream_transform.js":58,"./lib/_stream_writable.js":59}],65:[function(require,module,exports){
module.exports = require("./lib/_stream_transform.js")

},{"./lib/_stream_transform.js":58}],66:[function(require,module,exports){
module.exports = require("./lib/_stream_writable.js")

},{"./lib/_stream_writable.js":59}],67:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('readable-stream/readable.js');
Stream.Writable = require('readable-stream/writable.js');
Stream.Duplex = require('readable-stream/duplex.js');
Stream.Transform = require('readable-stream/transform.js');
Stream.PassThrough = require('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":45,"inherits":47,"readable-stream/duplex.js":54,"readable-stream/passthrough.js":63,"readable-stream/readable.js":64,"readable-stream/transform.js":65,"readable-stream/writable.js":66}],68:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var punycode = require('punycode');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a puny coded representation of "domain".
      // It only converts the part of the domain name that
      // has non ASCII characters. I.e. it dosent matter if
      // you call it with a domain that already is in ASCII.
      var domainArray = this.hostname.split('.');
      var newOut = [];
      for (var i = 0; i < domainArray.length; ++i) {
        var s = domainArray[i];
        newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
            'xn--' + punycode.encode(s) : s);
      }
      this.hostname = newOut.join('.');
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  Object.keys(this).forEach(function(k) {
    result[k] = this[k];
  }, this);

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    Object.keys(relative).forEach(function(k) {
      if (k !== 'protocol')
        result[k] = relative[k];
    });

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      Object.keys(relative).forEach(function(k) {
        result[k] = relative[k];
      });
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especialy happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!isNull(result.pathname) || !isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host) && (last === '.' || last === '..') ||
      last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last == '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especialy happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!isNull(result.pathname) || !isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

function isString(arg) {
  return typeof arg === "string";
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isNull(arg) {
  return arg === null;
}
function isNullOrUndefined(arg) {
  return  arg == null;
}

},{"punycode":50,"querystring":53}],69:[function(require,module,exports){
module.exports=require(27)
},{}],70:[function(require,module,exports){
module.exports=require(28)
},{"./support/isBuffer":69,"FWaASH":49,"inherits":47}],71:[function(require,module,exports){
module.exports = function merge (target, src) {
    var array = Array.isArray(src)
    var dst = array && [] || {}

    if (array) {
        target = target || []
        dst = dst.concat(target)
        src.forEach(function(e, i) {
            if (typeof target[i] === 'undefined') {
                dst[i] = e
            } else if (typeof e === 'object') {
                dst[i] = merge(target[i], e)
            } else {
                if (target.indexOf(e) === -1) {
                    dst.push(e)
                }
            }
        })
    } else {
        if (target && typeof target === 'object') {
            Object.keys(target).forEach(function (key) {
                dst[key] = target[key]
            })
        }
        Object.keys(src).forEach(function (key) {
            if (typeof src[key] !== 'object' || !src[key]) {
                dst[key] = src[key]
            }
            else {
                if (!target[key]) {
                    dst[key] = src[key]
                } else {
                    dst[key] = merge(target[key], src[key])
                }
            }
        })
    }

    return dst
}

},{}],72:[function(require,module,exports){
var http = module.exports;
var EventEmitter = require('events').EventEmitter;
var Request = require('./lib/request');
var url = require('url')

http.request = function (params, cb) {
    if (typeof params === 'string') {
        params = url.parse(params)
    }
    if (!params) params = {};
    if (!params.host && !params.port) {
        params.port = parseInt(window.location.port, 10);
    }
    if (!params.host && params.hostname) {
        params.host = params.hostname;
    }
    
    if (!params.scheme) params.scheme = window.location.protocol.split(':')[0];
    if (!params.host) {
        params.host = window.location.hostname || window.location.host;
    }
    if (/:/.test(params.host)) {
        if (!params.port) {
            params.port = params.host.split(':')[1];
        }
        params.host = params.host.split(':')[0];
    }
    if (!params.port) params.port = params.scheme == 'https' ? 443 : 80;
    
    var req = new Request(new xhrHttp, params);
    if (cb) req.on('response', cb);
    return req;
};

http.get = function (params, cb) {
    params.method = 'GET';
    var req = http.request(params, cb);
    req.end();
    return req;
};

http.Agent = function () {};
http.Agent.defaultMaxSockets = 4;

var xhrHttp = (function () {
    if (typeof window === 'undefined') {
        throw new Error('no window object present');
    }
    else if (window.XMLHttpRequest) {
        return window.XMLHttpRequest;
    }
    else if (window.ActiveXObject) {
        var axs = [
            'Msxml2.XMLHTTP.6.0',
            'Msxml2.XMLHTTP.3.0',
            'Microsoft.XMLHTTP'
        ];
        for (var i = 0; i < axs.length; i++) {
            try {
                var ax = new(window.ActiveXObject)(axs[i]);
                return function () {
                    if (ax) {
                        var ax_ = ax;
                        ax = null;
                        return ax_;
                    }
                    else {
                        return new(window.ActiveXObject)(axs[i]);
                    }
                };
            }
            catch (e) {}
        }
        throw new Error('ajax not supported in this browser')
    }
    else {
        throw new Error('ajax not supported in this browser');
    }
})();

http.STATUS_CODES = {
    100 : 'Continue',
    101 : 'Switching Protocols',
    102 : 'Processing',                 // RFC 2518, obsoleted by RFC 4918
    200 : 'OK',
    201 : 'Created',
    202 : 'Accepted',
    203 : 'Non-Authoritative Information',
    204 : 'No Content',
    205 : 'Reset Content',
    206 : 'Partial Content',
    207 : 'Multi-Status',               // RFC 4918
    300 : 'Multiple Choices',
    301 : 'Moved Permanently',
    302 : 'Moved Temporarily',
    303 : 'See Other',
    304 : 'Not Modified',
    305 : 'Use Proxy',
    307 : 'Temporary Redirect',
    400 : 'Bad Request',
    401 : 'Unauthorized',
    402 : 'Payment Required',
    403 : 'Forbidden',
    404 : 'Not Found',
    405 : 'Method Not Allowed',
    406 : 'Not Acceptable',
    407 : 'Proxy Authentication Required',
    408 : 'Request Time-out',
    409 : 'Conflict',
    410 : 'Gone',
    411 : 'Length Required',
    412 : 'Precondition Failed',
    413 : 'Request Entity Too Large',
    414 : 'Request-URI Too Large',
    415 : 'Unsupported Media Type',
    416 : 'Requested Range Not Satisfiable',
    417 : 'Expectation Failed',
    418 : 'I\'m a teapot',              // RFC 2324
    422 : 'Unprocessable Entity',       // RFC 4918
    423 : 'Locked',                     // RFC 4918
    424 : 'Failed Dependency',          // RFC 4918
    425 : 'Unordered Collection',       // RFC 4918
    426 : 'Upgrade Required',           // RFC 2817
    428 : 'Precondition Required',      // RFC 6585
    429 : 'Too Many Requests',          // RFC 6585
    431 : 'Request Header Fields Too Large',// RFC 6585
    500 : 'Internal Server Error',
    501 : 'Not Implemented',
    502 : 'Bad Gateway',
    503 : 'Service Unavailable',
    504 : 'Gateway Time-out',
    505 : 'HTTP Version Not Supported',
    506 : 'Variant Also Negotiates',    // RFC 2295
    507 : 'Insufficient Storage',       // RFC 4918
    509 : 'Bandwidth Limit Exceeded',
    510 : 'Not Extended',               // RFC 2774
    511 : 'Network Authentication Required' // RFC 6585
};
},{"./lib/request":73,"events":45,"url":68}],73:[function(require,module,exports){
var Stream = require('stream');
var Response = require('./response');
var Base64 = require('Base64');
var inherits = require('inherits');

var Request = module.exports = function (xhr, params) {
    var self = this;
    self.writable = true;
    self.xhr = xhr;
    self.body = [];
    
    self.uri = (params.scheme || 'http') + '://'
        + params.host
        + (params.port ? ':' + params.port : '')
        + (params.path || '/')
    ;
    
    if (typeof params.withCredentials === 'undefined') {
        params.withCredentials = true;
    }

    try { xhr.withCredentials = params.withCredentials }
    catch (e) {}
    
    if (params.responseType) try { xhr.responseType = params.responseType }
    catch (e) {}
    
    xhr.open(
        params.method || 'GET',
        self.uri,
        true
    );

    self._headers = {};
    
    if (params.headers) {
        var keys = objectKeys(params.headers);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (!self.isSafeRequestHeader(key)) continue;
            var value = params.headers[key];
            self.setHeader(key, value);
        }
    }
    
    if (params.auth) {
        //basic auth
        this.setHeader('Authorization', 'Basic ' + Base64.btoa(params.auth));
    }

    var res = new Response;
    res.on('close', function () {
        self.emit('close');
    });
    
    res.on('ready', function () {
        self.emit('response', res);
    });
    
    xhr.onreadystatechange = function () {
        // Fix for IE9 bug
        // SCRIPT575: Could not complete the operation due to error c00c023f
        // It happens when a request is aborted, calling the success callback anyway with readyState === 4
        if (xhr.__aborted) return;
        res.handle(xhr);
    };
};

inherits(Request, Stream);

Request.prototype.setHeader = function (key, value) {
    this._headers[key.toLowerCase()] = value
};

Request.prototype.getHeader = function (key) {
    return this._headers[key.toLowerCase()]
};

Request.prototype.removeHeader = function (key) {
    delete this._headers[key.toLowerCase()]
};

Request.prototype.write = function (s) {
    this.body.push(s);
};

Request.prototype.destroy = function (s) {
    this.xhr.__aborted = true;
    this.xhr.abort();
    this.emit('close');
};

Request.prototype.end = function (s) {
    if (s !== undefined) this.body.push(s);

    var keys = objectKeys(this._headers);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = this._headers[key];
        if (isArray(value)) {
            for (var j = 0; j < value.length; j++) {
                this.xhr.setRequestHeader(key, value[j]);
            }
        }
        else this.xhr.setRequestHeader(key, value)
    }

    if (this.body.length === 0) {
        this.xhr.send('');
    }
    else if (typeof this.body[0] === 'string') {
        this.xhr.send(this.body.join(''));
    }
    else if (isArray(this.body[0])) {
        var body = [];
        for (var i = 0; i < this.body.length; i++) {
            body.push.apply(body, this.body[i]);
        }
        this.xhr.send(body);
    }
    else if (/Array/.test(Object.prototype.toString.call(this.body[0]))) {
        var len = 0;
        for (var i = 0; i < this.body.length; i++) {
            len += this.body[i].length;
        }
        var body = new(this.body[0].constructor)(len);
        var k = 0;
        
        for (var i = 0; i < this.body.length; i++) {
            var b = this.body[i];
            for (var j = 0; j < b.length; j++) {
                body[k++] = b[j];
            }
        }
        this.xhr.send(body);
    }
    else {
        var body = '';
        for (var i = 0; i < this.body.length; i++) {
            body += this.body[i].toString();
        }
        this.xhr.send(body);
    }
};

// Taken from http://dxr.mozilla.org/mozilla/mozilla-central/content/base/src/nsXMLHttpRequest.cpp.html
Request.unsafeHeaders = [
    "accept-charset",
    "accept-encoding",
    "access-control-request-headers",
    "access-control-request-method",
    "connection",
    "content-length",
    "cookie",
    "cookie2",
    "content-transfer-encoding",
    "date",
    "expect",
    "host",
    "keep-alive",
    "origin",
    "referer",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
    "user-agent",
    "via"
];

Request.prototype.isSafeRequestHeader = function (headerName) {
    if (!headerName) return false;
    return indexOf(Request.unsafeHeaders, headerName.toLowerCase()) === -1;
};

var objectKeys = Object.keys || function (obj) {
    var keys = [];
    for (var key in obj) keys.push(key);
    return keys;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};

var indexOf = function (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (xs[i] === x) return i;
    }
    return -1;
};

},{"./response":74,"Base64":75,"inherits":76,"stream":67}],74:[function(require,module,exports){
var Stream = require('stream');
var util = require('util');

var Response = module.exports = function (res) {
    this.offset = 0;
    this.readable = true;
};

util.inherits(Response, Stream);

var capable = {
    streaming : true,
    status2 : true
};

function parseHeaders (res) {
    var lines = res.getAllResponseHeaders().split(/\r?\n/);
    var headers = {};
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line === '') continue;
        
        var m = line.match(/^([^:]+):\s*(.*)/);
        if (m) {
            var key = m[1].toLowerCase(), value = m[2];
            
            if (headers[key] !== undefined) {
            
                if (isArray(headers[key])) {
                    headers[key].push(value);
                }
                else {
                    headers[key] = [ headers[key], value ];
                }
            }
            else {
                headers[key] = value;
            }
        }
        else {
            headers[line] = true;
        }
    }
    return headers;
}

Response.prototype.getResponse = function (xhr) {
    var respType = String(xhr.responseType).toLowerCase();
    if (respType === 'blob') return xhr.responseBlob || xhr.response;
    if (respType === 'arraybuffer') return xhr.response;
    return xhr.responseText;
}

Response.prototype.getHeader = function (key) {
    return this.headers[key.toLowerCase()];
};

Response.prototype.handle = function (res) {
    if (res.readyState === 2 && capable.status2) {
        try {
            this.statusCode = res.status;
            this.headers = parseHeaders(res);
        }
        catch (err) {
            capable.status2 = false;
        }
        
        if (capable.status2) {
            this.emit('ready');
        }
    }
    else if (capable.streaming && res.readyState === 3) {
        try {
            if (!this.statusCode) {
                this.statusCode = res.status;
                this.headers = parseHeaders(res);
                this.emit('ready');
            }
        }
        catch (err) {}
        
        try {
            this._emitData(res);
        }
        catch (err) {
            capable.streaming = false;
        }
    }
    else if (res.readyState === 4) {
        if (!this.statusCode) {
            this.statusCode = res.status;
            this.emit('ready');
        }
        this._emitData(res);
        
        if (res.error) {
            this.emit('error', this.getResponse(res));
        }
        else this.emit('end');
        
        this.emit('close');
    }
};

Response.prototype._emitData = function (res) {
    var respBody = this.getResponse(res);
    if (respBody.toString().match(/ArrayBuffer/)) {
        this.emit('data', new Uint8Array(respBody, this.offset));
        this.offset = respBody.byteLength;
        return;
    }
    if (respBody.length > this.offset) {
        this.emit('data', respBody.slice(this.offset));
        this.offset = respBody.length;
    }
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};

},{"stream":67,"util":70}],75:[function(require,module,exports){
;(function () {

  var object = typeof exports != 'undefined' ? exports : this; // #8: web workers
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  function InvalidCharacterError(message) {
    this.message = message;
  }
  InvalidCharacterError.prototype = new Error;
  InvalidCharacterError.prototype.name = 'InvalidCharacterError';

  // encoder
  // [https://gist.github.com/999166] by [https://github.com/nignag]
  object.btoa || (
  object.btoa = function (input) {
    for (
      // initialize result and counter
      var block, charCode, idx = 0, map = chars, output = '';
      // if the next input index does not exist:
      //   change the mapping table to "="
      //   check if d has no fractional digits
      input.charAt(idx | 0) || (map = '=', idx % 1);
      // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
      output += map.charAt(63 & block >> 8 - idx % 1 * 8)
    ) {
      charCode = input.charCodeAt(idx += 3/4);
      if (charCode > 0xFF) {
        throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      }
      block = block << 8 | charCode;
    }
    return output;
  });

  // decoder
  // [https://gist.github.com/1020396] by [https://github.com/atk]
  object.atob || (
  object.atob = function (input) {
    input = input.replace(/=+$/, '');
    if (input.length % 4 == 1) {
      throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (
      // initialize result and counters
      var bc = 0, bs, buffer, idx = 0, output = '';
      // get next character
      buffer = input.charAt(idx++);
      // character found in table? initialize bit storage and add its ascii value;
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = chars.indexOf(buffer);
    }
    return output;
  });

}());

},{}],76:[function(require,module,exports){
module.exports=require(47)
},{}],77:[function(require,module,exports){
(function (process){
// vim:ts=4:sts=4:sw=4:
/*!
 *
 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function (definition) {
    // Turn off strict mode for this function so we can assign to global.Q
    /* jshint strict: false */

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the Q API and when
    // executed as a simple <script>, it creates a Q global instead.

    // Montage Require
    if (typeof bootstrap === "function") {
        bootstrap("promise", definition);

    // CommonJS
    } else if (typeof exports === "object") {
        module.exports = definition();

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // SES (Secure EcmaScript)
    } else if (typeof ses !== "undefined") {
        if (!ses.ok()) {
            return;
        } else {
            ses.makeQ = definition;
        }

    // <script>
    } else {
        Q = definition();
    }

})(function () {
"use strict";

var hasStacks = false;
try {
    throw new Error();
} catch (e) {
    hasStacks = !!e.stack;
}

// All code after this point will be filtered from stack traces reported
// by Q.
var qStartingLine = captureLine();
var qFileName;

// shims

// used for fallback in "allResolved"
var noop = function () {};

// Use the fastest possible means to execute a task in a future turn
// of the event loop.
var nextTick =(function () {
    // linked list of tasks (single, with head node)
    var head = {task: void 0, next: null};
    var tail = head;
    var flushing = false;
    var requestTick = void 0;
    var isNodeJS = false;

    function flush() {
        /* jshint loopfunc: true */

        while (head.next) {
            head = head.next;
            var task = head.task;
            head.task = void 0;
            var domain = head.domain;

            if (domain) {
                head.domain = void 0;
                domain.enter();
            }

            try {
                task();

            } catch (e) {
                if (isNodeJS) {
                    // In node, uncaught exceptions are considered fatal errors.
                    // Re-throw them synchronously to interrupt flushing!

                    // Ensure continuation if the uncaught exception is suppressed
                    // listening "uncaughtException" events (as domains does).
                    // Continue in next event to avoid tick recursion.
                    if (domain) {
                        domain.exit();
                    }
                    setTimeout(flush, 0);
                    if (domain) {
                        domain.enter();
                    }

                    throw e;

                } else {
                    // In browsers, uncaught exceptions are not fatal.
                    // Re-throw them asynchronously to avoid slow-downs.
                    setTimeout(function() {
                       throw e;
                    }, 0);
                }
            }

            if (domain) {
                domain.exit();
            }
        }

        flushing = false;
    }

    nextTick = function (task) {
        tail = tail.next = {
            task: task,
            domain: isNodeJS && process.domain,
            next: null
        };

        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };

    if (typeof process !== "undefined" && process.nextTick) {
        // Node.js before 0.9. Note that some fake-Node environments, like the
        // Mocha test runner, introduce a `process` global without a `nextTick`.
        isNodeJS = true;

        requestTick = function () {
            process.nextTick(flush);
        };

    } else if (typeof setImmediate === "function") {
        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
        if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
        } else {
            requestTick = function () {
                setImmediate(flush);
            };
        }

    } else if (typeof MessageChannel !== "undefined") {
        // modern browsers
        // http://www.nonblocking.io/2011/06/windownexttick.html
        var channel = new MessageChannel();
        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
        // working message ports the first time a page loads.
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            // Opera requires us to provide a message payload, regardless of
            // whether we use it.
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
        };

    } else {
        // old browsers
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }

    return nextTick;
})();

// Attempt to make generics safe in the face of downstream
// modifications.
// There is no situation where this is necessary.
// If you need a security guarantee, these primordials need to be
// deeply frozen anyway, and if you don’t need a security guarantee,
// this is just plain paranoid.
// However, this **might** have the nice side-effect of reducing the size of
// the minified code by reducing x.call() to merely x()
// See Mark Miller’s explanation of what this does.
// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
var call = Function.call;
function uncurryThis(f) {
    return function () {
        return call.apply(f, arguments);
    };
}
// This is equivalent, but slower:
// uncurryThis = Function_bind.bind(Function_bind.call);
// http://jsperf.com/uncurrythis

var array_slice = uncurryThis(Array.prototype.slice);

var array_reduce = uncurryThis(
    Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    }
);

var array_indexOf = uncurryThis(
    Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
);

var array_map = uncurryThis(
    Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    }
);

var object_create = Object.create || function (prototype) {
    function Type() { }
    Type.prototype = prototype;
    return new Type();
};

var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

var object_keys = Object.keys || function (object) {
    var keys = [];
    for (var key in object) {
        if (object_hasOwnProperty(object, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var object_toString = uncurryThis(Object.prototype.toString);

function isObject(value) {
    return value === Object(value);
}

// generator related shims

// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
function isStopIteration(exception) {
    return (
        object_toString(exception) === "[object StopIteration]" ||
        exception instanceof QReturnValue
    );
}

// FIXME: Remove this helper and Q.return once ES6 generators are in
// SpiderMonkey.
var QReturnValue;
if (typeof ReturnValue !== "undefined") {
    QReturnValue = ReturnValue;
} else {
    QReturnValue = function (value) {
        this.value = value;
    };
}

// long stack traces

var STACK_JUMP_SEPARATOR = "From previous event:";

function makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and Q
    // cruft, then concatenating with the stack trace of `promise`. See #57.
    if (hasStacks &&
        promise.stack &&
        typeof error === "object" &&
        error !== null &&
        error.stack &&
        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
    ) {
        var stacks = [];
        for (var p = promise; !!p; p = p.source) {
            if (p.stack) {
                stacks.unshift(p.stack);
            }
        }
        stacks.unshift(error.stack);

        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
        error.stack = filterStackString(concatedStacks);
    }
}

function filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
            desiredLines.push(line);
        }
    }
    return desiredLines.join("\n");
}

function isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
           stackLine.indexOf("(node.js:") !== -1;
}

function getFileNameAndLineNumber(stackLine) {
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) {
        return [attempt1[1], Number(attempt1[2])];
    }

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) {
        return [attempt2[1], Number(attempt2[2])];
    }

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) {
        return [attempt3[1], Number(attempt3[2])];
    }
}

function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

    if (!fileNameAndLineNumber) {
        return false;
    }

    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];

    return fileName === qFileName &&
        lineNumber >= qStartingLine &&
        lineNumber <= qEndingLine;
}

// discover own file name and line number range for filtering stack
// traces
function captureLine() {
    if (!hasStacks) {
        return;
    }

    try {
        throw new Error();
    } catch (e) {
        var lines = e.stack.split("\n");
        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
        if (!fileNameAndLineNumber) {
            return;
        }

        qFileName = fileNameAndLineNumber[0];
        return fileNameAndLineNumber[1];
    }
}

function deprecate(callback, name, alternative) {
    return function () {
        if (typeof console !== "undefined" &&
            typeof console.warn === "function") {
            console.warn(name + " is deprecated, use " + alternative +
                         " instead.", new Error("").stack);
        }
        return callback.apply(callback, arguments);
    };
}

// end of shims
// beginning of real work

/**
 * Constructs a promise for an immediate reference, passes promises through, or
 * coerces promises from different systems.
 * @param value immediate reference or promise
 */
function Q(value) {
    // If the object is already a Promise, return it directly.  This enables
    // the resolve function to both be used to created references from objects,
    // but to tolerably coerce non-promises to promises.
    if (isPromise(value)) {
        return value;
    }

    // assimilate thenables
    if (isPromiseAlike(value)) {
        return coerce(value);
    } else {
        return fulfill(value);
    }
}
Q.resolve = Q;

/**
 * Performs a task in a future turn of the event loop.
 * @param {Function} task
 */
Q.nextTick = nextTick;

/**
 * Controls whether or not long stack traces will be on
 */
Q.longStackSupport = false;

/**
 * Constructs a {promise, resolve, reject} object.
 *
 * `resolve` is a callback to invoke with a more resolved value for the
 * promise. To fulfill the promise, invoke `resolve` with any value that is
 * not a thenable. To reject the promise, invoke `resolve` with a rejected
 * thenable, or invoke `reject` with the reason directly. To resolve the
 * promise to another thenable, thus putting it in the same state, invoke
 * `resolve` with that other thenable.
 */
Q.defer = defer;
function defer() {
    // if "messages" is an "Array", that indicates that the promise has not yet
    // been resolved.  If it is "undefined", it has been resolved.  Each
    // element of the messages array is itself an array of complete arguments to
    // forward to the resolved promise.  We coerce the resolution value to a
    // promise using the `resolve` function because it handles both fully
    // non-thenable values and other thenables gracefully.
    var messages = [], progressListeners = [], resolvedPromise;

    var deferred = object_create(defer.prototype);
    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, operands) {
        var args = array_slice(arguments);
        if (messages) {
            messages.push(args);
            if (op === "when" && operands[1]) { // progress operand
                progressListeners.push(operands[1]);
            }
        } else {
            nextTick(function () {
                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            });
        }
    };

    // XXX deprecated
    promise.valueOf = function () {
        if (messages) {
            return promise;
        }
        var nearerValue = nearer(resolvedPromise);
        if (isPromise(nearerValue)) {
            resolvedPromise = nearerValue; // shorten chain
        }
        return nearerValue;
    };

    promise.inspect = function () {
        if (!resolvedPromise) {
            return { state: "pending" };
        }
        return resolvedPromise.inspect();
    };

    if (Q.longStackSupport && hasStacks) {
        try {
            throw new Error();
        } catch (e) {
            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
            // accessor around; that causes memory leaks as per GH-111. Just
            // reify the stack trace as a string ASAP.
            //
            // At the same time, cut off the first line; it's always just
            // "[object Promise]\n", as per the `toString`.
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
        }
    }

    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
    // consolidating them into `become`, since otherwise we'd create new
    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

    function become(newPromise) {
        resolvedPromise = newPromise;
        promise.source = newPromise;

        array_reduce(messages, function (undefined, message) {
            nextTick(function () {
                newPromise.promiseDispatch.apply(newPromise, message);
            });
        }, void 0);

        messages = void 0;
        progressListeners = void 0;
    }

    deferred.promise = promise;
    deferred.resolve = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(Q(value));
    };

    deferred.fulfill = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(fulfill(value));
    };
    deferred.reject = function (reason) {
        if (resolvedPromise) {
            return;
        }

        become(reject(reason));
    };
    deferred.notify = function (progress) {
        if (resolvedPromise) {
            return;
        }

        array_reduce(progressListeners, function (undefined, progressListener) {
            nextTick(function () {
                progressListener(progress);
            });
        }, void 0);
    };

    return deferred;
}

/**
 * Creates a Node-style callback that will resolve or reject the deferred
 * promise.
 * @returns a nodeback
 */
defer.prototype.makeNodeResolver = function () {
    var self = this;
    return function (error, value) {
        if (error) {
            self.reject(error);
        } else if (arguments.length > 2) {
            self.resolve(array_slice(arguments, 1));
        } else {
            self.resolve(value);
        }
    };
};

/**
 * @param resolver {Function} a function that returns nothing and accepts
 * the resolve, reject, and notify functions for a deferred.
 * @returns a promise that may be resolved with the given resolve and reject
 * functions, or rejected by a thrown exception in resolver
 */
Q.Promise = promise; // ES6
Q.promise = promise;
function promise(resolver) {
    if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function.");
    }
    var deferred = defer();
    try {
        resolver(deferred.resolve, deferred.reject, deferred.notify);
    } catch (reason) {
        deferred.reject(reason);
    }
    return deferred.promise;
}

promise.race = race; // ES6
promise.all = all; // ES6
promise.reject = reject; // ES6
promise.resolve = Q; // ES6

// XXX experimental.  This method is a way to denote that a local value is
// serializable and should be immediately dispatched to a remote upon request,
// instead of passing a reference.
Q.passByCopy = function (object) {
    //freeze(object);
    //passByCopies.set(object, true);
    return object;
};

Promise.prototype.passByCopy = function () {
    //freeze(object);
    //passByCopies.set(object, true);
    return this;
};

/**
 * If two promises eventually fulfill to the same value, promises that value,
 * but otherwise rejects.
 * @param x {Any*}
 * @param y {Any*}
 * @returns {Any*} a promise for x and y if they are the same, but a rejection
 * otherwise.
 *
 */
Q.join = function (x, y) {
    return Q(x).join(y);
};

Promise.prototype.join = function (that) {
    return Q([this, that]).spread(function (x, y) {
        if (x === y) {
            // TODO: "===" should be Object.is or equiv
            return x;
        } else {
            throw new Error("Can't join: not the same: " + x + " " + y);
        }
    });
};

/**
 * Returns a promise for the first of an array of promises to become fulfilled.
 * @param answers {Array[Any*]} promises to race
 * @returns {Any*} the first promise to be fulfilled
 */
Q.race = race;
function race(answerPs) {
    return promise(function(resolve, reject) {
        // Switch to this once we can assume at least ES5
        // answerPs.forEach(function(answerP) {
        //     Q(answerP).then(resolve, reject);
        // });
        // Use this in the meantime
        for (var i = 0, len = answerPs.length; i < len; i++) {
            Q(answerPs[i]).then(resolve, reject);
        }
    });
}

Promise.prototype.race = function () {
    return this.then(Q.race);
};

/**
 * Constructs a Promise with a promise descriptor object and optional fallback
 * function.  The descriptor contains methods like when(rejected), get(name),
 * set(name, value), post(name, args), and delete(name), which all
 * return either a value, a promise for a value, or a rejection.  The fallback
 * accepts the operation name, a resolver, and any further arguments that would
 * have been forwarded to the appropriate method above had a method been
 * provided with the proper name.  The API makes no guarantees about the nature
 * of the returned object, apart from that it is usable whereever promises are
 * bought and sold.
 */
Q.makePromise = Promise;
function Promise(descriptor, fallback, inspect) {
    if (fallback === void 0) {
        fallback = function (op) {
            return reject(new Error(
                "Promise does not support operation: " + op
            ));
        };
    }
    if (inspect === void 0) {
        inspect = function () {
            return {state: "unknown"};
        };
    }

    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, args) {
        var result;
        try {
            if (descriptor[op]) {
                result = descriptor[op].apply(promise, args);
            } else {
                result = fallback.call(promise, op, args);
            }
        } catch (exception) {
            result = reject(exception);
        }
        if (resolve) {
            resolve(result);
        }
    };

    promise.inspect = inspect;

    // XXX deprecated `valueOf` and `exception` support
    if (inspect) {
        var inspected = inspect();
        if (inspected.state === "rejected") {
            promise.exception = inspected.reason;
        }

        promise.valueOf = function () {
            var inspected = inspect();
            if (inspected.state === "pending" ||
                inspected.state === "rejected") {
                return promise;
            }
            return inspected.value;
        };
    }

    return promise;
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.then = function (fulfilled, rejected, progressed) {
    var self = this;
    var deferred = defer();
    var done = false;   // ensure the untrusted promise makes at most a
                        // single call to one of the callbacks

    function _fulfilled(value) {
        try {
            return typeof fulfilled === "function" ? fulfilled(value) : value;
        } catch (exception) {
            return reject(exception);
        }
    }

    function _rejected(exception) {
        if (typeof rejected === "function") {
            makeStackTraceLong(exception, self);
            try {
                return rejected(exception);
            } catch (newException) {
                return reject(newException);
            }
        }
        return reject(exception);
    }

    function _progressed(value) {
        return typeof progressed === "function" ? progressed(value) : value;
    }

    nextTick(function () {
        self.promiseDispatch(function (value) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_fulfilled(value));
        }, "when", [function (exception) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_rejected(exception));
        }]);
    });

    // Progress propagator need to be attached in the current tick.
    self.promiseDispatch(void 0, "when", [void 0, function (value) {
        var newValue;
        var threw = false;
        try {
            newValue = _progressed(value);
        } catch (e) {
            threw = true;
            if (Q.onerror) {
                Q.onerror(e);
            } else {
                throw e;
            }
        }

        if (!threw) {
            deferred.notify(newValue);
        }
    }]);

    return deferred.promise;
};

/**
 * Registers an observer on a promise.
 *
 * Guarantees:
 *
 * 1. that fulfilled and rejected will be called only once.
 * 2. that either the fulfilled callback or the rejected callback will be
 *    called, but not both.
 * 3. that fulfilled and rejected will not be called in this turn.
 *
 * @param value      promise or immediate reference to observe
 * @param fulfilled  function to be called with the fulfilled value
 * @param rejected   function to be called with the rejection exception
 * @param progressed function to be called on any progress notifications
 * @return promise for the return value from the invoked callback
 */
Q.when = when;
function when(value, fulfilled, rejected, progressed) {
    return Q(value).then(fulfilled, rejected, progressed);
}

Promise.prototype.thenResolve = function (value) {
    return this.then(function () { return value; });
};

Q.thenResolve = function (promise, value) {
    return Q(promise).thenResolve(value);
};

Promise.prototype.thenReject = function (reason) {
    return this.then(function () { throw reason; });
};

Q.thenReject = function (promise, reason) {
    return Q(promise).thenReject(reason);
};

/**
 * If an object is not a promise, it is as "near" as possible.
 * If a promise is rejected, it is as "near" as possible too.
 * If it’s a fulfilled promise, the fulfillment value is nearer.
 * If it’s a deferred promise and the deferred has been resolved, the
 * resolution is "nearer".
 * @param object
 * @returns most resolved (nearest) form of the object
 */

// XXX should we re-do this?
Q.nearer = nearer;
function nearer(value) {
    if (isPromise(value)) {
        var inspected = value.inspect();
        if (inspected.state === "fulfilled") {
            return inspected.value;
        }
    }
    return value;
}

/**
 * @returns whether the given object is a promise.
 * Otherwise it is a fulfilled value.
 */
Q.isPromise = isPromise;
function isPromise(object) {
    return isObject(object) &&
        typeof object.promiseDispatch === "function" &&
        typeof object.inspect === "function";
}

Q.isPromiseAlike = isPromiseAlike;
function isPromiseAlike(object) {
    return isObject(object) && typeof object.then === "function";
}

/**
 * @returns whether the given object is a pending promise, meaning not
 * fulfilled or rejected.
 */
Q.isPending = isPending;
function isPending(object) {
    return isPromise(object) && object.inspect().state === "pending";
}

Promise.prototype.isPending = function () {
    return this.inspect().state === "pending";
};

/**
 * @returns whether the given object is a value or fulfilled
 * promise.
 */
Q.isFulfilled = isFulfilled;
function isFulfilled(object) {
    return !isPromise(object) || object.inspect().state === "fulfilled";
}

Promise.prototype.isFulfilled = function () {
    return this.inspect().state === "fulfilled";
};

/**
 * @returns whether the given object is a rejected promise.
 */
Q.isRejected = isRejected;
function isRejected(object) {
    return isPromise(object) && object.inspect().state === "rejected";
}

Promise.prototype.isRejected = function () {
    return this.inspect().state === "rejected";
};

//// BEGIN UNHANDLED REJECTION TRACKING

// This promise library consumes exceptions thrown in handlers so they can be
// handled by a subsequent promise.  The exceptions get added to this array when
// they are created, and removed when they are handled.  Note that in ES6 or
// shimmed environments, this would naturally be a `Set`.
var unhandledReasons = [];
var unhandledRejections = [];
var trackUnhandledRejections = true;

function resetUnhandledRejections() {
    unhandledReasons.length = 0;
    unhandledRejections.length = 0;

    if (!trackUnhandledRejections) {
        trackUnhandledRejections = true;
    }
}

function trackRejection(promise, reason) {
    if (!trackUnhandledRejections) {
        return;
    }

    unhandledRejections.push(promise);
    if (reason && typeof reason.stack !== "undefined") {
        unhandledReasons.push(reason.stack);
    } else {
        unhandledReasons.push("(no stack) " + reason);
    }
}

function untrackRejection(promise) {
    if (!trackUnhandledRejections) {
        return;
    }

    var at = array_indexOf(unhandledRejections, promise);
    if (at !== -1) {
        unhandledRejections.splice(at, 1);
        unhandledReasons.splice(at, 1);
    }
}

Q.resetUnhandledRejections = resetUnhandledRejections;

Q.getUnhandledReasons = function () {
    // Make a copy so that consumers can't interfere with our internal state.
    return unhandledReasons.slice();
};

Q.stopUnhandledRejectionTracking = function () {
    resetUnhandledRejections();
    trackUnhandledRejections = false;
};

resetUnhandledRejections();

//// END UNHANDLED REJECTION TRACKING

/**
 * Constructs a rejected promise.
 * @param reason value describing the failure
 */
Q.reject = reject;
function reject(reason) {
    var rejection = Promise({
        "when": function (rejected) {
            // note that the error has been handled
            if (rejected) {
                untrackRejection(this);
            }
            return rejected ? rejected(reason) : this;
        }
    }, function fallback() {
        return this;
    }, function inspect() {
        return { state: "rejected", reason: reason };
    });

    // Note that the reason has not been handled.
    trackRejection(rejection, reason);

    return rejection;
}

/**
 * Constructs a fulfilled promise for an immediate reference.
 * @param value immediate reference
 */
Q.fulfill = fulfill;
function fulfill(value) {
    return Promise({
        "when": function () {
            return value;
        },
        "get": function (name) {
            return value[name];
        },
        "set": function (name, rhs) {
            value[name] = rhs;
        },
        "delete": function (name) {
            delete value[name];
        },
        "post": function (name, args) {
            // Mark Miller proposes that post with no name should apply a
            // promised function.
            if (name === null || name === void 0) {
                return value.apply(void 0, args);
            } else {
                return value[name].apply(value, args);
            }
        },
        "apply": function (thisp, args) {
            return value.apply(thisp, args);
        },
        "keys": function () {
            return object_keys(value);
        }
    }, void 0, function inspect() {
        return { state: "fulfilled", value: value };
    });
}

/**
 * Converts thenables to Q promises.
 * @param promise thenable promise
 * @returns a Q promise
 */
function coerce(promise) {
    var deferred = defer();
    nextTick(function () {
        try {
            promise.then(deferred.resolve, deferred.reject, deferred.notify);
        } catch (exception) {
            deferred.reject(exception);
        }
    });
    return deferred.promise;
}

/**
 * Annotates an object such that it will never be
 * transferred away from this process over any promise
 * communication channel.
 * @param object
 * @returns promise a wrapping of that object that
 * additionally responds to the "isDef" message
 * without a rejection.
 */
Q.master = master;
function master(object) {
    return Promise({
        "isDef": function () {}
    }, function fallback(op, args) {
        return dispatch(object, op, args);
    }, function () {
        return Q(object).inspect();
    });
}

/**
 * Spreads the values of a promised array of arguments into the
 * fulfillment callback.
 * @param fulfilled callback that receives variadic arguments from the
 * promised array
 * @param rejected callback that receives the exception if the promise
 * is rejected.
 * @returns a promise for the return value or thrown exception of
 * either callback.
 */
Q.spread = spread;
function spread(value, fulfilled, rejected) {
    return Q(value).spread(fulfilled, rejected);
}

Promise.prototype.spread = function (fulfilled, rejected) {
    return this.all().then(function (array) {
        return fulfilled.apply(void 0, array);
    }, rejected);
};

/**
 * The async function is a decorator for generator functions, turning
 * them into asynchronous generators.  Although generators are only part
 * of the newest ECMAScript 6 drafts, this code does not cause syntax
 * errors in older engines.  This code should continue to work and will
 * in fact improve over time as the language improves.
 *
 * ES6 generators are currently part of V8 version 3.19 with the
 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
 * for longer, but under an older Python-inspired form.  This function
 * works on both kinds of generators.
 *
 * Decorates a generator function such that:
 *  - it may yield promises
 *  - execution will continue when that promise is fulfilled
 *  - the value of the yield expression will be the fulfilled value
 *  - it returns a promise for the return value (when the generator
 *    stops iterating)
 *  - the decorated function returns a promise for the return value
 *    of the generator or the first rejected promise among those
 *    yielded.
 *  - if an error is thrown in the generator, it propagates through
 *    every following yield until it is caught, or until it escapes
 *    the generator function altogether, and is translated into a
 *    rejection for the promise returned by the decorated generator.
 */
Q.async = async;
function async(makeGenerator) {
    return function () {
        // when verb is "send", arg is a value
        // when verb is "throw", arg is an exception
        function continuer(verb, arg) {
            var result;

            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
            // engine that has a deployed base of browsers that support generators.
            // However, SM's generators use the Python-inspired semantics of
            // outdated ES6 drafts.  We would like to support ES6, but we'd also
            // like to make it possible to use generators in deployed browsers, so
            // we also support Python-style generators.  At some point we can remove
            // this block.

            if (typeof StopIteration === "undefined") {
                // ES6 Generators
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    return reject(exception);
                }
                if (result.done) {
                    return result.value;
                } else {
                    return when(result.value, callback, errback);
                }
            } else {
                // SpiderMonkey Generators
                // FIXME: Remove this case when SM does ES6 generators.
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    if (isStopIteration(exception)) {
                        return exception.value;
                    } else {
                        return reject(exception);
                    }
                }
                return when(result, callback, errback);
            }
        }
        var generator = makeGenerator.apply(this, arguments);
        var callback = continuer.bind(continuer, "next");
        var errback = continuer.bind(continuer, "throw");
        return callback();
    };
}

/**
 * The spawn function is a small wrapper around async that immediately
 * calls the generator and also ends the promise chain, so that any
 * unhandled errors are thrown instead of forwarded to the error
 * handler. This is useful because it's extremely common to run
 * generators at the top-level to work with libraries.
 */
Q.spawn = spawn;
function spawn(makeGenerator) {
    Q.done(Q.async(makeGenerator)());
}

// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
/**
 * Throws a ReturnValue exception to stop an asynchronous generator.
 *
 * This interface is a stop-gap measure to support generator return
 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
 * generators like Chromium 29, just use "return" in your generator
 * functions.
 *
 * @param value the return value for the surrounding generator
 * @throws ReturnValue exception with the value.
 * @example
 * // ES6 style
 * Q.async(function* () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      return foo + bar;
 * })
 * // Older SpiderMonkey style
 * Q.async(function () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      Q.return(foo + bar);
 * })
 */
Q["return"] = _return;
function _return(value) {
    throw new QReturnValue(value);
}

/**
 * The promised function decorator ensures that any promise arguments
 * are settled and passed as values (`this` is also settled and passed
 * as a value).  It will also ensure that the result of a function is
 * always a promise.
 *
 * @example
 * var add = Q.promised(function (a, b) {
 *     return a + b;
 * });
 * add(Q(a), Q(B));
 *
 * @param {function} callback The function to decorate
 * @returns {function} a function that has been decorated.
 */
Q.promised = promised;
function promised(callback) {
    return function () {
        return spread([this, all(arguments)], function (self, args) {
            return callback.apply(self, args);
        });
    };
}

/**
 * sends a message to a value in a future turn
 * @param object* the recipient
 * @param op the name of the message operation, e.g., "when",
 * @param args further arguments to be forwarded to the operation
 * @returns result {Promise} a promise for the result of the operation
 */
Q.dispatch = dispatch;
function dispatch(object, op, args) {
    return Q(object).dispatch(op, args);
}

Promise.prototype.dispatch = function (op, args) {
    var self = this;
    var deferred = defer();
    nextTick(function () {
        self.promiseDispatch(deferred.resolve, op, args);
    });
    return deferred.promise;
};

/**
 * Gets the value of a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to get
 * @return promise for the property value
 */
Q.get = function (object, key) {
    return Q(object).dispatch("get", [key]);
};

Promise.prototype.get = function (key) {
    return this.dispatch("get", [key]);
};

/**
 * Sets the value of a property in a future turn.
 * @param object    promise or immediate reference for object object
 * @param name      name of property to set
 * @param value     new value of property
 * @return promise for the return value
 */
Q.set = function (object, key, value) {
    return Q(object).dispatch("set", [key, value]);
};

Promise.prototype.set = function (key, value) {
    return this.dispatch("set", [key, value]);
};

/**
 * Deletes a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to delete
 * @return promise for the return value
 */
Q.del = // XXX legacy
Q["delete"] = function (object, key) {
    return Q(object).dispatch("delete", [key]);
};

Promise.prototype.del = // XXX legacy
Promise.prototype["delete"] = function (key) {
    return this.dispatch("delete", [key]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param value     a value to post, typically an array of
 *                  invocation arguments for promises that
 *                  are ultimately backed with `resolve` values,
 *                  as opposed to those backed with URLs
 *                  wherein the posted value can be any
 *                  JSON serializable object.
 * @return promise for the return value
 */
// bound locally because it is used by other methods
Q.mapply = // XXX As proposed by "Redsandro"
Q.post = function (object, name, args) {
    return Q(object).dispatch("post", [name, args]);
};

Promise.prototype.mapply = // XXX As proposed by "Redsandro"
Promise.prototype.post = function (name, args) {
    return this.dispatch("post", [name, args]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param ...args   array of invocation arguments
 * @return promise for the return value
 */
Q.send = // XXX Mark Miller's proposed parlance
Q.mcall = // XXX As proposed by "Redsandro"
Q.invoke = function (object, name /*...args*/) {
    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
};

Promise.prototype.send = // XXX Mark Miller's proposed parlance
Promise.prototype.mcall = // XXX As proposed by "Redsandro"
Promise.prototype.invoke = function (name /*...args*/) {
    return this.dispatch("post", [name, array_slice(arguments, 1)]);
};

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param args      array of application arguments
 */
Q.fapply = function (object, args) {
    return Q(object).dispatch("apply", [void 0, args]);
};

Promise.prototype.fapply = function (args) {
    return this.dispatch("apply", [void 0, args]);
};

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q["try"] =
Q.fcall = function (object /* ...args*/) {
    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
};

Promise.prototype.fcall = function (/*...args*/) {
    return this.dispatch("apply", [void 0, array_slice(arguments)]);
};

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q.fbind = function (object /*...args*/) {
    var promise = Q(object);
    var args = array_slice(arguments, 1);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};
Promise.prototype.fbind = function (/*...args*/) {
    var promise = this;
    var args = array_slice(arguments);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};

/**
 * Requests the names of the owned properties of a promised
 * object in a future turn.
 * @param object    promise or immediate reference for target object
 * @return promise for the keys of the eventually settled object
 */
Q.keys = function (object) {
    return Q(object).dispatch("keys", []);
};

Promise.prototype.keys = function () {
    return this.dispatch("keys", []);
};

/**
 * Turns an array of promises into a promise for an array.  If any of
 * the promises gets rejected, the whole array is rejected immediately.
 * @param {Array*} an array (or promise for an array) of values (or
 * promises for values)
 * @returns a promise for an array of the corresponding values
 */
// By Mark Miller
// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
Q.all = all;
function all(promises) {
    return when(promises, function (promises) {
        var countDown = 0;
        var deferred = defer();
        array_reduce(promises, function (undefined, promise, index) {
            var snapshot;
            if (
                isPromise(promise) &&
                (snapshot = promise.inspect()).state === "fulfilled"
            ) {
                promises[index] = snapshot.value;
            } else {
                ++countDown;
                when(
                    promise,
                    function (value) {
                        promises[index] = value;
                        if (--countDown === 0) {
                            deferred.resolve(promises);
                        }
                    },
                    deferred.reject,
                    function (progress) {
                        deferred.notify({ index: index, value: progress });
                    }
                );
            }
        }, void 0);
        if (countDown === 0) {
            deferred.resolve(promises);
        }
        return deferred.promise;
    });
}

Promise.prototype.all = function () {
    return all(this);
};

/**
 * Waits for all promises to be settled, either fulfilled or
 * rejected.  This is distinct from `all` since that would stop
 * waiting at the first rejection.  The promise returned by
 * `allResolved` will never be rejected.
 * @param promises a promise for an array (or an array) of promises
 * (or values)
 * @return a promise for an array of promises
 */
Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
function allResolved(promises) {
    return when(promises, function (promises) {
        promises = array_map(promises, Q);
        return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
        })), function () {
            return promises;
        });
    });
}

Promise.prototype.allResolved = function () {
    return allResolved(this);
};

/**
 * @see Promise#allSettled
 */
Q.allSettled = allSettled;
function allSettled(promises) {
    return Q(promises).allSettled();
}

/**
 * Turns an array of promises into a promise for an array of their states (as
 * returned by `inspect`) when they have all settled.
 * @param {Array[Any*]} values an array (or promise for an array) of values (or
 * promises for values)
 * @returns {Array[State]} an array of states for the respective values.
 */
Promise.prototype.allSettled = function () {
    return this.then(function (promises) {
        return all(array_map(promises, function (promise) {
            promise = Q(promise);
            function regardless() {
                return promise.inspect();
            }
            return promise.then(regardless, regardless);
        }));
    });
};

/**
 * Captures the failure of a promise, giving an oportunity to recover
 * with a callback.  If the given promise is fulfilled, the returned
 * promise is fulfilled.
 * @param {Any*} promise for something
 * @param {Function} callback to fulfill the returned promise if the
 * given promise is rejected
 * @returns a promise for the return value of the callback
 */
Q.fail = // XXX legacy
Q["catch"] = function (object, rejected) {
    return Q(object).then(void 0, rejected);
};

Promise.prototype.fail = // XXX legacy
Promise.prototype["catch"] = function (rejected) {
    return this.then(void 0, rejected);
};

/**
 * Attaches a listener that can respond to progress notifications from a
 * promise's originating deferred. This listener receives the exact arguments
 * passed to ``deferred.notify``.
 * @param {Any*} promise for something
 * @param {Function} callback to receive any progress notifications
 * @returns the given promise, unchanged
 */
Q.progress = progress;
function progress(object, progressed) {
    return Q(object).then(void 0, void 0, progressed);
}

Promise.prototype.progress = function (progressed) {
    return this.then(void 0, void 0, progressed);
};

/**
 * Provides an opportunity to observe the settling of a promise,
 * regardless of whether the promise is fulfilled or rejected.  Forwards
 * the resolution to the returned promise when the callback is done.
 * The callback can return a promise to defer completion.
 * @param {Any*} promise
 * @param {Function} callback to observe the resolution of the given
 * promise, takes no arguments.
 * @returns a promise for the resolution of the given promise when
 * ``fin`` is done.
 */
Q.fin = // XXX legacy
Q["finally"] = function (object, callback) {
    return Q(object)["finally"](callback);
};

Promise.prototype.fin = // XXX legacy
Promise.prototype["finally"] = function (callback) {
    callback = Q(callback);
    return this.then(function (value) {
        return callback.fcall().then(function () {
            return value;
        });
    }, function (reason) {
        // TODO attempt to recycle the rejection with "this".
        return callback.fcall().then(function () {
            throw reason;
        });
    });
};

/**
 * Terminates a chain of promises, forcing rejections to be
 * thrown as exceptions.
 * @param {Any*} promise at the end of a chain of promises
 * @returns nothing
 */
Q.done = function (object, fulfilled, rejected, progress) {
    return Q(object).done(fulfilled, rejected, progress);
};

Promise.prototype.done = function (fulfilled, rejected, progress) {
    var onUnhandledError = function (error) {
        // forward to a future turn so that ``when``
        // does not catch it and turn it into a rejection.
        nextTick(function () {
            makeStackTraceLong(error, promise);
            if (Q.onerror) {
                Q.onerror(error);
            } else {
                throw error;
            }
        });
    };

    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
    var promise = fulfilled || rejected || progress ?
        this.then(fulfilled, rejected, progress) :
        this;

    if (typeof process === "object" && process && process.domain) {
        onUnhandledError = process.domain.bind(onUnhandledError);
    }

    promise.then(void 0, onUnhandledError);
};

/**
 * Causes a promise to be rejected if it does not get fulfilled before
 * some milliseconds time out.
 * @param {Any*} promise
 * @param {Number} milliseconds timeout
 * @param {String} custom error message (optional)
 * @returns a promise for the resolution of the given promise if it is
 * fulfilled before the timeout, otherwise rejected.
 */
Q.timeout = function (object, ms, message) {
    return Q(object).timeout(ms, message);
};

Promise.prototype.timeout = function (ms, message) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
        deferred.reject(new Error(message || "Timed out after " + ms + " ms"));
    }, ms);

    this.then(function (value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
    }, function (exception) {
        clearTimeout(timeoutId);
        deferred.reject(exception);
    }, deferred.notify);

    return deferred.promise;
};

/**
 * Returns a promise for the given value (or promised value), some
 * milliseconds after it resolved. Passes rejections immediately.
 * @param {Any*} promise
 * @param {Number} milliseconds
 * @returns a promise for the resolution of the given promise after milliseconds
 * time has elapsed since the resolution of the given promise.
 * If the given promise rejects, that is passed immediately.
 */
Q.delay = function (object, timeout) {
    if (timeout === void 0) {
        timeout = object;
        object = void 0;
    }
    return Q(object).delay(timeout);
};

Promise.prototype.delay = function (timeout) {
    return this.then(function (value) {
        var deferred = defer();
        setTimeout(function () {
            deferred.resolve(value);
        }, timeout);
        return deferred.promise;
    });
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided as an array, and returns a promise.
 *
 *      Q.nfapply(FS.readFile, [__filename])
 *      .then(function (content) {
 *      })
 *
 */
Q.nfapply = function (callback, args) {
    return Q(callback).nfapply(args);
};

Promise.prototype.nfapply = function (args) {
    var deferred = defer();
    var nodeArgs = array_slice(args);
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided individually, and returns a promise.
 * @example
 * Q.nfcall(FS.readFile, __filename)
 * .then(function (content) {
 * })
 *
 */
Q.nfcall = function (callback /*...args*/) {
    var args = array_slice(arguments, 1);
    return Q(callback).nfapply(args);
};

Promise.prototype.nfcall = function (/*...args*/) {
    var nodeArgs = array_slice(arguments);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Wraps a NodeJS continuation passing function and returns an equivalent
 * version that returns a promise.
 * @example
 * Q.nfbind(FS.readFile, __filename)("utf-8")
 * .then(console.log)
 * .done()
 */
Q.nfbind =
Q.denodeify = function (callback /*...args*/) {
    var baseArgs = array_slice(arguments, 1);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(callback).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nfbind =
Promise.prototype.denodeify = function (/*...args*/) {
    var args = array_slice(arguments);
    args.unshift(this);
    return Q.denodeify.apply(void 0, args);
};

Q.nbind = function (callback, thisp /*...args*/) {
    var baseArgs = array_slice(arguments, 2);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        function bound() {
            return callback.apply(thisp, arguments);
        }
        Q(bound).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nbind = function (/*thisp, ...args*/) {
    var args = array_slice(arguments, 0);
    args.unshift(this);
    return Q.nbind.apply(void 0, args);
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback with a given array of arguments, plus a provided callback.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param {Array} args arguments to pass to the method; the callback
 * will be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nmapply = // XXX As proposed by "Redsandro"
Q.npost = function (object, name, args) {
    return Q(object).npost(name, args);
};

Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
Promise.prototype.npost = function (name, args) {
    var nodeArgs = array_slice(args || []);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback, forwarding the given variadic arguments, plus a provided
 * callback argument.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param ...args arguments to pass to the method; the callback will
 * be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nsend = // XXX Based on Mark Miller's proposed "send"
Q.nmcall = // XXX Based on "Redsandro's" proposal
Q.ninvoke = function (object, name /*...args*/) {
    var nodeArgs = array_slice(arguments, 2);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
Promise.prototype.ninvoke = function (name /*...args*/) {
    var nodeArgs = array_slice(arguments, 1);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * If a function would like to support both Node continuation-passing-style and
 * promise-returning-style, it can end its internal promise chain with
 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
 * elects to use a nodeback, the result will be sent there.  If they do not
 * pass a nodeback, they will receive the result promise.
 * @param object a result (or a promise for a result)
 * @param {Function} nodeback a Node.js-style callback
 * @returns either the promise or nothing
 */
Q.nodeify = nodeify;
function nodeify(object, nodeback) {
    return Q(object).nodeify(nodeback);
}

Promise.prototype.nodeify = function (nodeback) {
    if (nodeback) {
        this.then(function (value) {
            nextTick(function () {
                nodeback(null, value);
            });
        }, function (error) {
            nextTick(function () {
                nodeback(error);
            });
        });
    } else {
        return this;
    }
};

// All code before this point will be filtered from stack traces.
var qEndingLine = captureLine();

return Q;

});

}).call(this,require("FWaASH"))
},{"FWaASH":49}],78:[function(require,module,exports){

/*!
 * knox - auth
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var crypto = require('crypto')
  , parse = require('url').parse;

/**
 * Valid keys.
 */

var keys = [
    'acl'
  , 'location'
  , 'logging'
  , 'notification'
  , 'partNumber'
  , 'policy'
  , 'requestPayment'
  , 'torrent'
  , 'uploadId'
  , 'uploads'
  , 'versionId'
  , 'versioning'
  , 'versions'
  , 'website'
];

/**
 * Return an "Authorization" header value with the given `options`
 * in the form of "AWS <key>:<signature>"
 *
 * @param {Object} options
 * @return {String}
 * @api private
 */

exports.authorization = function(options){
  return 'AWS ' + options.key + ':' + exports.sign(options);
};

/**
 * Simple HMAC-SHA1 Wrapper
 *
 * @param {Object} options
 * @return {String}
 * @api private
 */ 

exports.hmacSha1 = function(options){
  return crypto.createHmac('sha1', options.secret).update(options.message).digest('base64');
};

/**
 * Create a base64 sha1 HMAC for `options`. 
 * 
 * @param {Object} options
 * @return {String}
 * @api private
 */

exports.sign = function(options){
  options.message = exports.stringToSign(options);
  return exports.hmacSha1(options);
};

/**
 * Create a base64 sha1 HMAC for `options`. 
 *
 * Specifically to be used with S3 presigned URLs
 * 
 * @param {Object} options
 * @return {String}
 * @api private
 */

exports.signQuery = function(options){
  options.message = exports.queryStringToSign(options);
  return exports.hmacSha1(options);
};

/**
 * Return a string for sign() with the given `options`.
 *
 * Spec:
 * 
 *    <verb>\n
 *    <md5>\n
 *    <content-type>\n
 *    <date>\n
 *    [headers\n]
 *    <resource>
 *
 * @param {Object} options
 * @return {String}
 * @api private
 */

exports.stringToSign = function(options){
  var headers = options.amazonHeaders || '';
  if (headers) headers += '\n';
  return [
      options.verb
    , options.md5
    , options.contentType
    , options.date.toUTCString()
    , headers + options.resource
  ].join('\n');
};

/**
 * Return a string for sign() with the given `options`, but is meant exclusively
 * for S3 presigned URLs
 *
 * Spec:
 * 
 *    <date>\n
 *    <resource>
 *
 * @param {Object} options
 * @return {String}
 * @api private
 */

exports.queryStringToSign = function(options){
  return 'GET\n\n\n' +
    options.date + '\n' +
    options.resource;
};

/**
 * Perform the following:
 *
 *  - ignore non-amazon headers
 *  - lowercase fields
 *  - sort lexicographically
 *  - trim whitespace between ":"
 *  - join with newline
 *
 * @param {Object} headers
 * @return {String}
 * @api private
 */

exports.canonicalizeHeaders = function(headers){
  var buf = []
    , fields = Object.keys(headers);
  for (var i = 0, len = fields.length; i < len; ++i) {
    var field = fields[i]
      , val = headers[field]
      , field = field.toLowerCase();
    if (0 !== field.indexOf('x-amz')) continue;
    buf.push(field + ':' + val);
  }
  return buf.sort().join('\n');
};

/**
 * Perform the following:
 *
 *  - ignore non sub-resources
 *  - sort lexicographically
 *
 * @param {String} resource
 * @return {String}
 * @api private
 */

exports.canonicalizeResource = function(resource){
  var url = parse(resource, true)
    , path = url.pathname
    , buf = [];

  Object.keys(url.query).forEach(function(key){
    if (!~keys.indexOf(key)) return;
    var val = '' == url.query[key] ? '' : '=' + encodeURIComponent(url.query[key]);
    buf.push(key + val);
  });

  return path + (buf.length
    ? '?' + buf.sort().join('&')
    : '');
};

},{"crypto":35,"url":68}],79:[function(require,module,exports){
module.exports = ForeverAgent
ForeverAgent.SSL = ForeverAgentSSL

var util = require('util')
  , Agent = require('http').Agent
  , net = require('net')
  , tls = require('tls')
  , AgentSSL = require('https').Agent

function ForeverAgent(options) {
  var self = this
  self.options = options || {}
  self.requests = {}
  self.sockets = {}
  self.freeSockets = {}
  self.maxSockets = self.options.maxSockets || Agent.defaultMaxSockets
  self.minSockets = self.options.minSockets || ForeverAgent.defaultMinSockets
  self.on('free', function(socket, host, port) {
    var name = host + ':' + port
    if (self.requests[name] && self.requests[name].length) {
      self.requests[name].shift().onSocket(socket)
    } else if (self.sockets[name].length < self.minSockets) {
      if (!self.freeSockets[name]) self.freeSockets[name] = []
      self.freeSockets[name].push(socket)
      
      // if an error happens while we don't use the socket anyway, meh, throw the socket away
      function onIdleError() {
        socket.destroy()
      }
      socket._onIdleError = onIdleError
      socket.on('error', onIdleError)
    } else {
      // If there are no pending requests just destroy the
      // socket and it will get removed from the pool. This
      // gets us out of timeout issues and allows us to
      // default to Connection:keep-alive.
      socket.destroy();
    }
  })

}
util.inherits(ForeverAgent, Agent)

ForeverAgent.defaultMinSockets = 5


ForeverAgent.prototype.createConnection = net.createConnection
ForeverAgent.prototype.addRequestNoreuse = Agent.prototype.addRequest
ForeverAgent.prototype.addRequest = function(req, host, port) {
  var name = host + ':' + port
  if (this.freeSockets[name] && this.freeSockets[name].length > 0 && !req.useChunkedEncodingByDefault) {
    var idleSocket = this.freeSockets[name].pop()
    idleSocket.removeListener('error', idleSocket._onIdleError)
    delete idleSocket._onIdleError
    req._reusedSocket = true
    req.onSocket(idleSocket)
  } else {
    this.addRequestNoreuse(req, host, port)
  }
}

ForeverAgent.prototype.removeSocket = function(s, name, host, port) {
  if (this.sockets[name]) {
    var index = this.sockets[name].indexOf(s);
    if (index !== -1) {
      this.sockets[name].splice(index, 1);
    }
  } else if (this.sockets[name] && this.sockets[name].length === 0) {
    // don't leak
    delete this.sockets[name];
    delete this.requests[name];
  }
  
  if (this.freeSockets[name]) {
    var index = this.freeSockets[name].indexOf(s)
    if (index !== -1) {
      this.freeSockets[name].splice(index, 1)
      if (this.freeSockets[name].length === 0) {
        delete this.freeSockets[name]
      }
    }
  }

  if (this.requests[name] && this.requests[name].length) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(name, host, port).emit('free');
  }
}

function ForeverAgentSSL (options) {
  ForeverAgent.call(this, options)
}
util.inherits(ForeverAgentSSL, ForeverAgent)

ForeverAgentSSL.prototype.createConnection = createConnectionSSL
ForeverAgentSSL.prototype.addRequestNoreuse = AgentSSL.prototype.addRequest

function createConnectionSSL (port, host, options) {
  options.port = port
  options.host = host
  return tls.connect(options)
}

},{"http":72,"https":46,"net":25,"tls":25,"util":70}],80:[function(require,module,exports){
(function (process,Buffer){
// Copyright 2010-2012 Mikeal Rogers
//
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//        http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

var http = require('http')
  , https = false
  , tls = false
  , url = require('url')
  , util = require('util')
  , stream = require('stream')
  , qs = require('querystring')
  , mimetypes = require('./mimetypes')
  , oauth = require('./oauth')
  , uuid = require('./uuid')
  , ForeverAgent = require('./forever')
  , Cookie = require('./vendor/cookie')
  , CookieJar = require('./vendor/cookie/jar')
  , cookieJar = new CookieJar
  , tunnel = require('./tunnel')
  , aws = require('./aws')
  ;
  
if (process.logging) {
  var log = process.logging('request')
}

try {
  https = require('https')
} catch (e) {}

try {
  tls = require('tls')
} catch (e) {}

function toBase64 (str) {
  return (new Buffer(str || "", "ascii")).toString("base64")
}

// Hacky fix for pre-0.4.4 https
if (https && !https.Agent) {
  https.Agent = function (options) {
    http.Agent.call(this, options)
  }
  util.inherits(https.Agent, http.Agent)
  https.Agent.prototype._getConnection = function (host, port, cb) {
    var s = tls.connect(port, host, this.options, function () {
      // do other checks here?
      if (cb) cb()
    })
    return s
  }
}

function isReadStream (rs) {
  if (rs.readable && rs.path && rs.mode) {
    return true
  }
}

function copy (obj) {
  var o = {}
  Object.keys(obj).forEach(function (i) {
    o[i] = obj[i]
  })
  return o
}

var isUrl = /^https?:/

var globalPool = {}

function Request (options) {
  stream.Stream.call(this)
  this.readable = true
  this.writable = true

  if (typeof options === 'string') {
    options = {uri:options}
  }
  
  var reserved = Object.keys(Request.prototype)
  for (var i in options) {
    if (reserved.indexOf(i) === -1) {
      this[i] = options[i]
    } else {
      if (typeof options[i] === 'function') {
        delete options[i]
      }
    }
  }
  options = copy(options)
  
  this.init(options)
}
util.inherits(Request, stream.Stream)
Request.prototype.init = function (options) {
  var self = this
  
  if (!options) options = {}
  
  if (!self.pool && self.pool !== false) self.pool = globalPool
  self.dests = []
  self.__isRequestRequest = true
  
  // Protect against double callback
  if (!self._callback && self.callback) {
    self._callback = self.callback
    self.callback = function () {
      if (self._callbackCalled) return // Print a warning maybe?
      self._callback.apply(self, arguments)
      self._callbackCalled = true
    }
    self.on('error', self.callback.bind())
    self.on('complete', self.callback.bind(self, null))
  }

  if (self.url) {
    // People use this property instead all the time so why not just support it.
    self.uri = self.url
    delete self.url
  }

  if (!self.uri) {
    throw new Error("options.uri is a required argument")
  } else {
    if (typeof self.uri == "string") self.uri = url.parse(self.uri)
  }
  if (self.proxy) {
    if (typeof self.proxy == 'string') self.proxy = url.parse(self.proxy)

    // do the HTTP CONNECT dance using koichik/node-tunnel
    if (http.globalAgent && self.uri.protocol === "https:") {
      self.tunnel = true
      var tunnelFn = self.proxy.protocol === "http:"
                   ? tunnel.httpsOverHttp : tunnel.httpsOverHttps

      var tunnelOptions = { proxy: { host: self.proxy.hostname
                                   , port: +self.proxy.port 
                                   , proxyAuth: self.proxy.auth }
                          , ca: this.ca }

      self.agent = tunnelFn(tunnelOptions)
      self.tunnel = true
    }
  }

  if (!self.uri.host || !self.uri.pathname) {
    // Invalid URI: it may generate lot of bad errors, like "TypeError: Cannot call method 'indexOf' of undefined" in CookieJar
    // Detect and reject it as soon as possible
    var faultyUri = url.format(self.uri)
    var message = 'Invalid URI "' + faultyUri + '"'
    if (Object.keys(options).length === 0) {
      // No option ? This can be the sign of a redirect
      // As this is a case where the user cannot do anything (he didn't call request directly with this URL)
      // he should be warned that it can be caused by a redirection (can save some hair)
      message += '. This can be caused by a crappy redirection.'
    }
    self.emit('error', new Error(message))
    return // This error was fatal
  }

  self._redirectsFollowed = self._redirectsFollowed || 0
  self.maxRedirects = (self.maxRedirects !== undefined) ? self.maxRedirects : 10
  self.followRedirect = (self.followRedirect !== undefined) ? self.followRedirect : true
  self.followAllRedirects = (self.followAllRedirects !== undefined) ? self.followAllRedirects : false;
  if (self.followRedirect || self.followAllRedirects)
    self.redirects = self.redirects || []

  self.headers = self.headers ? copy(self.headers) : {}

  self.setHost = false
  if (!self.headers.host) {
    self.headers.host = self.uri.hostname
    if (self.uri.port) {
      if ( !(self.uri.port === 80 && self.uri.protocol === 'http:') &&
           !(self.uri.port === 443 && self.uri.protocol === 'https:') )
      self.headers.host += (':'+self.uri.port)
    }
    self.setHost = true
  }
  
  self.jar(self._jar || options.jar)

  if (!self.uri.pathname) {self.uri.pathname = '/'}
  if (!self.uri.port) {
    if (self.uri.protocol == 'http:') {self.uri.port = 80}
    else if (self.uri.protocol == 'https:') {self.uri.port = 443}
  }

  if (self.proxy && !self.tunnel) {
    self.port = self.proxy.port
    self.host = self.proxy.hostname
  } else {
    self.port = self.uri.port
    self.host = self.uri.hostname
  }

  self.clientErrorHandler = function (error) {
    if (self._aborted) return
    
    if (self.setHost) delete self.headers.host
    if (self.req._reusedSocket && error.code === 'ECONNRESET'
        && self.agent.addRequestNoreuse) {
      self.agent = { addRequest: self.agent.addRequestNoreuse.bind(self.agent) }
      self.start()
      self.req.end()
      return
    }
    if (self.timeout && self.timeoutTimer) {
      clearTimeout(self.timeoutTimer)
      self.timeoutTimer = null
    }
    self.emit('error', error)
  }

  if (options.form) {
    self.form(options.form)
  }

  if (options.oauth) {
    self.oauth(options.oauth)
  }
  
  if (options.aws) {
    self.aws(options.aws)
  }

  if (self.uri.auth && !self.headers.authorization) {
    self.headers.authorization = "Basic " + toBase64(self.uri.auth.split(':').map(function(item){ return qs.unescape(item)}).join(':'))
  }
  if (self.proxy && self.proxy.auth && !self.headers['proxy-authorization'] && !self.tunnel) {
    self.headers['proxy-authorization'] = "Basic " + toBase64(self.proxy.auth.split(':').map(function(item){ return qs.unescape(item)}).join(':'))
  }

  if (options.qs) self.qs(options.qs)

  if (self.uri.path) {
    self.path = self.uri.path
  } else {
    self.path = self.uri.pathname + (self.uri.search || "")
  }

  if (self.path.length === 0) self.path = '/'

  if (self.proxy && !self.tunnel) self.path = (self.uri.protocol + '//' + self.uri.host + self.path)

  if (options.json) {
    self.json(options.json)
  } else if (options.multipart) {
    self.boundary = uuid()
    self.multipart(options.multipart)
  }

  if (self.body) {
    var length = 0
    if (!Buffer.isBuffer(self.body)) {
      if (Array.isArray(self.body)) {
        for (var i = 0; i < self.body.length; i++) {
          length += self.body[i].length
        }
      } else {
        self.body = new Buffer(self.body)
        length = self.body.length
      }
    } else {
      length = self.body.length
    }
    if (length) {
      self.headers['content-length'] = length
    } else {
      throw new Error('Argument error, options.body.')
    }
  }

  var protocol = self.proxy && !self.tunnel ? self.proxy.protocol : self.uri.protocol
    , defaultModules = {'http:':http, 'https:':https}
    , httpModules = self.httpModules || {}
    ;
  self.httpModule = httpModules[protocol] || defaultModules[protocol]

  if (!self.httpModule) throw new Error("Invalid protocol")

  if (options.ca) self.ca = options.ca

  if (!self.agent) {
    if (options.agentOptions) self.agentOptions = options.agentOptions

    if (options.agentClass) {
      self.agentClass = options.agentClass
    } else if (options.forever) {
      self.agentClass = protocol === 'http:' ? ForeverAgent : ForeverAgent.SSL
    } else {
      self.agentClass = self.httpModule.Agent
    }
  }

  if (self.pool === false) {
    self.agent = false
  } else {
    self.agent = self.agent || self.getAgent()
    if (self.maxSockets) {
      // Don't use our pooling if node has the refactored client
      self.agent.maxSockets = self.maxSockets
    }
    if (self.pool.maxSockets) {
      // Don't use our pooling if node has the refactored client
      self.agent.maxSockets = self.pool.maxSockets
    }
  }

  self.once('pipe', function (src) {
    if (self.ntick) throw new Error("You cannot pipe to this stream after the first nextTick() after creation of the request stream.")
    self.src = src
    if (isReadStream(src)) {
      if (!self.headers['content-type'] && !self.headers['Content-Type'])
        self.headers['content-type'] = mimetypes.lookup(src.path.slice(src.path.lastIndexOf('.')+1))
    } else {
      if (src.headers) {
        for (var i in src.headers) {
          if (!self.headers[i]) {
            self.headers[i] = src.headers[i]
          }
        }
      }
      if (src.method && !self.method) {
        self.method = src.method
      }
    }

    self.on('pipe', function () {
      console.error("You have already piped to this stream. Pipeing twice is likely to break the request.")
    })
  })

  process.nextTick(function () {
    if (self._aborted) return
    
    if (self.body) {
      if (Array.isArray(self.body)) {
        self.body.forEach(function (part) {
          self.write(part)
        })
      } else {
        self.write(self.body)
      }
      self.end()
    } else if (self.requestBodyStream) {
      console.warn("options.requestBodyStream is deprecated, please pass the request object to stream.pipe.")
      self.requestBodyStream.pipe(self)
    } else if (!self.src) {
      if (self.method !== 'GET' && typeof self.method !== 'undefined') {
        self.headers['content-length'] = 0;
      }
      self.end();
    }
    self.ntick = true
  })
}

Request.prototype.getAgent = function () {
  var Agent = this.agentClass
  var options = {}
  if (this.agentOptions) {
    for (var i in this.agentOptions) {
      options[i] = this.agentOptions[i]
    }
  }
  if (this.ca) options.ca = this.ca

  var poolKey = ''

  // different types of agents are in different pools
  if (Agent !== this.httpModule.Agent) {
    poolKey += Agent.name
  }

  if (!this.httpModule.globalAgent) {
    // node 0.4.x
    options.host = this.host
    options.port = this.port
    if (poolKey) poolKey += ':'
    poolKey += this.host + ':' + this.port
  }

  if (options.ca) {
    if (poolKey) poolKey += ':'
    poolKey += options.ca
  }

  if (!poolKey && Agent === this.httpModule.Agent && this.httpModule.globalAgent) {
    // not doing anything special.  Use the globalAgent
    return this.httpModule.globalAgent
  }

  // already generated an agent for this setting
  if (this.pool[poolKey]) return this.pool[poolKey]

  return this.pool[poolKey] = new Agent(options)
}

Request.prototype.start = function () {
  var self = this
  
  if (self._aborted) return
  
  self._started = true
  self.method = self.method || 'GET'
  self.href = self.uri.href
  if (log) log('%method %href', self)
  
  if (self.src && self.src.stat && self.src.stat.size) {
    self.headers['content-length'] = self.src.stat.size
  }
  if (self._aws) {
    self.aws(self._aws, true)
  }
  
  self.req = self.httpModule.request(self, function (response) {
    if (self._aborted) return
    if (self._paused) response.pause()
    
    self.response = response
    response.request = self
    response.toJSON = toJSON

    if (self.httpModule === https &&
        self.strictSSL &&
        !response.client.authorized) {
      var sslErr = response.client.authorizationError
      self.emit('error', new Error('SSL Error: '+ sslErr))
      return
    }

    if (self.setHost) delete self.headers.host
    if (self.timeout && self.timeoutTimer) {
      clearTimeout(self.timeoutTimer)
      self.timeoutTimer = null
    }  
    
    var addCookie = function (cookie) {
      if (self._jar) self._jar.add(new Cookie(cookie))
      else cookieJar.add(new Cookie(cookie))
    }

    if (response.headers['set-cookie'] && (!self._disableCookies)) {
      if (Array.isArray(response.headers['set-cookie'])) response.headers['set-cookie'].forEach(addCookie)
      else addCookie(response.headers['set-cookie'])
    }

    if (response.statusCode >= 300 && response.statusCode < 400  &&
        (self.followAllRedirects ||
         (self.followRedirect && (self.method !== 'PUT' && self.method !== 'POST' && self.method !== 'DELETE'))) &&
        response.headers.location) {
      if (self._redirectsFollowed >= self.maxRedirects) {
        self.emit('error', new Error("Exceeded maxRedirects. Probably stuck in a redirect loop."))
        return
      }
      self._redirectsFollowed += 1

      if (!isUrl.test(response.headers.location)) {
        response.headers.location = url.resolve(self.uri.href, response.headers.location)
      }
      self.uri = response.headers.location
      self.redirects.push(
        { statusCode : response.statusCode
        , redirectUri: response.headers.location 
        }
      )
      if (self.followAllRedirects) self.method = 'GET'
      // self.method = 'GET'; // Force all redirects to use GET || commented out fixes #215
      delete self.req
      delete self.agent
      delete self._started
      delete self.body
      if (self.headers) {
        delete self.headers.host
      }
      if (log) log('Redirect to %uri', self)
      self.init()
      return // Ignore the rest of the response
    } else {
      self._redirectsFollowed = self._redirectsFollowed || 0
      // Be a good stream and emit end when the response is finished.
      // Hack to emit end on close because of a core bug that never fires end
      response.on('close', function () {
        if (!self._ended) self.response.emit('end')
      })

      if (self.encoding) {
        if (self.dests.length !== 0) {
          console.error("Ingoring encoding parameter as this stream is being piped to another stream which makes the encoding option invalid.")
        } else {
          response.setEncoding(self.encoding)
        }
      }

      self.dests.forEach(function (dest) {
        self.pipeDest(dest)
      })

      response.on("data", function (chunk) {
        self._destdata = true
        self.emit("data", chunk)
      })
      response.on("end", function (chunk) {
        self._ended = true
        self.emit("end", chunk)
      })
      response.on("close", function () {self.emit("close")})

      self.emit('response', response)

      if (self.callback) {
        var buffer = []
        var bodyLen = 0
        self.on("data", function (chunk) {
          buffer.push(chunk)
          bodyLen += chunk.length
        })
        self.on("end", function () {
          if (self._aborted) return
          
          if (buffer.length && Buffer.isBuffer(buffer[0])) {
            var body = new Buffer(bodyLen)
            var i = 0
            buffer.forEach(function (chunk) {
              chunk.copy(body, i, 0, chunk.length)
              i += chunk.length
            })
            if (self.encoding === null) {
              response.body = body
            } else {
              response.body = body.toString()
            }
          } else if (buffer.length) {
            response.body = buffer.join('')
          }

          if (self._json) {
            try {
              response.body = JSON.parse(response.body)
            } catch (e) {}
          }
          
          self.emit('complete', response, response.body)
        })
      }
    }
  })

  if (self.timeout && !self.timeoutTimer) {
    self.timeoutTimer = setTimeout(function () {
      self.req.abort()
      var e = new Error("ETIMEDOUT")
      e.code = "ETIMEDOUT"
      self.emit("error", e)
    }, self.timeout)
    
    // Set additional timeout on socket - in case if remote
    // server freeze after sending headers
    if (self.req.setTimeout) { // only works on node 0.6+
      self.req.setTimeout(self.timeout, function () {
        if (self.req) {
          self.req.abort()
          var e = new Error("ESOCKETTIMEDOUT")
          e.code = "ESOCKETTIMEDOUT"
          self.emit("error", e)
        }
      })
    }
  }
  
  self.req.on('error', self.clientErrorHandler)
  self.req.on('drain', function() {
    self.emit('drain')
  })
  
  self.emit('request', self.req)
}

Request.prototype.abort = function () {
  this._aborted = true;
  
  if (this.req) {
    this.req.abort()
  }
  else if (this.response) {
    this.response.abort()
  }
  
  this.emit("abort")
}

Request.prototype.pipeDest = function (dest) {
  var response = this.response
  // Called after the response is received
  if (dest.headers) {
    dest.headers['content-type'] = response.headers['content-type']
    if (response.headers['content-length']) {
      dest.headers['content-length'] = response.headers['content-length']
    }
  }
  if (dest.setHeader) {
    for (var i in response.headers) {
      dest.setHeader(i, response.headers[i])
    }
    dest.statusCode = response.statusCode
  }
  if (this.pipefilter) this.pipefilter(response, dest)
}

// Composable API
Request.prototype.setHeader = function (name, value, clobber) {
  if (clobber === undefined) clobber = true
  if (clobber || !this.headers.hasOwnProperty(name)) this.headers[name] = value
  else this.headers[name] += ',' + value
  return this
}
Request.prototype.setHeaders = function (headers) {
  for (var i in headers) {this.setHeader(i, headers[i])}
  return this
}
Request.prototype.qs = function (q, clobber) {
  var base
  if (!clobber && this.uri.query) base = qs.parse(this.uri.query)
  else base = {}
  
  for (var i in q) {
    base[i] = q[i]
  }
  
  this.uri = url.parse(this.uri.href.split('?')[0] + '?' + qs.stringify(base))
  this.url = this.uri
  
  return this
}
Request.prototype.form = function (form) {
  this.headers['content-type'] = 'application/x-www-form-urlencoded; charset=utf-8'
  this.body = qs.stringify(form).toString('utf8')
  return this
}
Request.prototype.multipart = function (multipart) {
  var self = this
  self.body = []

  if (!self.headers['content-type']) {
    self.headers['content-type'] = 'multipart/related; boundary=' + self.boundary;
  } else {
    self.headers['content-type'] = self.headers['content-type'].split(';')[0] + '; boundary=' + self.boundary;
  }

  console.log('boundary >> ' + self.boundary)

  if (!multipart.forEach) throw new Error('Argument error, options.multipart.')

  multipart.forEach(function (part) {
    var body = part.body
    if(body == null) throw Error('Body attribute missing in multipart.')
    delete part.body
    var preamble = '--' + self.boundary + '\r\n'
    Object.keys(part).forEach(function (key) {
      preamble += key + ': ' + part[key] + '\r\n'
    })
    preamble += '\r\n'
    self.body.push(new Buffer(preamble))
    self.body.push(new Buffer(body))
    self.body.push(new Buffer('\r\n'))
  })
  self.body.push(new Buffer('--' + self.boundary + '--'))
  return self
}
Request.prototype.json = function (val) {
  this.setHeader('content-type', 'application/json')
  this.setHeader('accept', 'application/json')
  this._json = true
  if (typeof val === 'boolean') {
    if (typeof this.body === 'object') this.body = JSON.stringify(this.body)
  } else {
    this.body = JSON.stringify(val)
  }
  return this
}
Request.prototype.aws = function (opts, now) {
  if (!now) {
    this._aws = opts
    return this
  }
  var date = new Date()
  this.setHeader('date', date.toUTCString())
  this.setHeader('authorization', aws.authorization(
    { key: opts.key
    , secret: opts.secret
    , verb: this.method
    , date: date
    , resource: aws.canonicalizeResource('/' + opts.bucket + this.path)
    , contentType: this.headers['content-type'] || ''
    , md5: this.headers['content-md5'] || ''
    , amazonHeaders: aws.canonicalizeHeaders(this.headers)
    }
  ))
  
  return this
}

Request.prototype.oauth = function (_oauth) {
  var form
  if (this.headers['content-type'] && 
      this.headers['content-type'].slice(0, 'application/x-www-form-urlencoded'.length) ===
        'application/x-www-form-urlencoded' 
     ) {
    form = qs.parse(this.body)
  }
  if (this.uri.query) {
    form = qs.parse(this.uri.query)
  } 
  if (!form) form = {}
  var oa = {}
  for (var i in form) oa[i] = form[i]
  for (var i in _oauth) oa['oauth_'+i] = _oauth[i]
  if (!oa.oauth_version) oa.oauth_version = '1.0'
  if (!oa.oauth_timestamp) oa.oauth_timestamp = Math.floor( (new Date()).getTime() / 1000 ).toString()
  if (!oa.oauth_nonce) oa.oauth_nonce = uuid().replace(/-/g, '')
  
  oa.oauth_signature_method = 'HMAC-SHA1'
  
  var consumer_secret = oa.oauth_consumer_secret
  delete oa.oauth_consumer_secret
  var token_secret = oa.oauth_token_secret
  delete oa.oauth_token_secret
  
  var baseurl = this.uri.protocol + '//' + this.uri.host + this.uri.pathname
  var signature = oauth.hmacsign(this.method, baseurl, oa, consumer_secret, token_secret)
  
  // oa.oauth_signature = signature
  for (var i in form) {
    if ( i.slice(0, 'oauth_') in _oauth) {
      // skip 
    } else {
      delete oa['oauth_'+i]
    }
  }
  this.headers.Authorization = 
    'OAuth '+Object.keys(oa).sort().map(function (i) {return i+'="'+oauth.rfc3986(oa[i])+'"'}).join(',')
  this.headers.Authorization += ',oauth_signature="'+oauth.rfc3986(signature)+'"'
  return this
}
Request.prototype.jar = function (jar) {
  var cookies
  
  if (this._redirectsFollowed === 0) {
    this.originalCookieHeader = this.headers.cookie
  }
  
  if (jar === false) {
    // disable cookies
    cookies = false;
    this._disableCookies = true;
  } else if (jar) {
    // fetch cookie from the user defined cookie jar
    cookies = jar.get({ url: this.uri.href })
  } else {
    // fetch cookie from the global cookie jar
    cookies = cookieJar.get({ url: this.uri.href })
  }
  
  if (cookies && cookies.length) {
    var cookieString = cookies.map(function (c) {
      return c.name + "=" + c.value
    }).join("; ")

    if (this.originalCookieHeader) {
      // Don't overwrite existing Cookie header
      this.headers.cookie = this.originalCookieHeader + '; ' + cookieString
    } else {
      this.headers.cookie = cookieString
    }
  }
  this._jar = jar
  return this
}


// Stream API
Request.prototype.pipe = function (dest, opts) {
  if (this.response) {
    if (this._destdata) {
      throw new Error("You cannot pipe after data has been emitted from the response.")
    } else if (this._ended) {
      throw new Error("You cannot pipe after the response has been ended.")
    } else {
      stream.Stream.prototype.pipe.call(this, dest, opts)
      this.pipeDest(dest)
      return dest
    }
  } else {
    this.dests.push(dest)
    stream.Stream.prototype.pipe.call(this, dest, opts)
    return dest
  }
}
Request.prototype.write = function () {
  if (!this._started) this.start()
  return this.req.write.apply(this.req, arguments)
}
Request.prototype.end = function (chunk) {
  if (chunk) this.write(chunk)
  if (!this._started) this.start()
  this.req.end()
}
Request.prototype.pause = function () {
  if (!this.response) this._paused = true
  else this.response.pause.apply(this.response, arguments)
}
Request.prototype.resume = function () {
  if (!this.response) this._paused = false
  else this.response.resume.apply(this.response, arguments)
}
Request.prototype.destroy = function () {
  if (!this._ended) this.end()
}

// organize params for post, put, head, del
function initParams(uri, options, callback) {
  if ((typeof options === 'function') && !callback) callback = options;
  if (options && typeof options === 'object') {
    options.uri = uri;
  } else if (typeof uri === 'string') {
    options = {uri:uri};
  } else {
    options = uri;
    uri = options.uri;
  }
  return { uri: uri, options: options, callback: callback };
}

function request (uri, options, callback) {
  if (typeof uri === 'undefined') throw new Error('undefined is not a valid uri or options object.')
  if ((typeof options === 'function') && !callback) callback = options;
  if (options && typeof options === 'object') {
    options.uri = uri;
  } else if (typeof uri === 'string') {
    options = {uri:uri};
  } else {
    options = uri;
  }

  if (callback) options.callback = callback;
  var r = new Request(options)
  return r
}

module.exports = request

request.defaults = function (options) {
  var def = function (method) {
    var d = function (uri, opts, callback) {
      var params = initParams(uri, opts, callback);
      for (var i in options) {
        if (params.options[i] === undefined) params.options[i] = options[i]
      }
      return method(params.options, params.callback)
    }
    return d
  }
  var de = def(request)
  de.get = def(request.get)
  de.post = def(request.post)
  de.put = def(request.put)
  de.head = def(request.head)
  de.del = def(request.del)
  de.cookie = def(request.cookie)
  de.jar = def(request.jar)
  return de
}

request.forever = function (agentOptions, optionsArg) {
  var options = {}
  if (optionsArg) {
    for (option in optionsArg) {
      options[option] = optionsArg[option]
    }
  }
  if (agentOptions) options.agentOptions = agentOptions
  options.forever = true
  return request.defaults(options)
}

request.get = request
request.post = function (uri, options, callback) {
  var params = initParams(uri, options, callback);
  params.options.method = 'POST';
  return request(params.uri || null, params.options, params.callback)
}
request.put = function (uri, options, callback) {
  var params = initParams(uri, options, callback);
  params.options.method = 'PUT'
  return request(params.uri || null, params.options, params.callback)
}
request.head = function (uri, options, callback) {
  var params = initParams(uri, options, callback);
  params.options.method = 'HEAD'
  if (params.options.body || 
      params.options.requestBodyStream || 
      (params.options.json && typeof params.options.json !== 'boolean') || 
      params.options.multipart) {
    throw new Error("HTTP HEAD requests MUST NOT include a request body.")
  }
  return request(params.uri || null, params.options, params.callback)
}
request.del = function (uri, options, callback) {
  var params = initParams(uri, options, callback);
  params.options.method = 'DELETE'
  return request(params.uri || null, params.options, params.callback)
}
request.jar = function () {
  return new CookieJar
}
request.cookie = function (str) {
  if (str && str.uri) str = str.uri
  if (typeof str !== 'string') throw new Error("The cookie function only accepts STRING as param")
  return new Cookie(str)
}

// Safe toJSON

function getSafe (self, uuid) {  
  if (typeof self === 'object' || typeof self === 'function') var safe = {}
  if (Array.isArray(self)) var safe = []

  var recurse = []
  
  Object.defineProperty(self, uuid, {})
  
  var attrs = Object.keys(self).filter(function (i) {
    if (i === uuid) return false 
    if ( (typeof self[i] !== 'object' && typeof self[i] !== 'function') || self[i] === null) return true
    return !(Object.getOwnPropertyDescriptor(self[i], uuid))
  })
  
  
  for (var i=0;i<attrs.length;i++) {
    if ( (typeof self[attrs[i]] !== 'object' && typeof self[attrs[i]] !== 'function') || 
          self[attrs[i]] === null
        ) {
      safe[attrs[i]] = self[attrs[i]]
    } else {
      recurse.push(attrs[i])
      Object.defineProperty(self[attrs[i]], uuid, {})
    }
  }

  for (var i=0;i<recurse.length;i++) {
    safe[recurse[i]] = getSafe(self[recurse[i]], uuid)
  }
  
  return safe
}

function toJSON () {
  return getSafe(this, (((1+Math.random())*0x10000)|0).toString(16))
}

Request.prototype.toJSON = toJSON


}).call(this,require("FWaASH"),require("buffer").Buffer)
},{"./aws":78,"./forever":79,"./mimetypes":81,"./oauth":82,"./tunnel":83,"./uuid":84,"./vendor/cookie":85,"./vendor/cookie/jar":86,"FWaASH":49,"buffer":29,"http":72,"https":46,"querystring":53,"stream":67,"tls":25,"url":68,"util":70}],81:[function(require,module,exports){
// from http://github.com/felixge/node-paperboy
exports.types = {
  "3gp":"video/3gpp",
  "aiff":"audio/x-aiff",
  "arj":"application/x-arj-compressed",
  "asf":"video/x-ms-asf",
  "asx":"video/x-ms-asx",
  "au":"audio/ulaw",
  "avi":"video/x-msvideo",
  "bcpio":"application/x-bcpio",
  "ccad":"application/clariscad",
  "cod":"application/vnd.rim.cod",
  "com":"application/x-msdos-program",
  "cpio":"application/x-cpio",
  "cpt":"application/mac-compactpro",
  "csh":"application/x-csh",
  "css":"text/css",
  "deb":"application/x-debian-package",
  "dl":"video/dl",
  "doc":"application/msword",
  "drw":"application/drafting",
  "dvi":"application/x-dvi",
  "dwg":"application/acad",
  "dxf":"application/dxf",
  "dxr":"application/x-director",
  "etx":"text/x-setext",
  "ez":"application/andrew-inset",
  "fli":"video/x-fli",
  "flv":"video/x-flv",
  "gif":"image/gif",
  "gl":"video/gl",
  "gtar":"application/x-gtar",
  "gz":"application/x-gzip",
  "hdf":"application/x-hdf",
  "hqx":"application/mac-binhex40",
  "html":"text/html",
  "ice":"x-conference/x-cooltalk",
  "ico":"image/x-icon",
  "ief":"image/ief",
  "igs":"model/iges",
  "ips":"application/x-ipscript",
  "ipx":"application/x-ipix",
  "jad":"text/vnd.sun.j2me.app-descriptor",
  "jar":"application/java-archive",
  "jpeg":"image/jpeg",
  "jpg":"image/jpeg",
  "js":"text/javascript",
  "json":"application/json",
  "latex":"application/x-latex",
  "lsp":"application/x-lisp",
  "lzh":"application/octet-stream",
  "m":"text/plain",
  "m3u":"audio/x-mpegurl",
  "m4v":"video/mp4",
  "man":"application/x-troff-man",
  "me":"application/x-troff-me",
  "midi":"audio/midi",
  "mif":"application/x-mif",
  "mime":"www/mime",
  "mkv":"  video/x-matrosk",
  "movie":"video/x-sgi-movie",
  "mp4":"video/mp4",
  "mp41":"video/mp4",
  "mp42":"video/mp4",
  "mpg":"video/mpeg",
  "mpga":"audio/mpeg",
  "ms":"application/x-troff-ms",
  "mustache":"text/plain",
  "nc":"application/x-netcdf",
  "oda":"application/oda",
  "ogm":"application/ogg",
  "pbm":"image/x-portable-bitmap",
  "pdf":"application/pdf",
  "pgm":"image/x-portable-graymap",
  "pgn":"application/x-chess-pgn",
  "pgp":"application/pgp",
  "pm":"application/x-perl",
  "png":"image/png",
  "pnm":"image/x-portable-anymap",
  "ppm":"image/x-portable-pixmap",
  "ppz":"application/vnd.ms-powerpoint",
  "pre":"application/x-freelance",
  "prt":"application/pro_eng",
  "ps":"application/postscript",
  "qt":"video/quicktime",
  "ra":"audio/x-realaudio",
  "rar":"application/x-rar-compressed",
  "ras":"image/x-cmu-raster",
  "rgb":"image/x-rgb",
  "rm":"audio/x-pn-realaudio",
  "rpm":"audio/x-pn-realaudio-plugin",
  "rtf":"text/rtf",
  "rtx":"text/richtext",
  "scm":"application/x-lotusscreencam",
  "set":"application/set",
  "sgml":"text/sgml",
  "sh":"application/x-sh",
  "shar":"application/x-shar",
  "silo":"model/mesh",
  "sit":"application/x-stuffit",
  "skt":"application/x-koan",
  "smil":"application/smil",
  "snd":"audio/basic",
  "sol":"application/solids",
  "spl":"application/x-futuresplash",
  "src":"application/x-wais-source",
  "stl":"application/SLA",
  "stp":"application/STEP",
  "sv4cpio":"application/x-sv4cpio",
  "sv4crc":"application/x-sv4crc",
  "svg":"image/svg+xml",
  "swf":"application/x-shockwave-flash",
  "tar":"application/x-tar",
  "tcl":"application/x-tcl",
  "tex":"application/x-tex",
  "texinfo":"application/x-texinfo",
  "tgz":"application/x-tar-gz",
  "tiff":"image/tiff",
  "tr":"application/x-troff",
  "tsi":"audio/TSP-audio",
  "tsp":"application/dsptype",
  "tsv":"text/tab-separated-values",
  "unv":"application/i-deas",
  "ustar":"application/x-ustar",
  "vcd":"application/x-cdlink",
  "vda":"application/vda",
  "vivo":"video/vnd.vivo",
  "vrm":"x-world/x-vrml",
  "wav":"audio/x-wav",
  "wax":"audio/x-ms-wax",
  "webm":"video/webm",
  "wma":"audio/x-ms-wma",
  "wmv":"video/x-ms-wmv",
  "wmx":"video/x-ms-wmx",
  "wrl":"model/vrml",
  "wvx":"video/x-ms-wvx",
  "xbm":"image/x-xbitmap",
  "xlw":"application/vnd.ms-excel",
  "xml":"text/xml",
  "xpm":"image/x-xpixmap",
  "xwd":"image/x-xwindowdump",
  "xyz":"chemical/x-pdb",
  "zip":"application/zip"
};

exports.lookup = function(ext, defaultType) {
  defaultType = defaultType || 'application/octet-stream';

  return (ext in exports.types)
    ? exports.types[ext]
    : defaultType;
};
},{}],82:[function(require,module,exports){
var crypto = require('crypto')
  , qs = require('querystring')
  ;

function sha1 (key, body) {
  return crypto.createHmac('sha1', key).update(body).digest('base64')
}

function rfc3986 (str) {
  return encodeURIComponent(str)
    .replace(/!/g,'%21')
    .replace(/\*/g,'%2A')
    .replace(/\(/g,'%28')
    .replace(/\)/g,'%29')
    .replace(/'/g,'%27')
    ;
}

function hmacsign (httpMethod, base_uri, params, consumer_secret, token_secret, body) {
  // adapted from https://dev.twitter.com/docs/auth/oauth
  var base = 
    (httpMethod || 'GET') + "&" +
    encodeURIComponent(  base_uri ) + "&" +
    Object.keys(params).sort().map(function (i) {
      // big WTF here with the escape + encoding but it's what twitter wants
      return escape(rfc3986(i)) + "%3D" + escape(rfc3986(params[i]))
    }).join("%26")
  var key = encodeURIComponent(consumer_secret) + '&'
  if (token_secret) key += encodeURIComponent(token_secret)
  return sha1(key, base)
}

exports.hmacsign = hmacsign
exports.rfc3986 = rfc3986
},{"crypto":35,"querystring":53}],83:[function(require,module,exports){
(function (process,Buffer){
'use strict';

var net = require('net');
var tls = require('tls');
var http = require('http');
var https = require('https');
var events = require('events');
var assert = require('assert');
var util = require('util');


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port) {
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === host && pending.port === port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port) {
  var self = this;

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push({host: host, port: port, request: req});
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket({host: host, port: port, request: req}, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, host, port);
    }

    function onCloseOrRemove(err) {
      self.removeSocket();
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false
  });
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode === 200) {
      assert.equal(head.length, 0);
      debug('tunneling connection has established');
      self.sockets[self.sockets.indexOf(placeholder)] = socket;
      cb(socket);
    } else {
      debug('tunneling socket could not be established, statusCode=%d',
            res.statusCode);
      var error = new Error('tunneling socket could not be established, ' +
                            'sutatusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
    }
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, mergeOptions({}, self.options, {
      socket: socket
    }));
    cb(secureSocket);
  });
}


function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test

}).call(this,require("FWaASH"),require("buffer").Buffer)
},{"FWaASH":49,"assert":26,"buffer":29,"events":45,"http":72,"https":46,"net":25,"tls":25,"util":70}],84:[function(require,module,exports){
module.exports = function () {
  var s = [], itoh = '0123456789ABCDEF';
 
  // Make array of random hex digits. The UUID only has 32 digits in it, but we
  // allocate an extra items to make room for the '-'s we'll be inserting.
  for (var i = 0; i <36; i++) s[i] = Math.floor(Math.random()*0x10);
 
  // Conform to RFC-4122, section 4.4
  s[14] = 4;  // Set 4 high bits of time_high field to version
  s[19] = (s[19] & 0x3) | 0x8;  // Specify 2 high bits of clock sequence
 
  // Convert to hex chars
  for (var i = 0; i <36; i++) s[i] = itoh[s[i]];
 
  // Insert '-'s
  s[8] = s[13] = s[18] = s[23] = '-';
 
  return s.join('');
}

},{}],85:[function(require,module,exports){
/*!
 * Tobi - Cookie
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var url = require('url');

/**
 * Initialize a new `Cookie` with the given cookie `str` and `req`.
 *
 * @param {String} str
 * @param {IncomingRequest} req
 * @api private
 */

var Cookie = exports = module.exports = function Cookie(str, req) {
  this.str = str;

  // Map the key/val pairs
  str.split(/ *; */).reduce(function(obj, pair){
   var p = pair.indexOf('=');
   var key = p > 0 ? pair.substring(0, p).trim() : pair.trim();
   var lowerCasedKey = key.toLowerCase();
   var value = p > 0 ? pair.substring(p + 1).trim() : true;

   if (!obj.name) {
    // First key is the name
    obj.name = key;
    obj.value = value;
   }
   else if (lowerCasedKey === 'httponly') {
    obj.httpOnly = value;
   }
   else {
    obj[lowerCasedKey] = value;
   }
   return obj;
  }, this);

  // Expires
  this.expires = this.expires
    ? new Date(this.expires)
    : Infinity;

  // Default or trim path
  this.path = this.path
    ? this.path.trim(): req 
    ? url.parse(req.url).pathname: '/';
};

/**
 * Return the original cookie string.
 *
 * @return {String}
 * @api public
 */

Cookie.prototype.toString = function(){
  return this.str;
};

},{"url":68}],86:[function(require,module,exports){
/*!
* Tobi - CookieJar
* Copyright(c) 2010 LearnBoost <dev@learnboost.com>
* MIT Licensed
*/

/**
* Module dependencies.
*/

var url = require('url');

/**
* Initialize a new `CookieJar`.
*
* @api private
*/

var CookieJar = exports = module.exports = function CookieJar() {
  this.cookies = [];
};

/**
* Add the given `cookie` to the jar.
*
* @param {Cookie} cookie
* @api private
*/

CookieJar.prototype.add = function(cookie){
  this.cookies = this.cookies.filter(function(c){
    // Avoid duplication (same path, same name)
    return !(c.name == cookie.name && c.path == cookie.path);
  });
  this.cookies.push(cookie);
};

/**
* Get cookies for the given `req`.
*
* @param {IncomingRequest} req
* @return {Array}
* @api private
*/

CookieJar.prototype.get = function(req){
  var path = url.parse(req.url).pathname
    , now = new Date
    , specificity = {};
  return this.cookies.filter(function(cookie){
    if (0 == path.indexOf(cookie.path) && now < cookie.expires
      && cookie.path.length > (specificity[cookie.name] || 0))
      return specificity[cookie.name] = cookie.path.length;
  });
};

/**
* Return Cookie string for the given `req`.
*
* @param {IncomingRequest} req
* @return {String}
* @api private
*/

CookieJar.prototype.cookieString = function(req){
  var cookies = this.get(req);
  if (cookies.length) {
    return cookies.map(function(cookie){
      return cookie.name + '=' + cookie.value;
    }).join('; ');
  }
};

},{"url":68}]},{},[2])