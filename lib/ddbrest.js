/**
 * DDBRest
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 * @license https://raw.githubusercontent.com/kollektivpp/ddbrest/master/LICENSE MIT
 */

/**
 * Expose `DDBRest
 */
exports = module.exports = DDBRest;

/**
 * setup DDBRest
 * @param {String}  token   Eindeutiger API-Schlüssel des Benutzers
 * @param {Boolean} secure  if true all requests run over https
 */
function DDBRest(token, secure) {

    if (typeof token !== 'string') {
        throw new Error('API token is required to have access to the DBB API\nSee https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/Autorisierung');
    }

    this.protocol = typeof secure === 'boolean' && secure ? 'https' : 'http';
    this.host = 'api.deutsche-digitale-bibliothek.de';
    this.oauth = {
        consumer_key: token
    };

}

/**
 * Expose internals
 */
DDBRest.prototype.binary = require('./binary');
DDBRest.prototype.entities = require('./entities');
DDBRest.prototype.institutions = require('./institutions');
DDBRest.prototype.items = require('./items');
DDBRest.prototype.search = require('./search');