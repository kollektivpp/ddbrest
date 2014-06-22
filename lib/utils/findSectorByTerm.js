/**
 * find sector by term
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 *
 */

var sectorTypes = require('../models/sectorTypes');

module.exports = function(term) {

    if (!term) {
        return null;
    }

    var deElements = Object.keys(sectorTypes.de),
        enElements = Object.keys(sectorTypes.en),
        length = Math.max(deElements.length, enElements.length),
        enKey, deKey, i;

    for (i = 0; i < length; ++i) {

        enKey = enElements[i];
        deKey = deElements[i];

        if (sectorTypes.de[deKey] && sectorTypes.de[deKey].term === term) {
            sectorTypes.de[deKey].element = deKey;
            return sectorTypes.de[deKey];
        } else if (sectorTypes.de[enKey] && sectorTypes.en[enKey].term === term) {
            sectorTypes.en[enKey].element = enKey;
            return sectorTypes.en[enKey];
        }

    }

    return null;

};