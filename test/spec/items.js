/*jshint -W030 */

var should = require('should'),
    identifier = 'OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF',
    identifierWithChildren = 'IWOE72T2J3MNATFBPFV3PI3JQ3S3UXEL';

describe('items method', function() {

    before(function() {
        should.exist(api.items);
    });

    describe('should throw an error', function() {

        it('if method gets initialised without required parameters', function() {
             api.items.bind(null).should.throw();
        });

        it('if parameter is not typeof string', function() {
             api.items.bind(null, 1).should.throw();
             api.items.bind(null, {}).should.throw();
             api.items.bind(null, []).should.throw();
             api.items.bind(null, true).should.throw();
             api.items.bind(null, function(){}).should.throw();
        });

    });

    describe('should provide an aip method that', function() {

        before(function() {
            should.exist(api.items(identifier).aip);
        });

        it('should throw an error if someone tries to pass a callback as argument', function() {
            api.items(identifier).aip.bind(null, function(){}).should.throw;
        });

        it('should return a JSON list of aips', function(done) {
            api.items(identifier).aip().then(function(item) {
                should.exist(item);
                item.should.be.type('object');
                item.properties['item-id'].should.be.exactly(identifier);
                done();
            }, done);
        });

    });

    describe('should provide a binaries method that', function() {

        before(function() {
            should.exist(api.items(identifier).binaries);
        });

        it('should throw an error if someone tries to pass a callback as argument', function() {
            api.items(identifier).binaries.bind(null, function(){}).should.throw;
        });

        it('should return a JSON list of binaries', function(done) {
            api.items(identifier).binaries().then(function(res) {
                should.exist(res.binary);
                res.binary.should.be.an.instanceOf(Array);
                res.binary[0]['@path'].should.be.exactly('/binary/' + identifier + '/list/1.jpg');
                done();
            }, done);
        });

    });

    describe('should provide a children method that', function() {

        before(function() {
            should.exist(api.items(identifier).children);
        });

        it('should return a JSON list of children', function(done) {
            api.items(identifierWithChildren).children().then(function(res) {
                should.exist(res.hierarchy);
                res.hierarchy.should.be.an.instanceOf(Array);
                res.hierarchy[0].parent.should.be.exactly(identifierWithChildren);
                res.hierarchy[0].id.should.be.exactly('5FKKRMD437OERWOZXR35G22UWMUSLD3O');
                done();
            }, done);
        });

        it('should return one single children by passing an row attribute', function(done) {
            api.items(identifierWithChildren).children(null, 1).then(function(res) {
                should.exist(res.hierarchy);
                res.hierarchy.should.have.lengthOf(1);
                done();
            }, done);
        });

        it('should return the third element by passing an offset attribute', function(done) {
            api.items(identifierWithChildren).children(2, 1).then(function(res) {
                should.exist(res.hierarchy);
                res.hierarchy.should.be.an.instanceOf(Array);
                res.hierarchy[0].parent.should.be.exactly(identifierWithChildren);
                res.hierarchy[0].id.should.be.exactly('QCCEYVUXL3XVW5VBXH4TVT3SUUNP6KEA');
                done();
            }, done);
        });

    });

    describe('should provide an edm method that', function() {

        before(function() {
            should.exist(api.items(identifier).edm);
        });

        it('should throw an error if someone tries to pass a callback as argument', function() {
            api.items(identifier).edm.bind(null, function(){}).should.throw;
        });

        it('should return a JSON list of edms', function(done) {
            api.items(identifier).edm().then(function(res) {
                should.exist(res.RDF);
                res.RDF.Place.prefLabel.should.be.exactly('Paderborn');
                done();
            }, done);
        });

    });

    describe('should provide an indexingProfile method that', function() {

        before(function() {
            should.exist(api.items(identifier).indexingProfile);
        });

        it('should throw an error if someone tries to pass a callback as argument', function() {
            api.items(identifier).indexingProfile.bind(null, function(){}).should.throw;
        });

        it('should return a JSON list of facets', function(done) {
            api.items(identifier).indexingProfile().then(function(res) {
                should.exist(res.facet);
                res['item-id'].should.be.exactly(identifier);
                res.facet[1].value.should.be.exactly('Paderborn');
                done();
            }, done);
        });

    });

    describe('should provide an parents method that', function() {

        before(function() {
            should.exist(api.items(identifier).parents);
        });

        it('should throw an error if someone tries to pass a callback as argument', function() {
            api.items(identifier).parents.bind(null, function(){}).should.throw;
        });

        it('should return a JSON list of parents', function(done) {
            api.items(identifier).parents().then(function(res) {
                should.exist(res.hierarchy);
                res.hierarchy[0].id.should.be.exactly(identifier);
                res.hierarchy[1].id.should.be.exactly(identifierWithChildren);
                done();
            }, done);
        });

    });

    describe('should provide an source method that', function() {

        before(function() {
            should.exist(api.items(identifier).source);
        });

        it('should throw an error if someone tries to pass a callback as argument', function() {
            api.items(identifier).source.bind(null, function(){}).should.throw;
        });

        it('should return a JSON list of source', function(done) {
            api.items(identifier).source().then(function() {
                // TODO source returns XML but should be json for consistency reasons
                done();
            }, done);
        });

    });

    describe('should provide an view method that', function() {

        before(function() {
            should.exist(api.items(identifier).view);
        });

        it('should throw an error if someone tries to pass a callback as argument', function() {
            api.items(identifier).view.bind(null, function(){}).should.throw;
        });

        it('should return a JSON list of view', function(done) {
            api.items(identifier).view().then(function(res) {
                should.exist(res.item);
                res.item.identifier.should.be.exactly('1003104487');
                done();
            }, done);
        });

    });

});