/**
 * 
 * DDBRest
 *
 * js client for the DDB API
 * @see  https://api.deutsche-digitale-bibliothek.de
 * 
 */

var DDBRest = module.exports = function(token) {

    console.log(arguments)
    if(typeof token !== 'string') {
        throw new Error('API token is required to have access to the DBB API\nSee https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/Autorisierung')
    }

    this.token = token;

}