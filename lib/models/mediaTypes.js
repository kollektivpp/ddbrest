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
        term: 'mediatype_001',
        lang: ['en','de'],
        uri: 'http://ddb.vocnet.org/medientyp/mt001'
    },
    'image': {
        term: 'mediatype_002',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/medientyp/mt002'
    },
    'bild': {
        term: 'mediatype_002',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/medientyp/mt002'
    },
    'text': {
        term: 'mediatype_003',
        lang: ['en','de'],
        uri: 'http://ddb.vocnet.org/medientyp/mt003'
    },
    'full-text': {
        term: 'mediatype_004',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/medientyp/mt004'
    },
    'volltext': {
        term: 'mediatype_004',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/medientyp/mt004'
    },
    'video': {
        term: 'mediatype_005',
        lang: ['en','de'],
        uri: 'http://ddb.vocnet.org/medientyp/mt005'
    },
    'others': {
        term: 'mediatype_006',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/medientyp/mt006'
    },
    'sonstiges': {
        term: 'mediatype_006',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/medientyp/mt006'
    },
    'no media type': {
        term: 'mediatype_007',
        lang: 'en',
        uri: 'http://ddb.vocnet.org/medientyp/mt007'
    },
    'ohne medientyp': {
        term: 'mediatype_007',
        lang: 'de',
        uri: 'http://ddb.vocnet.org/medientyp/mt007'
    },
    'institution': {
        term: 'mediatype_008',
        lang: ['en','de'],
        uri: 'http://ddb.vocnet.org/medientyp/mt008'
    }
};
