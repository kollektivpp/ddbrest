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
