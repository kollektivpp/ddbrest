/**
 *
 * DDBRest
 *
 * js client for the DDB API
 *
 * @see  https://api.deutsche-digitale-bibliothek.de
 *
 */

module.exports = process.env.COV ? require('./lib-cov/ddbrest') : require('./lib/ddbrest');