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