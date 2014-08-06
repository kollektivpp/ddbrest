![alt text](http://www.christian-bromann.com/ddbrest.png "DDBRest")

DDBRest [![Build Status](https://travis-ci.org/kollektivpp/ddbrest.svg?branch=master)](https://travis-ci.org/kollektivpp/ddbrest) [![Coverage Status](https://coveralls.io/repos/kollektivpp/ddbrest/badge.png?branch=master)](https://coveralls.io/r/kollektivpp/ddbrest?branch=master)
=======

[![Sauce Test Status](https://saucelabs.com/browser-matrix/ddbrest.svg)](https://saucelabs.com/u/ddbrest)

The [Deutsche Digitale Bibliothek](https://deutsche-digitale-bibliothek.de) is a database
that provides free access to a huge amount of cultural and scientific datasets like books,
archives, images, music or movies. With an API it makes this data available to many developers
across several platforms, except JavaScript!

The DDBRest library binds all API interfaces in little handy methods and enables an easy access
to all kinds of these data structures in Node.js and for the browser. It gives web-developers
an easy start to use the DDB for their web-applications. It is cross-browser tested and AMD
ready, so you can use it as module in your RequireJS or CommonJS application.

## Install

Either download from [GitHub](https://github.com/kollektivpp/ddbrest/archive/master.zip) or use NPM.

```sh
$ npm install ddbrest
```

or Bower

```sh
$ bower install ddbrest
```

## Getting started

To get access to the DDB you have to register a user account on the [website](https://www.deutsche-digitale-bibliothek.de/user/registration)
of the Deutsche Digitale Bibliothek. The access to the API is protected by an [oAuth 1.0a protocol](http://tools.ietf.org/html/rfc5849).
Once you are registered you will receive an access token that grants you access it.

This library is an simple wrapper for the DDB API. It provides access to all of its interfaces and uses the [Q](http://documentup.com/kriskowal/q/)
promise implementation to easy chain multiple requests.

### Setup

First, include the library and create a new instance of it by using your API token:

```html
<script type="text/javascript" src="bower_components/ddbrest/dist/ddbrest.min.js"></script>
<script>
    var api = new DDBRest('<access_token>');
</script>
```

Or in Node.js environment:

```js
var DDBRest = require('ddbrest');
var api = new DDBRest('<access_token>');
```

Or used as AMD module in [RequireJS](http://requirejs.org/):

```js
define([
    'bower_components/ddbrest/dist/ddbrest.min.js'
], function(DDBRest) {

    'use strict';

    return Backbone.Marionette.Controller.extend({

        this.api = new DDBRest('<access_token>');

        // ...
    })
});
```

### Usage

The DDB API provides five general methods to access all kinds of different date structures. They are mapped to the
DDBRest instance and return data in `application/json` format.

#### Search [#](https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/search)

    api.search([String] identifier)

The method search is providing an interface to the search engine of the DDB. You can specify your search by using
one of the following facets: `affiliate`, `place`, `role`, `keywords`, `language`, `type`, `sector`, `time`,
`provider`, `license`, `licenseGroup`. Each of these facets are function which you can chain together. At the
end you fire the request by calling the `get` command. Here are some examples:

```js
api
    .search('Da Vinci')
    .place('Florence')
    .language('latin')
    .get(0, 10)
    .then(function(res) {
        // ...
    }, function(err) {
        throw new Error(err);
    });

api
    .search('Berlin')
    .time('1941 to 1950')
    .keywords('world war 2')
    .provider('Deutsche Nationalbibliothek')
    .get(0, 100, 'ALPHA_ASC')
    .then(...)
```

*Note:* the request only gets fired if you call the `get` method. It returns a promise object you can use to chain
more request after each other. You can pass the following parameters to restrict or order the searchresult:

* **offset** `Number` ( default: 0 )<br>
  This is the number of the first entry of the result.
* **rows** `Number`<br>
  This is the count of result entries to be shown in total.
* **sort** `String` ( default: 'random_<seed>' )<br>
  Defines the sorting order, which can be one of the following values. It requires the query parameter, otherwise the sort is always random_<seed>. [`ALPHA_ASC`, `ALPHA_DESC`, `RANDOM_<seed>`, `RELEVANCE`]
* **minDocs** `Number`<br>
  The amount of documents a facet must exceed to be included in the result set.
* **facet.limit** `Number`<br>
  Limits the number of values of a facet to the given amount.

If you don't have a certain facet in your mind you can always request a list of facet suggestion. The `count` attribute
tells you how many documents you'ld find when using this facet.

```js
ddbrest.search('Berlin').keywords().get().then(function(res) {
    console.log(res.facets[9].facetValues); // output keywords facet values
    /**
     * outputs:
     * [ { count: 124481, value: 'Kapitel' },
     *   { count: 93636, value: 'Fotos' },
     *   { count: 61069, value: 'Fotografie' },
     *   { count: 58561, value: 'Abschnitt' },
     *   { count: 56823, value: 'Foto' },
     *   { count: 38884, value: 'Monographie' },
     *   { count: 27561, value: 'Szenenbilder' },
     *   { count: 22976, value: 'Monografie' },
     *   { count: 16040, value: 'Druck' },
     *   { count: 14866, value: 'Druckgrafik' },
     *   ... ]
     */
});
```

#### Binary [#](https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/binary)

    api.binary([String] identifier, [String] filepath)

The method binary returns the content of a binary file of an item for a given item-ID. This method provides response
data as application/octet-stream. A binary file at DDB can be a picture, a tumbnail of a picture, a video clip, an
audio file etc.

##### `get()`

Returns the raw binary data of requested file.

```js
api.binary('OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF','mvpr/1.jpg').get().then(function(res) {
    console.log(res);
    /**
     * outputs:
     * ~L�N��f}�<O�R�Ͱ��+�F�P���Uꯂn��jύ�\��yP99��
     * ��"��""��"���?�����^��Iĕ�π{��^.i<��?��s�
     * ���k�...
     */
})
```

##### `getPath()`

Get url of file

```js
api.binary('OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF','mvpr/1.jpg').getPath().then(function(res) {
    // res = http://api.deutsche-digitale-bibliothek.de/binary/OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF/mvpr/1.jpg?oauth_consumer_key=XXX
    $('<img />').attr('src', res).appendTo(elem);
})
```

##### `toFile()`

Download file to your file system (only Node.js environment).

```js
api.binary('OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF','mvpr/1.jpg').toFile('1.jpg');
```

#### institutions [#](https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/institutions)

    api.institutions([String] sector)

The method institutions returns a list of institutions of specific [sector types](https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/Sparte)
which are registered at the DDB.

##### `get()`

```js
api.institutions('Library').get().then(...)
// or
api.institutions('sec_02').get().then(...)
```

##### `sectors` [#](https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/sectors)

The method sectors returns the list of available institution sectors at the DDB.

```js
api.institutions('Library').sectors().then(...)
// or
api.institutions('sec_02').sectors().then(...)
```

#### items [#](https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/items)

    api.items([String] identifier)

##### `aip` [#](https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/aip)

The method aip returns the Archive Information Package (AIP) of an item for a given item-ID. An AIP contains
all available information of an item including a persistent identifier. This is the only method that returns
with an XML response.

```js
api.items('OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF').aip().then(...)
```

##### `binary` [#](https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/binary)

The method binaries returns a list of binary data files related to an item for a given item-ID. Binary data
can be accessed with the [binary method](https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/binary).

```js
api.items('OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF').binary().then(...)
```

##### `children` [#](https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/children)

The method children returns metadata of these items which are related to the inquired item and which are one
level deeper (child item) in the hierarchy than the inquired item. The child items will be sorted according
to the position field of the hierarchy nodes. If the position is the same the label will be used for sorting.
The provided metadata can be empty if the item does not have any child items.

```js
api.items('OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF').children().then(...)
```

##### `edm` [#](https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/edm)

The method edm returns the Europeana Data Model (DDB profile) of an item for a given item-ID.

```js
api.items('OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF').edm().then(...)
```

##### `indexingProfile` [#](https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/indexing-profile)

The method indexing-profile returns the profile of an item for a given item-ID, which was used for the indexing process.

```js
api.items('OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF').indexingProfile().then(...)
```

##### `parents` [#](https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/parents)

The method parents returns item-IDs of these items which are related to the inquired item and which are one or
more levels higher (parent, grandparent ... item) in the hierarchy than the inquired item. This means that all
parent items up to the root item will be provided.

```js
api.items('OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF').parents().then(...)
```

##### `source` [#](https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/source)

The method source returns the initial XML metadata of an item for a given item-ID. The format can be one of the
accepted [input data formats](https://www.deutsche-digitale-bibliothek.de/content/ddb/data_delivery) (e.g. MARCXML, METS/MODS, LIDO, Dublin Core).

```js
api.items('OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF').source().then(...)
```

##### `view` [#](https://api.deutsche-digitale-bibliothek.de/doku/display/ADD/view)

The method view returns the view of an item for a given item-ID. A view is the data set a [frontend page at DDB](https://www.deutsche-digitale-bibliothek.de/item/OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF)
is based on.

```js
api.items('OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF').view().then(...)
```

### Chain Multiple Request

As already mentioned, DDBRest uses Q promises to provide a proper way to chain multiple requests. You can combine
DDBRest with the [Q library](https://www.npmjs.org/package/q) to use the full power of promisses.

```js
var Q = require('q');

Q.all([
    api.institutions('Monument').get(), // request #1
    api.institutions('Research').get(), // request #2
    api.institutions('Museum').get(), // request #3
], function(data) {
    console.log(data[1]); // outputs response of request #1
    console.log(data[2]); // outputs response of request #2
    console.log(data[3]); // outputs response of request #3
});
```

With this technique you can also fire requests with values you've got from previous requests:

```js
ddbrest.search('Da Vinci').keywords().get().then(function(res) {
    return res.facets[9].facetValues[4].value; // returns "Bild"
}).then(function(keyword) {
    return ddbrest.search('Da Vinci').type(keyword).get();
}).then(function(res) {
    console.log(res.results[0].docs[3].subtitle); // outputs "Stoedtner, Franz (Lichtbildverlag) (Fotograf), 1900"
});
```

## Contributing

Please fork, add specs, and send pull requests! In lieu of a formal styleguide, take care to maintain the existing
coding style.

## Release History

* 2014-07-05   v0.1.0   first release
* 2014-07-06   v0.2.0   improved some implementations of first version, version to be presented at [Codingdavinci Hackathon](http://codingdavinci.de/) final









